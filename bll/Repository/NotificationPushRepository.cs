﻿using Microsoft.Practices.EnterpriseLibrary.Common.Configuration;
using Microsoft.Practices.EnterpriseLibrary.ExceptionHandling;
using Quantumart.QP8.BLL.Repository.Articles;
using Quantumart.QP8.Constants;
using Quantumart.QPublishing.Database;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Xml.Linq;

namespace Quantumart.QP8.BLL.Repository
{
	internal class NotificationPushRepository
	{
		#region Private fields and properties
		private int ContentId { get; set; }
		private int[] ArticleIds { get; set; }
		private Article[] Articles { get; set; }
		private Notification[] Notifications { get; set; }
		private string[] Codes { get; set; }
		private readonly ExceptionManager _exceptionManager;
		#endregion

		#region Constructor
		internal NotificationPushRepository()
		{
			Articles = new Article[0];
			Notifications = new Notification[0];
			_exceptionManager = EnterpriseLibraryContainer.Current.GetInstance<ExceptionManager>();
		}
		#endregion

		#region Internal methods
		internal void SendNotificationOneWay(string connectionString, int id, string code)
		{
			QueueAsync(() => Notify(connectionString, id, code));
		}

		internal void SendNotification(string connectionString, int id, string code)
		{
			Queue(() => Notify(connectionString, id, code));
		}

		internal void PrepareNotifications(int contentId, IEnumerable<int> articleIds, IEnumerable<string> codes, bool disableNotifications = false)
		{
			ValidateCodes(codes);
			try
			{
				if (disableNotifications)
				{
					Notifications = new Notification[0];
				}
				else
				{
					ContentId = contentId;
					Notifications = NotificationRepository.GetContentNotifications(contentId, codes).ToArray();
					PrepareArticles(articleIds, codes);
				}
			
			}
			catch (Exception ex)
			{
				Notifications = new Notification[0];
				HandleException(ex);
			}
		}

		internal void PrepareNotifications(IEnumerable<int> articleIds, IEnumerable<string> codes, bool disableNotifications = false)
		{
			ValidateCodes(codes);
			try
			{
				if (disableNotifications)
				{
					Notifications = new Notification[0];
				}
				else
				{
					ContentId = 0;
					Notifications = NotificationRepository.GetContentNotifications(articleIds, codes).ToArray();
					PrepareArticles(articleIds, codes);
				}
				
			}
			catch (Exception ex)
			{
				Notifications = new Notification[0];
				HandleException(ex);
			}
		}

		internal void PrepareNotifications(int contentId, IEnumerable<int> ids, string code, bool disableNotifications = false)
		{
			PrepareNotifications(contentId, ids, new[] { code }, disableNotifications);
		}

		internal void SendNotifications()
		{
			IEnumerable<ExternalNotification> notificationQueue;

			if (Notifications.Any())
			{
				try
				{
					if (Codes.Contains(NotificationCode.Delete))
					{
						notificationQueue = from notification in Notifications
											join article in Articles on notification.ContentId equals article.ContentId
											select new ExternalNotification
											{
												EventName = NotificationCode.Delete,
												ArticleId = article.Id,
												Url = notification.ExternalUrl,
												OldXml = GetXDocument(article).ToString(),
												NewXml = null
											};

					}
					else if (Codes.Contains(NotificationCode.Create))
					{
						notificationQueue = from notification in Notifications
											join article in GetArticles() on notification.ContentId equals article.ContentId
											select new ExternalNotification
											{
												EventName = NotificationCode.Create,
												ArticleId = article.Id,
												Url = notification.ExternalUrl,
												OldXml = null,
												NewXml = GetXDocument(article).ToString(),
											};
					}
					else
					{
						var oldArticles = Articles;
						var newArticles = GetArticles();

						notificationQueue = from notification in Notifications
											from code in Codes
											join oldArticle in oldArticles on notification.ContentId equals oldArticle.ContentId
											join newArticle in newArticles on oldArticle.Id equals newArticle.Id
											where
												notification.ForModify && code == NotificationCode.Update ||
												notification.ForFrontend && code == NotificationCode.Custom ||
												notification.ForStatusChanged && code == NotificationCode.ChangeStatus ||
												notification.ForStatusPartiallyChanged && code == NotificationCode.PartialChangeStatus ||
												notification.ForDelayedPublication && code == NotificationCode.DelayedPublication
											select new ExternalNotification
											{
												EventName = code,
												ArticleId = oldArticle.Id,
												Url = notification.ExternalUrl,
												OldXml = GetXDocument(oldArticle).ToString(),
												NewXml = GetXDocument(newArticle).ToString()
											};
					}

					ExternalNotificationRepository.Insert(notificationQueue);
				}
				catch (Exception ex)
				{
					HandleException(ex);
				}
			}
		}

		#endregion

		#region Private methods
		private void PrepareArticles(IEnumerable<int> articleIds, IEnumerable<string> codes)
		{
			Codes = codes.Distinct().ToArray();
			Articles = new Article[0];

			if (Notifications.Any())
			{
				ArticleIds = articleIds.ToArray();

				if (!Codes.Contains(NotificationCode.Create))
				{
					Articles = GetArticles();
				}
			}
		}

		private void QueueAsync(Action action)
		{
			ThreadPool.QueueUserWorkItem((o) => action());
		}

		private void Queue(Action action)
		{
			ManualResetEvent evt = new ManualResetEvent(false);
			ThreadPool.QueueUserWorkItem((o) =>
			{
				action();
				evt.Set();
			});
			evt.WaitOne();
		}

		private void Notify(string connectionString, int id, string code)
		{
			try
			{
				DBConnector cnn = new DBConnector(connectionString);
				cnn.CacheData = false;
				foreach (var simpleCode in code.Split(';'))
				{
					cnn.SendNotification(id, simpleCode);
				}
			}
			catch (Exception ex)
			{
				HandleException(ex);
			}
		}

		private XDocument GetXDocument(Article article)
		{		
			XDocument doc = new XDocument(new XElement("article", new XAttribute("id", article.Id)));

			doc.Root.Add(new XElement("created", (article.Created).ToString(CultureInfo.InvariantCulture)));
			doc.Root.Add(new XElement("modified", (article.Modified).ToString(CultureInfo.InvariantCulture)));
			doc.Root.Add(new XElement("contentId", article.ContentId));
			doc.Root.Add(new XElement("siteId", article.Content.SiteId));
			doc.Root.Add(new XElement("visible", article.Visible));
			doc.Root.Add(new XElement("archive", article.Archived));
			doc.Root.Add(new XElement("splitted", article.Splitted));
			doc.Root.Add(new XElement("statusName", article.Status.Name));
			doc.Root.Add(new XElement("lastModifiedBy", article.LastModifiedBy));
			doc.Root.Add(GetFieldValuesElement(article.FieldValues));
			var extRoot = new XElement("extensions");
			foreach (var item in article.AggregatedArticles)
			{				
				extRoot.Add(new XElement("extension", new XAttribute("typeId", item.ContentId), new XAttribute("id", item.Id), GetFieldValuesElement(item.FieldValues)));
			}
			doc.Root.Add(extRoot);
			return doc;
		}

		private XElement GetFieldValuesElement(List<FieldValue> fieldValues)
		{
			var fields = new XElement("customFields");

			foreach (var fieldValue in fieldValues)
			{
				string value;

				if (fieldValue.RelatedItems != null && fieldValue.RelatedItems.Any())
				{
					value = String.Join(",", fieldValue.RelatedItems);
				}
				else
				{
					value = fieldValue.Value;
				}

				fields.Add(new XElement("field", new XAttribute("name", fieldValue.Field.Name), new XAttribute("id", fieldValue.Field.Id), value));
			}
			return fields;
		}

		private Article[] GetArticles()
		{
			var articles = ArticleRepository.GetList(ArticleIds, true);
			if (ContentId == 0)
			{
				return articles.Where(a => a.ContentId == ContentId).ToArray();
			}
			else
			{
				return articles.ToArray();
			}			
		}

		private void ValidateCodes(IEnumerable<string> codes)
		{
			if (codes == null)
			{
				throw new ArgumentNullException("codes");
			}

			int count = codes.Count();

			if (!codes.Any())
			{
				throw new ArgumentException("no codes defined", "codes");
			}
			else if (codes.Any(c => c == NotificationCode.Create || c == NotificationCode.Delete) && count > 1)
			{
				throw new ArgumentException("codes " + NotificationCode.Create + " and " + NotificationCode.Delete + " can't be used with othes codes", "codes");
			}

			string[] availableCodes = 
			{ 
				NotificationCode.Create,
				NotificationCode.Update,
				NotificationCode.Delete,
				NotificationCode.ChangeStatus,
				NotificationCode.PartialChangeStatus,
				NotificationCode.Custom,
				NotificationCode.DelayedPublication
			};

			var wrongCodes = codes.Select(c => c.ToLowerInvariant()).Except(availableCodes).ToArray();

			if (wrongCodes.Any())
			{
				throw new ArgumentException("codes " + string.Join(", ", wrongCodes) + " is not valid", "codes");
			}
		}

		private void HandleException(Exception ex)
		{
			_exceptionManager.HandleException(ex, "Policy");
		}
		#endregion	
	}
}
