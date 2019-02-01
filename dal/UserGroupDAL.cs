//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
namespace Quantumart.QP8.DAL
{
    
    public partial class UserGroupDAL
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public UserGroupDAL()
        {
            this.ContentAccess = new HashSet<ContentPermissionDAL>();
            this.ContentFolderAccess = new HashSet<ContentFolderAccessDAL>();
            this.ArticleAccess = new HashSet<ArticlePermissionDAL>();
            this.FolderAccess = new HashSet<SiteFolderPermissionDAL>();
            this.Notifications = new HashSet<NotificationsDAL>();
            this.SiteAccess = new HashSet<SitePermissionDAL>();
            this.WorkflowAccess = new HashSet<WorkflowPermissionDAL>();
            this.WorkflowRules = new HashSet<WorkflowRulesDAL>();
            this.Users = new HashSet<UserDAL>();
            this.ParentGroups = new HashSet<UserGroupDAL>();
            this.ChildGroups = new HashSet<UserGroupDAL>();
            this.ACTION_ACCESS = new HashSet<BackendActionPermissionDAL>();
            this.ENTITY_TYPE_ACCESS = new HashSet<EntityTypePermissionDAL>();
        }
    
        public decimal Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Nullable<System.DateTime> Created { get; set; }
        public Nullable<System.DateTime> Modified { get; set; }
        public decimal LastModifiedBy { get; set; }
        public decimal SharedArticles { get; set; }
        public string NtGroup { get; set; }
        public byte[] AdSid { get; set; }
        public bool BuiltIn { get; set; }
        public bool IsReadOnly { get; set; }
        public bool UseParallelWorkflow { get; set; }
        public bool CanUnlockItems { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ContentPermissionDAL> ContentAccess { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ContentFolderAccessDAL> ContentFolderAccess { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ArticlePermissionDAL> ArticleAccess { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SiteFolderPermissionDAL> FolderAccess { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NotificationsDAL> Notifications { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SitePermissionDAL> SiteAccess { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<WorkflowPermissionDAL> WorkflowAccess { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<WorkflowRulesDAL> WorkflowRules { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserDAL> Users { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserGroupDAL> ParentGroups { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<UserGroupDAL> ChildGroups { get; set; }
        public virtual UserDAL LastModifiedByUser { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<BackendActionPermissionDAL> ACTION_ACCESS { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<EntityTypePermissionDAL> ENTITY_TYPE_ACCESS { get; set; }
    }
}
