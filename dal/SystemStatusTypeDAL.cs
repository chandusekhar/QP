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
    
    public partial class SystemStatusTypeDAL
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public SystemStatusTypeDAL()
        {
            this.ArticleStatusHistory = new HashSet<ArticleStatusHistoryDAL>();
        }
    
        public decimal Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Nullable<decimal> DisableClear { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ArticleStatusHistoryDAL> ArticleStatusHistory { get; set; }
    }
}
