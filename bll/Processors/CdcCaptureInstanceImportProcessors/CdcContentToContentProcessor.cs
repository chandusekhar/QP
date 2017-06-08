﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using QP8.Infrastructure.Extensions;
using Quantumart.QP8.BLL.Models.NotificationSender;
using Quantumart.QP8.Constants.Cdc;
using Quantumart.QP8.Constants.Cdc.Enums;
using Quantumart.QP8.Constants.DbColumns;
using Quantumart.QP8.Utils;
using static Quantumart.QP8.Constants.Cdc.TarantoolContentToContentModel;

namespace Quantumart.QP8.BLL.Processors.CdcCaptureInstanceImportProcessors
{
    public class CdcContentToContentProcessor : CdcImportProcessor
    {
        public CdcContentToContentProcessor(string captureInstanseName)
            : base(captureInstanseName)
        {
        }

        public override List<CdcTableTypeModel> ImportCdcData(string fromLsn = null, string toLsn = null)
        {
            return GetCdcDataTable(fromLsn, toLsn).AsEnumerable().Select(row =>
            {
                try
                {
                    var linkId = Convert.ToInt32(row[ContentToContentColumnName.LinkId]);
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
                                { InvariantName, GetInvariantName(linkId, false) },
                                { LeftContentId, Convert.ToInt32(row[ContentToContentColumnName.LContentId]) },
                                { RightContentId, Convert.ToInt32(row[ContentToContentColumnName.RContentId]) },
                                { IsSymmetric, (bool)row[ContentToContentColumnName.IsSymmetric] },
                                { IsReverse, false },
                                { DefaultFieldsName, DefaultFields }
                            }
                        }
                    };
                }
                catch (Exception ex)
                {
                    throw new Exception($"There was an exception for parsing \"{CaptureInstanceName}\" row: {row.ToSimpleDataRow().ToJsonLog()}", ex);
                }
            }).OrderBy(cdc => cdc.TransactionLsn).ToList();
        }
    }
}
