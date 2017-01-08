﻿namespace Quantumart.QP8.BLL
{
    public class ArticleSearchQueryParam
    {
        public ArticleFieldSearchType SearchType { get; set; }

        public string FieldID { get; set; }

        public string ReferenceFieldID { get; set; }

        public string ContentID { get; set; }

        public string FieldColumn { get; set; }

        public object[] QueryParams { get; set; }
    }
}
