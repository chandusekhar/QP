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
    
    public partial class ContentConstraintRuleDAL
    {
        public decimal ConstraintId { get; set; }
        public decimal FieldId { get; set; }
    
        public virtual ContentConstraintDAL Constraint { get; set; }
        public virtual FieldDAL Field { get; set; }
    }
}
