/*using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using AutoMapper;
using QP8.Infrastructure.Logging;
using Quantumart.QP8.BLL;
using Quantumart.QP8.BLL.Facades;
using Quantumart.QP8.BLL.Services.DTO;
using Quantumart.QP8.Configuration;
using Quantumart.QP8.Constants;
using Quantumart.QP8.Security;
using Quantumart.QP8.WebMvc.Extensions.Helpers;
using Quantumart.QP8.WebMvc.Extensions.ModelBinders;
using Quantumart.QP8.WebMvc.Extensions.ValidatorProviders;
using Quantumart.QP8.WebMvc.ViewModels;
using Quantumart.QP8.WebMvc.ViewModels.Article;
using Quantumart.QP8.WebMvc.ViewModels.ArticleVersion;
using Quantumart.QP8.WebMvc.ViewModels.CustomAction;
using Quantumart.QP8.WebMvc.ViewModels.EntityPermissions;
using Quantumart.QP8.WebMvc.ViewModels.Field;
using Quantumart.QP8.WebMvc.ViewModels.Notification;
using Quantumart.QP8.WebMvc.ViewModels.PageTemplate;
using Quantumart.QP8.WebMvc.ViewModels.Site;
using Quantumart.QP8.WebMvc.ViewModels.User;
using Quantumart.QP8.WebMvc.ViewModels.UserGroup;
using Quantumart.QP8.WebMvc.ViewModels.VirtualContent;
using Quantumart.QP8.WebMvc.ViewModels.VisualEditor;
using Quantumart.QP8.WebMvc.ViewModels.Workflow;

namespace Quantumart.QP8.WebMvc
{
    // TODO: remove Global.asax
    public class MvcApplication : HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("{resource}.ashx/{*pathInfo}");
            routes.IgnoreRoute("WebServices/{*pathInfo}");
            routes.MapRoute(
                "MultistepAction",
                "Multistep/{command}/{action}/{tabId}/{parentId}",
                new { controller = "Multistep", parentId = 0 },
                new { parentId = @"\d+" }
            );

            routes.MapRoute(
                "Properties",
                "{controller}/{action}/{tabId}/{parentId}/{id}",
                new { action = "Properties", parentId = 0 },
                new { parentId = @"\d+" }
            );

            routes.MapRoute(
                "New",
                "{controller}/{action}/{tabId}/{parentId}",
                new { action = "New" },
                new { parentId = @"\d+" }
            );

            routes.MapRoute(
                "Default",
                "{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }

        internal void Application_Start()
        {
            RegisterModelBinders();
            RegisterModelValidatorProviders();
            RegisterMappings();
            RegisterUnity();
            RegisterRoutes(RouteTable.Routes);
            RegisterValueProviders();
        }

        internal static void UnregisterRoutes()
        {
            RouteTable.Routes.Clear();
        }

        internal static void UnregisterValueProviders()
        {
            ValueProviderFactories.Factories.Clear();
        }

        internal static void RegisterValueProviders()
        {
        }

        internal static void UnregisterModelValidatorProviders()
        {
            ModelValidatorProviders.Providers.Clear();
        }

        internal static void RegisterModelValidatorProviders()
        {
            ModelValidatorProviders.Providers.Clear();
            ModelValidatorProviders.Providers.Add(new EntLibValidatorProvider());
        }

        internal static void RegisterUnity()
        {
            //var resolver = new UnityDependencyResolver();
            //DependencyResolver.SetResolver(resolver);
            //QPContext.SetUnityContainer(resolver.UnityContainer);
        }

        public static void RegisterMappings()
        {
            Mapper.Initialize(cfg =>
            {
                ViewModelMapper.CreateAllMappings(cfg);
                DTOMapper.CreateAllMappings(cfg);
                MapperFacade.CreateAllMappings(cfg);
            });

        }

        internal static void UnregisterModelBinders()
        {
            ModelBinders.Binders.Clear();
        }

        internal static void RegisterModelBinders()
        {
            ModelBinders.Binders.Add(typeof(ArticleViewModel), new ArticleViewModelBinder());
            ModelBinders.Binders.Add(typeof(ArticleVersionViewModel), new ArticleVersionViewModelBinder());
            ModelBinders.Binders.Add(typeof(ArticleSchedule), new ArticleScheduleModelBinder());
            ModelBinders.Binders.Add(typeof(RecurringSchedule), new RecurringScheduleModelBinder());
            ModelBinders.Binders.Add(typeof(QPCheckedItem), new QpCheckedItemModelBinder());
            ModelBinders.Binders.Add(typeof(IList<QPCheckedItem>), new QpCheckedItemListModelBinder());

            ModelBinders.Binders.DefaultBinder = new QpModelBinder();
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e)
        {
            var cultureName = HttpContext.Current.User.Identity is QpIdentity userIdentity
                ? userIdentity.CultureName
                : QPConfiguration.Options.Globalization.DefaultCulture;

            var cultureInfo = new CultureInfo(cultureName);
            CultureInfo.CurrentUICulture = cultureInfo;
            CultureInfo.CurrentCulture = CultureInfo.CreateSpecificCulture(cultureInfo.Name);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var exсeption = Server.GetLastError();
            if (exсeption != null)
            {
                // TODO: review uncaught error logging
                Logger.Log.SetContext(LoggerData.HttpErrorCodeCustomVariable, new HttpException(null, exсeption).GetHttpCode());
                Logger.Log.Fatal("Application_Error", exсeption);
            }
        }
    }
}
*/
