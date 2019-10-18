﻿using System;
using Quantumart.QP8.ArticleScheduler.Interfaces;
using Quantumart.QP8.BLL;
using Quantumart.QP8.BLL.Services.API.ArticleScheduler;
using Quantumart.QP8.Configuration.Models;
using NLog;
using NLog.Fluent;

namespace Quantumart.QP8.ArticleScheduler.Publishing
{
    internal class PublishingTaskScheduler : IPublishingTaskScheduler
    {
        private readonly QaConfigCustomer _customer;
        private readonly IArticlePublishingSchedulerService _publishingService;
        private static readonly ILogger Logger = LogManager.GetCurrentClassLogger();

        public PublishingTaskScheduler(QaConfigCustomer customer, IArticlePublishingSchedulerService publishingService)
        {
            _customer = customer;
            _publishingService = publishingService;
        }

        public void Run(ArticleScheduleTask articleTask)
        {
            var task = PublishingTask.Create(articleTask);
            var currentTime = _publishingService.GetCurrentDBDateTime();
            if (ShouldProcessTask(task, currentTime))
            {
                var article = _publishingService.PublishAndCloseSchedule(task.Id);
                Logger.Info()
                    .Message(
                        "Article [{id}: {name}] has been published on customer code: {customerCode}",
                    article.Id, article.Name, _customer.CustomerName)
                    .Write();
            }
        }

        public bool ShouldProcessTask(ISchedulerTask task, DateTime dateTimeToCheck) => dateTimeToCheck >= ((PublishingTask)task).PublishingDateTime;

        public bool ShouldProcessTask(ArticleScheduleTask task, DateTime dateTimeToCheck) => ShouldProcessTask(PublishingTask.Create(task), dateTimeToCheck);
    }
}
