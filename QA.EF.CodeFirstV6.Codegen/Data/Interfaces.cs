// Code generated by a template
using System;
using System.Collections;
using System.Data.Common;


namespace QA.EF.CodeFirstV6.Codegen.Data
{
	///<summary>
	/// An interface for all contents
	///</summary>
	public interface IQPArticle
	{
        int Id { get; set; }
        int StatusTypeId { get; set; }
        bool Visible { get; set; }
        bool Archive { get; set; }
        DateTime Created { get; set; }
        DateTime Modified { get; set; }
        int LastModifiedBy { get; set; }
		StatusType StatusType { get; set; }

		///<summary>
		/// Method used for initialization entities after them to be loaded from database
		///</summary>
		void OnMaterialized(IQPLibraryService context);

		Hashtable Pack(IQPFormService context, params string[] propertyNames);
	}

    public interface IQPLibraryService
    {
        string GetUrl(string input, string className, string propertyName);

        string GetUploadPath(string input, string className, string propertyName);

		string ReplacePlaceholders(string text);
    }

	public interface IQPFormService
	{
		string GetFormNameByNetNames(string netContentName, string netFieldName);

		string ReplacePlaceholders(string text);
	}

}
