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
    
    public partial class SessionsLogDAL
    {
        public decimal SessionId { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public Nullable<decimal> UserId { get; set; }
        public System.DateTime StartTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public string IP { get; set; }
        public string Browser { get; set; }
        public string ServerName { get; set; }
        public int AutoLogged { get; set; }
        public string Sid { get; set; }
        public string VisualEditorUrl { get; set; }
        public bool IsQP7 { get; set; }
    }
}
