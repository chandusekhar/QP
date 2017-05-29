﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Quantumart.QP8.BLL.Models.NotificationSender;
using Quantumart.QP8.Constants.Cdc;
using Quantumart.QP8.Constants.Cdc.Enums;
using Quantumart.QP8.Constants.DbColumns;
using static Quantumart.QP8.Constants.Cdc.TarantoolContentToContentModel;

namespace Quantumart.QP8.BLL.Processors.CdcCaptureInstanceImportProcessors
{
    public class CdcContentToContentRevProcessor : CdcImportProcessor
    {
        public CdcContentToContentRevProcessor(string captureInstanseName)
            : base(captureInstanseName)
        {
        }

        public override List<CdcTableTypeModel> ImportCdcData(string fromLsn = null, string toLsn = null)
        {
            return GetCdcDataTable(fromLsn, toLsn).AsEnumerable().Select(row =>
            {
                var linkId = (decimal)row[ContentToContentColumnName.LinkId];
                return new CdcTableTypeModel
                {
                    ChangeType = CdcActionType.Schema,
                    Action = (CdcOperationType)Enum.Parse(typeof(CdcOperationType), row[TarantoolCommonConstants.Operation] as string),
                    TransactionDate = (DateTime)row[TarantoolCommonConstants.TransactionDate],
                    TransactionLsn = row[TarantoolCommonConstants.TransactionLsn] as string,
                    SequenceLsn = row[TarantoolCommonConstants.SequenceLsn] as string,
                    FromLsn = row[TarantoolCommonConstants.FromLsn] as string,
                    ToLsn = row[TarantoolCommonConstants.ToLsn] as string,
                    Entity = new CdcEntityModel
                    {
                        EntityType = ContentToContentColumnName.TableName,
                        InvariantName = ContentToContentColumnName.TableName.ToUpper(),
                        Columns = new Dictionary<string, object>
                        {
                            { LinkId, linkId },
                            { InvariantName, GetInvariantName(linkId, true) },
                            { LeftContentId, (decimal)row[ContentToContentColumnName.RContentId] },
                            { RightContentId, (decimal)row[ContentToContentColumnName.LContentId] },
                            { IsSymmetric, (bool)row[ContentToContentColumnName.IsSymmetric] },
                            { IsReverse, true },
                            { DefaultFieldsName, DefaultFields }
                        }
                    }
                };
            }).OrderBy(cdc => cdc.TransactionLsn).ToList();
        }
    }
}
