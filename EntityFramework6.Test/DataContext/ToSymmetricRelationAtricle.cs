// Code generated by a template
using System;
using System.Linq;
using System.Collections;
using System.Collections.Generic;
namespace EntityFramework6.Test.DataContext
{
    public partial class ToSymmetricRelationAtricle: IQPArticle
    {
        public ToSymmetricRelationAtricle()
        {
		    ToSymmetricRelation = new HashSet<SymmetricRelationArticle>();
		    BackwardForSymmetricRelation = new HashSet<SymmetricRelationArticle>();
        }

        public virtual Int32 Id { get; set; }
        public virtual Int32 StatusTypeId { get; set; }
        public virtual bool Visible { get; set; }
        public virtual bool Archive { get; set; }
        public virtual DateTime Created { get; set; }
        public virtual DateTime Modified { get; set; }
        public virtual Int32 LastModifiedBy { get; set; }
        public virtual StatusType StatusType { get; set; }

		/// <summary>
		/// 
		/// </summary>
		public  ICollection<SymmetricRelationArticle> ToSymmetricRelation { get; set; }
		/// <summary>
		/// Auto-generated backing property for 38259/SymmetricRelation
		/// </summary>
		public  ICollection<SymmetricRelationArticle> BackwardForSymmetricRelation { get; set; }
	}
}
	
