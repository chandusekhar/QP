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
    
    public partial class ItemToItemDAL
    {
        public decimal LinkId { get; set; }
        public decimal LItemId { get; set; }
        public decimal RItemId { get; set; }
        public bool IS_REV { get; set; }
        public bool IS_SELF { get; set; }
    
        public virtual ArticleDAL Article { get; set; }
        public virtual ArticleDAL Article1 { get; set; }
        public virtual ContentToContentDAL ContentToContent { get; set; }
    }
}
