using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.DependencyInjection;
using QP8.Infrastructure.Extensions;
using QP8.Infrastructure.Logging;
using QP8.Infrastructure.Web.Enums;
using QP8.Infrastructure.Web.Responses;
using Quantumart.QP8.BLL.Services.DTO;
using Quantumart.QP8.Constants.Mvc;
using Quantumart.QP8.WebMvc.Infrastructure.Enums;
using Quantumart.QP8.WebMvc.Infrastructure.Exceptions;
using Quantumart.QP8.WebMvc.Infrastructure.Extensions;
using Quantumart.QP8.WebMvc.Infrastructure.Helpers;
using Quantumart.QP8.WebMvc.Infrastructure.Settings;

namespace Quantumart.QP8.WebMvc.Infrastructure.ActionFilters
{
    public class ExceptionResultAttribute : ExceptionFilterAttribute
    {
        private readonly ExceptionResultMode _mode;

        public ExceptionResultAttribute(ExceptionResultMode mode)
        {
            _mode = mode;
        }

        public override async Task OnExceptionAsync(ExceptionContext filterContext)
        {
            if (!ShouldBeHandled(filterContext))
            {
                return;
            }

            if (IsAjaxRequest(filterContext))
            {
                filterContext.Result = GetJsonResult(filterContext);
            }
            else
            {
                filterContext.Result = await GetContentResult(filterContext);
            }

            Logger.Log.Error($"Поймали exception со следующим URL: {filterContext.HttpContext.Request.GetDisplayUrl()}", filterContext.Exception);

            filterContext.ExceptionHandled = true;
            filterContext.HttpContext.Response.Clear();

            if (ConfigHelpers.ShouldSet500ForHandledExceptions)
            {
                filterContext.HttpContext.Response.StatusCode = 500;
            }

            // TODO: verify 500 Errors on IIS
            // filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
        }

        private static bool IsAjaxRequest(ActionContext filterContext)
        {
            return filterContext.HttpContext.Request.IsAjaxRequest();
        }

        private static bool ShouldBeHandled(ExceptionContext filterContext)
        {
            if (filterContext.ExceptionHandled)
            {
                return false;
            }

            if (filterContext.HttpContext.IsXmlDbUpdateReplayAction())
            {
                return false;
            }

            return true;
        }

        private JsonResult GetJsonResult(ExceptionContext filterContext)
        {
            Exception ex = filterContext.Exception;

            switch (_mode)
            {
                case ExceptionResultMode.UiAction:
                    return new JsonResult(new
                    {
                        success = false,
                        message = ex.Dump()
                    });

                case ExceptionResultMode.OperationAction:
                    return new JsonResult(MessageResult.Error(ex.Dump()));

                case ExceptionResultMode.JSendResponse:
                    if (ex is XmlDbUpdateLoggingException || ex is XmlDbUpdateReplayActionException)
                    {
                        Logger.Log.Warn("There was an exception at XmlDbUpdateService: ", ex);

                        return new JsonResult(new JSendResponse
                        {
                            Status = JSendStatus.Fail,
                            Message = ex.Dump(),
                        }, JsonSettingsRegistry.CamelCaseSettings);
                    }

                    Logger.Log.Error("There was an exception: ", ex);
                    return new JsonResult(new JSendResponse
                    {
                        Status = JSendStatus.Error,
                        Message = ex.Dump(),
                    }, JsonSettingsRegistry.CamelCaseSettings);

                default:
                    throw new NotSupportedException();
            }
        }

        private async Task<ContentResult> GetContentResult(ExceptionContext filterContext)
        {
            var serviceProvider = filterContext.HttpContext.RequestServices;

            var tempDataProvider = serviceProvider.GetRequiredService<ITempDataProvider>();

            var viewEngine = serviceProvider.GetRequiredService<ICompositeViewEngine>();

            var viewEngineResult = viewEngine.FindView(filterContext, "Error", false);

            var viewDataDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
            {
                Model = filterContext.Exception
            };

            var tempDataDictionary = new TempDataDictionary(filterContext.HttpContext, tempDataProvider);

            using (var writer = new StringWriter())
            {
                var viewContext = new ViewContext(
                    filterContext,
                    viewEngineResult.View,
                    viewDataDictionary,
                    tempDataDictionary,
                    writer,
                    new HtmlHelperOptions());

                await viewEngineResult.View.RenderAsync(viewContext);

                return new ContentResult
                {
                    ContentType = "text/html",
                    Content = writer.GetStringBuilder().ToString()
                };
            }
        }
    }
}
