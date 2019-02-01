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
    
    public partial class FieldDAL :  IQpEntityObject
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public FieldDAL()
        {
            this.JoinedFields = new HashSet<FieldDAL>();
            this.JoinVirtualFields = new HashSet<FieldDAL>();
            this.RelatedFields = new HashSet<FieldDAL>();
            this.Thumbnails = new HashSet<FieldDAL>();
            this.ContentData = new HashSet<ContentDataDAL>();
            this.ItemToItemVersion = new HashSet<ItemToItemVersionDAL>();
            this.DependentNotifications = new HashSet<NotificationsDAL>();
            this.VersionContentData = new HashSet<VersionContentDataDAL>();
            this.ConstraintRule = new HashSet<ContentConstraintRuleDAL>();
            this.BackRelations = new HashSet<FieldDAL>();
            this.Aggregators = new HashSet<FieldDAL>();
            this.ChildFields = new HashSet<FieldDAL>();
            this.OrderField = new HashSet<FieldDAL>();
        }
    
        public decimal Id { get; set; }
        public decimal ContentId { get; set; }
        public string Name { get; set; }
        public string FormatMask { get; set; }
        public string InputMask { get; set; }
        public decimal Size { get; set; }
        public string DefaultValue { get; set; }
        public decimal TypeId { get; set; }
        public Nullable<decimal> RelationId { get; set; }
        public decimal IndexFlag { get; set; }
        public string Description { get; set; }
        public System.DateTime Modified { get; set; }
        public System.DateTime Created { get; set; }
        public decimal LastModifiedBy { get; set; }
        public decimal Order { get; set; }
        public decimal Required { get; set; }
        public decimal PermanentFlag { get; set; }
        public decimal PrimaryFlag { get; set; }
        public string RelationCondition { get; set; }
        public decimal DisplayAsRadioButton { get; set; }
        public bool ViewInList { get; set; }
        public bool ReadonlyFlag { get; set; }
        public decimal AllowStageEdit { get; set; }
        public string Configuration { get; set; }
        public Nullable<decimal> BaseImageId { get; set; }
        public Nullable<decimal> PersistentId { get; set; }
        public Nullable<decimal> JoinId { get; set; }
        public Nullable<decimal> LinkId { get; set; }
        public string DefaultBlobValue { get; set; }
        public bool AutoLoad { get; set; }
        public string FriendlyName { get; set; }
        public bool UseSiteLibrary { get; set; }
        public bool UseArchiveArticles { get; set; }
        public bool AutoExpand { get; set; }
        public Nullable<int> RelationPageSize { get; set; }
        public string Doctype { get; set; }
        public bool FullPage { get; set; }
        public bool RenameMatched { get; set; }
        public string Subfolder { get; set; }
        public bool DisableVersionControl { get; set; }
        public bool MapAsProperty { get; set; }
        public string NetName { get; set; }
        public string NetBackName { get; set; }
        public Nullable<bool> PEnterMode { get; set; }
        public Nullable<bool> UseEnglishQuotes { get; set; }
        public Nullable<decimal> BackRelationId { get; set; }
        public bool IsLong { get; set; }
        public string ExternalCss { get; set; }
        public string RootElementClass { get; set; }
        public bool UseForTree { get; set; }
        public bool AutoCheckChildren { get; set; }
        public bool Aggregated { get; set; }
        public Nullable<decimal> ClassifierId { get; set; }
        public bool IsClassifier { get; set; }
        public bool Changeable { get; set; }
        public bool UseRelationSecurity { get; set; }
        public bool CopyPermissionsToChildren { get; set; }
        public string EnumValues { get; set; }
        public bool ShowAsRadioButtons { get; set; }
        public bool UseForDefaultFiltration { get; set; }
        public Nullable<decimal> OrderFieldId { get; set; }
        public Nullable<decimal> ParentFieldId { get; set; }
        public bool Hide { get; set; }
        public bool Override { get; set; }
        public bool UseForContext { get; set; }
        public bool UseForVariations { get; set; }
        public bool OrderByTitle { get; set; }
        public int FieldTitleCount { get; set; }
        public bool IncludeRelationsInTitle { get; set; }
        public bool UseInChildContentFilter { get; set; }
        public bool OptimizeForHierarchy { get; set; }
        public bool IsLocalization { get; set; }
        public bool UseSeparateReverseViews { get; set; }
        public bool DisableListAutoWrap { get; set; }
        public string TaHighlightType { get; set; }
        public decimal MaxDataListItemCount { get; set; }
    
        public virtual FieldTypeDAL Type { get; set; }
        public virtual ContentDAL Content { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> JoinedFields { get; set; }
        public virtual FieldDAL JoinKeyField { get; set; }
        public virtual UserDAL LastModifiedByUser { get; set; }
        public virtual ContentToContentDAL ContentToContent { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> JoinVirtualFields { get; set; }
        public virtual FieldDAL JoinSourceField { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> RelatedFields { get; set; }
        public virtual FieldDAL RelationField { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> Thumbnails { get; set; }
        public virtual FieldDAL BaseImage { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ContentDataDAL> ContentData { get; set; }
        public virtual DynamicImageFieldDAL DynamicImageSettings { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ItemToItemVersionDAL> ItemToItemVersion { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<NotificationsDAL> DependentNotifications { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<VersionContentDataDAL> VersionContentData { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ContentConstraintRuleDAL> ConstraintRule { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> BackRelations { get; set; }
        public virtual FieldDAL BaseRelation { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> Aggregators { get; set; }
        public virtual FieldDAL Classifier { get; set; }
        public virtual FieldDAL ParentField { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> ChildFields { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<FieldDAL> OrderField { get; set; }
        public virtual FieldDAL OrderFieldChildren { get; set; }
    }
}
