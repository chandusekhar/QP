﻿using Quantumart.QP8.Utils;
using Quantumart.QP8.WebMvc.ViewModels;
using System.Web.Mvc;

namespace Quantumart.QP8.WebMvc.Extensions.Helpers
{
    public static class HtmlHelperPageExtensions
    {
        /// <summary>
        /// Генерирует JS-код инициализации страницы
        /// </summary>
        public static MvcHtmlString PrepareInitScript(this HtmlHelper html, ViewModel model)
        {
            return MvcHtmlString.Create($"<script>var {model.ContextObjectName} = new Quantumart.QP8.BackendDocumentContext({model.MainComponentParameters.ToJson()}, {model.MainComponentOptions.ToJson()});</script>");
        }

        /// <summary>
        /// Выполняет JS-код инициализации страницы
        /// </summary>
        public static MvcHtmlString RunInitScript(this HtmlHelper html, ViewModel model)
        {
            return MvcHtmlString.Create($"<script>{model.ContextObjectName}.init();</script>");
        }

        /// <summary>
        /// Подменяет контекст у скрипта
        /// </summary>
        public static MvcHtmlString CustomScript(this HtmlHelper html, string script, string contextObjectName)
        {
            if (string.IsNullOrEmpty(script))
            {
                return MvcHtmlString.Create(string.Empty);
            }

            return MvcHtmlString.Create($"<script>{script.Replace("QP_CURRENT_CONTEXT", contextObjectName)}</script>");
        }

        /// <summary>
        /// Генерирует и выполняет JS-код инициализации страницы
        /// </summary>
        public static MvcHtmlString InitScript(this HtmlHelper html, ViewModel model)
        {
            return MvcHtmlString.Create(html.PrepareInitScript(model).ToString() + html.RunInitScript(model).ToString());
        }
    }
}
