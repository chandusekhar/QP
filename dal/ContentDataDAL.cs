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
    
    public partial class ContentDataDAL
    {
        public decimal FieldId { get; set; }
        public decimal ArticleId { get; set; }
        public string Data { get; set; }
        public System.DateTime Created { get; set; }
        public System.DateTime Modified { get; set; }
        public string BlobData { get; set; }
        public decimal Id { get; set; }
        public bool NotForReplication { get; set; }
        public bool SPLITTED { get; set; }
    
        public virtual FieldDAL Field { get; set; }
        public virtual ArticleDAL Article { get; set; }
    }
}
