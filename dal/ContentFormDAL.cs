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
    
    public partial class ContentFormDAL
    {
        public decimal ObjectId { get; set; }
        public decimal ContentId { get; set; }
        public decimal GenerateUpdateScript { get; set; }
        public Nullable<decimal> ThankYouPageId { get; set; }
        public Nullable<decimal> NetLanguageId { get; set; }
        public Nullable<System.DateTime> Locked { get; set; }
        public Nullable<decimal> LockedBy { get; set; }
    
        public virtual ContentDAL Content { get; set; }
        public virtual UserDAL Users { get; set; }
        public virtual NetLanguagesDAL NetLanguages { get; set; }
        public virtual ObjectDAL Object { get; set; }
        public virtual PageDAL Page { get; set; }
    }
}
