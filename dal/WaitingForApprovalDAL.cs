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
    
    public partial class WaitingForApprovalDAL
    {
        public decimal ArticleId { get; set; }
        public decimal UserId { get; set; }
        public decimal StatusTypeId { get; set; }
    
        public virtual ArticleDAL Article { get; set; }
        public virtual StatusTypeDAL StatusType { get; set; }
        public virtual UserDAL Users { get; set; }
    }
}
