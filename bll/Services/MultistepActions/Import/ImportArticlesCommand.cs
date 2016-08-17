using System;
using System.Transactions;
using System.Web;
using Quantumart.QP8.BLL.Exceptions;
using Quantumart.QP8.BLL.Helpers;
using Quantumart.QP8.BLL.Services.MultistepActions.Csv;
using Quantumart.QP8.Logging.Services;
using Quantumart.QP8.Resources;

namespace Quantumart.QP8.BLL.Services.MultistepActions.Import
{
    public class ImportArticlesCommand : IMultistepActionStageCommand
    {
        private const int ItemsPerStep = 20;
        private readonly ILogReader _logReader;
		private readonly IImportArticlesLogger _logger;

        public int SiteId { get; set; }

        public int ContentId { get; set; }

        public int ItemCount { get; set; }

		public ImportArticlesCommand(MultistepActionStageCommandState state, ILogReader logReader, IImportArticlesLogger logger)
			: this(state.ParentId, state.Id, 0, logReader, logger)
		{
		}

		public ImportArticlesCommand(int siteId, int contentId, int itemCount, ILogReader logReader, IImportArticlesLogger logger)
        {
            SiteId = siteId;
            ContentId = contentId;
            ItemCount = itemCount;
			_logReader = logReader;
			_logger = logger;
        }

        public MultistepActionStageCommandState GetState()
        {
            return new MultistepActionStageCommandState
            {
                ParentId = SiteId,
                Id = ContentId
            };
        }

        public MultistepActionStepResult Step(int step)
        {
            if (HttpContext.Current.Session["ImportArticlesService.Settings"] == null)
            {
                throw new ArgumentException("There is no specified settings");
            }

            var setts = HttpContext.Current.Session["ImportArticlesService.Settings"] as ImportSettings;
            var reader = new CsvReader(SiteId, ContentId, setts);
            var result = new MultistepActionStepResult();
			using (var tscope = new TransactionScope())
			{
                using (new QPConnectionScope())
                {
                    try
                    {
                        int processedItemsCount;
                        reader.Process(step, ItemsPerStep, out processedItemsCount);

                        if (step * ItemsPerStep >= reader.ArticleCount - ItemsPerStep)
                        {
                            reader.PostUpdateM2MRelationAndO2MRelationFields();
                        }

                        _logger.LogStep(step, setts);
                        result.ProcessedItemsCount = processedItemsCount;
                        result.AdditionalInfo = _logReader.Read();
                    }
                    catch (Exception ex)
                    {
                        throw new ImportException(string.Format(ImportStrings.ImportInterrupted, ex.Message, reader.LastProcessed), ex, setts);
                    }
                }

			    tscope.Complete();
			}

            return result;
        }

        public MultistepStageSettings GetStageSettings()
        {
            return new MultistepStageSettings
            {
                ItemCount = ItemCount,
                StepCount = MultistepActionHelper.GetStepCount(ItemCount, ItemsPerStep),
                Name = ContentStrings.ImportArticles
            };
        }
    }
}
