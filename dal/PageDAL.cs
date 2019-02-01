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
    
    public partial class PageDAL :  IQpEntityObject
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PageDAL()
        {
            this.ContentForm = new HashSet<ContentFormDAL>();
            this.Object = new HashSet<ObjectDAL>();
            this.PageTrace = new HashSet<PageTraceDAL>();
        }
    
        public decimal Id { get; set; }
        public decimal TemplateId { get; set; }
        public string Name { get; set; }
        public string Filename { get; set; }
        public decimal ProxyCache { get; set; }
        public decimal CacheHours { get; set; }
        public string Charset { get; set; }
        public decimal Codepage { get; set; }
        public decimal Locale { get; set; }
        public string Description { get; set; }
        public decimal Reassemble { get; set; }
        public System.DateTime Created { get; set; }
        public System.DateTime Modified { get; set; }
        public decimal LastModifiedBy { get; set; }
        public System.DateTime Assembled { get; set; }
        public decimal LastAssembledBy { get; set; }
        public bool GenerateTrace { get; set; }
        public string Folder { get; set; }
        public Nullable<System.DateTime> Locked { get; set; }
        public Nullable<decimal> LockedBy { get; set; }
        public bool EnableViewstate { get; set; }
        public bool DisableBrowseServer { get; set; }
        public bool SendLastModifiedHeader { get; set; }
        public string CustomClass { get; set; }
        public bool AssembleInLive { get; set; }
        public bool AssembleInStage { get; set; }
        public Nullable<bool> SendNocacheHeaders { get; set; }
        public bool PermanentLock { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ContentFormDAL> ContentForm { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ObjectDAL> Object { get; set; }
        public virtual UserDAL LockedByUser { get; set; }
        public virtual PageTemplateDAL PageTemplate { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PageTraceDAL> PageTrace { get; set; }
        public virtual UserDAL LastModifiedByUser { get; set; }
    }
}
