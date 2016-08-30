﻿using System;
using System.Collections.Specialized;
using System.Xml;
using System.Xml.Schema;
using System.Xml.Serialization;
using Quantumart.QP8.BLL;
using Quantumart.QP8.BLL.Services;
using Quantumart.QP8.Utils;

namespace Quantumart.QP8.WebMvc.Infrastructure.Models
{
    public class XmlDbUpdateRecordedAction : IXmlSerializable
    {
        private readonly InitPropertyValue<BackendAction> _backendAction;

        public XmlDbUpdateRecordedAction()
        {
            _backendAction = new InitPropertyValue<BackendAction>(() => BackendActionService.GetByCode(Code));
        }

        public string[] Ids { get; set; }

        public int ParentId { get; set; }

        public int ResultId { get; set; }

        public int ChildId { get; set; }

        public string ChildIds { get; set; }

        public string ChildLinkIds { get; set; }

        public string VirtualFieldIds { get; set; }

        public int BackwardId { get; set; }

        public int Lcid { get; set; }

        public DateTime Executed { get; set; }

        public string ExecutedBy { get; set; }

        public string Code { get; set; }

        public string CustomActionCode { get; set; }

        public NameValueCollection Form { get; set; }

        public BackendAction BackendAction => _backendAction.Value;

        public int ActionId { get; set; }

        public string ActionCode { get; set; }

        public string FieldIds { get; set; }

        public string LinkIds { get; set; }

        public int NewLinkId { get; set; }

        public string NewChildFieldIds { get; set; }

        public string NewChildLinkIds { get; set; }

        public string NewCommandIds { get; set; }

        public string NewRulesIds { get; set; }

        public int NotificationFormatId { get; set; }

        public int DefaultFormatId { get; set; }

        public XmlSchema GetSchema()
        {
            return null;
        }

        public void ReadXml(XmlReader reader)
        {
            throw new NotImplementedException();
        }

        public void WriteXml(XmlWriter writer)
        {
            throw new NotImplementedException();
        }
    }
}
