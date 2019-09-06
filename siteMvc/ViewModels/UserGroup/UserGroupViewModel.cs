using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Quantumart.QP8.BLL;
using Quantumart.QP8.BLL.Services;
using Quantumart.QP8.Resources;
using Quantumart.QP8.Utils.Binders;
using Quantumart.QP8.WebMvc.ViewModels.Abstract;

namespace Quantumart.QP8.WebMvc.ViewModels.UserGroup
{
    public class UserGroupViewModel : EntityViewModel
    {
        private IUserGroupService _service;

        public BLL.UserGroup Data
        {
            get => (BLL.UserGroup)EntityData;
            set => EntityData = value;
        }

        public static UserGroupViewModel Create(BLL.UserGroup group, string tabId, int parentId, IUserGroupService service)
        {
            var model = Create<UserGroupViewModel>(group, tabId, parentId);
            model._service = service;
            model.Init();
            return model;
        }

        public override string EntityTypeCode => Constants.EntityTypeCode.UserGroup;

        public override string ActionCode => IsNew ? Constants.ActionCode.AddNewUserGroup : Constants.ActionCode.UserGroupProperties;

        private void Init()
        {
            if (IsNew)
            {
                Data.Users = Enumerable.Empty<BLL.User>();
            }

            BindedUserIDs = Data.Users.Select(u => u.Id).ToArray();
            ParentGroupId = Data.ParentGroup?.Id ?? 0;
        }

        public override void DoCustomBinding()
        {
            base.DoCustomBinding();
            Data.Users = BindedUserIDs.Any() ? _service.GetUsers(BindedUserIDs) : Enumerable.Empty<BLL.User>();
            Data.ParentGroup = ParentGroupId.HasValue ? _service.Read(ParentGroupId.Value) : null;
        }

        [Display(Name = "BindedUserIDs", ResourceType = typeof(UserGroupStrings))]
        [ModelBinder(BinderType = typeof(IdArrayBinder))]
        public IEnumerable<int> BindedUserIDs { get; set; }

        [Display(Name = "ParentGroup", ResourceType = typeof(UserGroupStrings))]
        public int? ParentGroupId { get; set; }

        public IEnumerable<ListItem> BindedUserListItems
        {
            get
            {
                return Data.Users
                    .Select(u => new ListItem(u.Id.ToString(), u.Name))
                    .ToArray();
            }
        }

        public IEnumerable<ListItem> GetGroupList()
        {
            return new[]
                {
                    new ListItem(string.Empty, UserGroupStrings.SelectParentGroup)
                }
                .Concat(_service.GetAllGroups()
                    .Where(g => g.Id != Data.Id && !g.UseParallelWorkflow)
                    .Select(g => new ListItem(g.Id.ToString(), g.Name)))
                .ToArray();
        }
    }
}
