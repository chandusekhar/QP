using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using QP8.Infrastructure.Extensions;
using QP8.Infrastructure.Web.Enums;
using QP8.Infrastructure.Web.Responses;
using Quantumart.QP8.BLL.Enums.Csv;
using Quantumart.QP8.BLL.Services.MultistepActions;
using Quantumart.QP8.BLL.Services.MultistepActions.Export;
using Quantumart.QP8.Constants;
using Quantumart.QP8.WebMvc.Extensions.Controllers;
using Quantumart.QP8.WebMvc.Infrastructure.ActionFilters;
using Quantumart.QP8.WebMvc.Infrastructure.Enums;
using Quantumart.QP8.WebMvc.ViewModels.MultistepSettings;

namespace Quantumart.QP8.WebMvc.Controllers
{
    public class ExportSelectedArticlesController : QPController
    {
        private readonly IMultistepActionService _service;
        private const string FolderForTemplate = "MultistepSettingsTemplates";

        public ExportSelectedArticlesController(ExportArticlesService service)
        {
            _service = service;
        }

        [HttpPost]
        [ExceptionResult(ExceptionResultMode.OperationAction)]
        [ActionAuthorize(ActionCode.ExportArticles)]
        [BackendActionContext(ActionCode.ExportArticles)]
        public ActionResult PreSettings(int parentId, int[] ids)
        {
            return Json(_service.MultistepActionSettings(parentId, 0, ids));
        }

        [HttpPost]
        [ExceptionResult(ExceptionResultMode.OperationAction)]
        [ActionAuthorize(ActionCode.ExportArticles)]
        [BackendActionContext(ActionCode.ExportArticles)]
        public async Task<ActionResult> Settings(string tabId, int parentId, [Bind(Prefix = "IDs")] int[] ids)
        {
            return await JsonHtml($"{FolderForTemplate}/ExportTemplate", new ExportViewModel
            {
                ContentId = parentId,
                Ids = ids
            });
        }

        [HttpPost]
        [ExceptionResult(ExceptionResultMode.OperationAction)]
        [ActionAuthorize(ActionCode.ExportArticles)]
        [BackendActionContext(ActionCode.ExportArticles)]
        public ActionResult Setup(int parentId, [Bind(Prefix = "IDs")] int[] ids, bool? boundToExternal)
        {
            return Json(_service.Setup(parentId, 0, ids, boundToExternal));
        }

        [HttpPost]
        [ExceptionResult(ExceptionResultMode.OperationAction)]
        [ActionAuthorize(ActionCode.ExportArticles)]
        [BackendActionContext(ActionCode.ExportArticles)]
        public JsonResult SetupWithParams(int parentId, int[] ids, ExportViewModel model)
        {
            var settings = new ExportSettings
            {
                Culture = ((CsvCulture)int.Parse(model.Culture)).Description(),
                Delimiter = char.Parse(((CsvDelimiter)int.Parse(model.Delimiter)).Description()),
                Encoding = ((CsvEncoding)int.Parse(model.Encoding)).Description(),
                LineSeparator = ((CsvLineSeparator)int.Parse(model.LineSeparator)).Description(),
                AllFields = model.AllFields,
                OrderByField = model.OrderByField
            };

            if (!settings.AllFields)
            {
                settings.CustomFieldIds = model.CustomFields ?? Enumerable.Empty<int>().ToArray();
                settings.ExcludeSystemFields = model.ExcludeSystemFields;
            }

            settings.FieldIdsToExpand = model.FieldsToExpand ?? Enumerable.Empty<int>().ToArray();
            _service.SetupWithParams(parentId, ids, settings);
            return JsonCamelCase(new JSendResponse { Status = JSendStatus.Success });
        }

        [HttpPost]
        [NoTransactionConnectionScope]
        [ExceptionResult(ExceptionResultMode.OperationAction)]
        public ActionResult Step(int stage, int step)
        {
            return Json(_service.Step(stage, step));
        }

        [HttpPost]
        public void TearDown(bool isError)
        {
            _service.TearDown();
        }
    }
}
