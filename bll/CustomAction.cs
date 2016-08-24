﻿using System;
using System.Collections.Generic;
using System.Linq;
using Quantumart.QP8.Validators;
using Quantumart.QP8.Resources;
using Quantumart.QP8.Utils;
using Quantumart.QP8.BLL.Repository;

namespace Quantumart.QP8.BLL
{
	/// <summary>
	/// Custom Action
	/// </summary>
	public class CustomAction : EntityObject
	{
	    private const string SidParamName = "backend_sid";

	    public override string EntityTypeCode => Constants.EntityTypeCode.CustomAction;

	    internal static CustomAction CreateNew()
		{
			return new CustomAction
			{
				Action = new BackendAction
				{
					IsCustom = true,
					IsInterface = true,
					WindowHeight = 300,
					WindowWidth = 500,					
				},
				ShowInMenu = true,
				Sites = Enumerable.Empty<Site>(),
				Contents = Enumerable.Empty<Content>()
			};
		}

		public override void Validate()
		{
			RulesException<CustomAction> errors = new RulesException<CustomAction>();
			base.Validate(errors);

			if (Order < 0)
				errors.ErrorFor(a => a.Order, CustomActionStrings.OrderIsNotInRange);
			else if ((Order > 0) && (Action.EntityTypeId > 0) && !IsOrderUniq(Id, Order, Action.EntityTypeId))
			{
				int freeOrder = GetFreeOrder(Action.EntityTypeId);
				errors.ErrorFor(a => a.Order, String.Format(CustomActionStrings.OrderValueIsNotUniq, freeOrder));
			}
			if (Action.IsInterface && Action.IsWindow)
			{
				if(!Action.WindowHeight.HasValue)
					errors.ErrorFor(a => a.Action.WindowHeight, CustomActionStrings.WindowHeightIsNotEntered);
				else if(!Action.WindowHeight.Value.IsInRange(100, 1000))
					errors.ErrorFor(a => a.Action.WindowHeight, String.Format(CustomActionStrings.WindowHeightIsNotInRange, 100, 1000));

				if (!Action.WindowWidth.HasValue)
					errors.ErrorFor(a => a.Action.WindowWidth, CustomActionStrings.WindowWidthIsNotEntered);
				else if (!Action.WindowWidth.Value.IsInRange(100, 1000))
					errors.ErrorFor(a => a.Action.WindowWidth, String.Format(CustomActionStrings.WindowWidthIsNotInRange, 100, 1000));
			}

			if (!errors.IsEmpty)
				throw errors;
		}

		public void CalcOrder(int entityTypeId)
		{
			if (Order <= 0)
				Order = GetFreeOrder(entityTypeId);
		}

		private bool IsOrderUniq(int exceptActionId, int order, int entityTypeId)
		{
			return CustomActionRepository.IsOrderUniq(exceptActionId, order, entityTypeId);
		}

		private int GetFreeOrder(int entityTypeId)
		{
			IEnumerable<int> existingOrders = CustomActionRepository.GetActionOrdersForEntityType(entityTypeId);
		    var enumerable = existingOrders as int[] ?? existingOrders.ToArray();
		    if (enumerable.Any())
			{
				// получить максимальный используемый Order 
				int maxOrder = enumerable.Max();
				// получить минимальное из неиспользуемых значений Order
				return Enumerable.Range(1, maxOrder + 1).Except(enumerable).Min();
			}
			else
				return 1;

		}
								
		
		#region Properties
		[LocalizedDisplayName("Name", NameResourceType = typeof(EntityObjectStrings))]
		[MaxLengthValidator(255, MessageTemplateResourceName = "NameMaxLengthExceeded", MessageTemplateResourceType = typeof(EntityObjectStrings))]
		[RequiredValidator(MessageTemplateResourceName = "NameNotEntered", MessageTemplateResourceType = typeof(EntityObjectStrings))]
		[FormatValidator(Constants.RegularExpressions.InvalidFieldName, Negated = true, MessageTemplateResourceName = "NameInvalidFormat", MessageTemplateResourceType = typeof(EntityObjectStrings))]
		public override string Name
		{
			get;
			set;
		}

		[LocalizedDisplayName("Description", NameResourceType = typeof(EntityObjectStrings))]
		[MaxLengthValidator(512, MessageTemplateResourceName = "DescriptionMaxLengthExceeded", MessageTemplateResourceType = typeof(EntityObjectStrings))]
		public override string Description
		{
			get;
			set;
		}

		public int ActionId { get; set; }

		[LocalizedDisplayName("Url", NameResourceType = typeof(CustomActionStrings))]
		[MaxLengthValidator(512, MessageTemplateResourceName = "UrlMaxLengthExceeded", MessageTemplateResourceType = typeof(CustomActionStrings))]
		[RequiredValidator(MessageTemplateResourceName = "UrlNotEntered", MessageTemplateResourceType = typeof(CustomActionStrings))]
		[FormatValidator(Constants.RegularExpressions.Url, MessageTemplateResourceName = "UrlInvalidFormat", MessageTemplateResourceType = typeof(CustomActionStrings))]
		public string Url { get; set; }

		[LocalizedDisplayName("IconUrl", NameResourceType = typeof(CustomActionStrings))]
		[MaxLengthValidator(512, MessageTemplateResourceName = "IconUrlMaxLengthExceeded", MessageTemplateResourceType = typeof(CustomActionStrings))]
		[FormatValidator(Constants.RegularExpressions.Url, MessageTemplateResourceName = "IconUrlInvalidFormat", MessageTemplateResourceType = typeof(CustomActionStrings))]
		public string IconUrl { get; set; }

		public int Order { get; set; }

		public bool SiteExcluded { get; set; }
		public bool ContentExcluded { get; set; }

		[LocalizedDisplayName("ShowInMenu", NameResourceType = typeof(CustomActionStrings))]
		public bool ShowInMenu { get; set; }

		[LocalizedDisplayName("ShowInToolbar", NameResourceType = typeof(CustomActionStrings))]
		public bool ShowInToolbar { get; set; }

		private BackendAction _action;
		public BackendAction Action
		{
			get { return _action; }
			set
			{
				_action = value;
			    ParentActions = _action.ToolbarButtons?.Select(n => n.ParentActionId).ToArray();
			}
		}
		public IEnumerable<Content> Contents { get; set; }
		public IEnumerable<Site> Sites { get; set; }

		public string SessionId { get; set; }
		public IEnumerable<int> Ids { get; set; }
		public int ParentId { get; set; }
		public string FullUrl => GetFullUrl(Url);

	    private string GetFullUrl(string url)
		{
		    string parentContextName = null;
			if (Action.EntityType.ParentId.HasValue)
			{
				EntityType parentEt = EntityTypeRepository.GetById(Action.EntityType.ParentId.Value);
				parentContextName = parentEt.ContextName;
			}

		    var symbol = (Utils.Url.IsQueryEmpty(url) ? "?" : "&");
		    var ids = (Ids != null ? String.Join(",", Ids) : "");
		    var paramName = Action.EntityType.ContextName ?? "";
		    var sid = SessionId ?? "";
		    string result = $"{url ?? ""}{symbol}{SidParamName}={sid}&{paramName}={ids}&param_name={paramName}&customerCode={QPContext.CurrentCustomerCode}&actionCode={Action.Code}";
			if (parentContextName != null)
				result = result + $"&{parentContextName}={ParentId}&parent_param_name={parentContextName}";
			return result;
		}

		public string PreActionFullUrl
		{
			get
			{
				string url = (Url.Substring(Url.Length - 1, 1) == "/") ? Url.Substring(0, Url.Length - 1) + "PreAction/" : Url + "PreAction";
				return GetFullUrl(url);
			}
		}


		public int[] ParentActions { get; set; } 

		#endregion				

		public int ForceActionId { get; set; }

		public string ForceActionCode { get; set; }
			
	}
}
