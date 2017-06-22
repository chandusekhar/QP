﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using QP8.Infrastructure.Extensions;
using Quantumart.QP8.BLL.Models.NotificationSender;
using Quantumart.QP8.Constants.Cdc;
using Quantumart.QP8.Constants.Cdc.Enums;
using Quantumart.QP8.Constants.DbColumns;
using Quantumart.QP8.Utils;
using static Quantumart.QP8.Constants.Cdc.TarantoolContentArticleModel;

namespace Quantumart.QP8.BLL.Processors.CdcCaptureInstanceImportProcessors
{
    public class CdcContentDataProcessor : CdcImportProcessor
    {
        public CdcContentDataProcessor(string captureInstanseName)
            : base(captureInstanseName)
        {
        }

        public override List<CdcTableTypeModel> ImportCdcData(string fromLsn = null, string toLsn = null)
        {
            return GetCdcDataTable(fromLsn, toLsn).AsEnumerable().Select(row =>
            {
                try
                {
                    object data = GetDataField(row);
                    object blobData = row[ContentDataColumnName.BlobData] as string;

                    return new CdcTableTypeModel
                    {
                        ChangeType = CdcActionType.Data,
                        Action = (CdcOperationType)Enum.Parse(typeof(CdcOperationType), row[TarantoolCommonConstants.Operation] as string),
                        TransactionDate = (DateTime)row[TarantoolCommonConstants.TransactionDate],
                        TransactionLsn = row[TarantoolCommonConstants.TransactionLsn] as string,
                        SequenceLsn = row[TarantoolCommonConstants.SequenceLsn] as string,
                        FromLsn = row[TarantoolCommonConstants.FromLsn] as string,
                        ToLsn = row[TarantoolCommonConstants.ToLsn] as string,
                        Entity = new CdcEntityModel
                        {
                            EntityType = ContentDataColumnName.TableName,
                            InvariantName = ContentDataColumnName.TableName.ToUpper(),
                            Columns = new Dictionary<string, object>
                            {
                                { AttributeId, Convert.ToInt32(row[ContentDataColumnName.AttributeId]) },
                                { ContentItemId, Convert.ToInt32(row[ContentDataColumnName.ContentItemId]) },
                                { ContentDataId, Convert.ToInt32(row[ContentDataColumnName.ContentDataId]) },
                                { Data, blobData ?? data },
                                { Created, (DateTime)row[ContentDataColumnName.Created] },
                                { Modified, (DateTime)row[ContentDataColumnName.Modified] }
                            },
                            MetaData = new Dictionary<string, object>
                            {
                                { IsSplitted, Equals(true, row[ContentDataColumnName.Splitted]) }
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

        private object GetDataField(DataRow row)
        {
            object data = row[ContentDataColumnName.Data] as string;
            var typedb = row[ContentDataColumnName.AttributeTypeDb] as string;
            var typeName = row[ContentDataColumnName.AttributeTypeName] as string;
            if (string.Equals(typedb, "NUMERIC", StringComparison.OrdinalIgnoreCase))
            {
                if (string.Equals(typeName, "BOOLEAN", StringComparison.OrdinalIgnoreCase))
                {
                    return Convert.ToBoolean(Convert.ToInt16(data));
                }
                else
                {
                    return data == null ? (object)null : Convert.ToDecimal(data, CultureInfo.InvariantCulture);
                }
            }

            if (string.Equals(typedb, "DATETIME", StringComparison.OrdinalIgnoreCase))
            {
                return data == null ? (object)null : Convert.ToDateTime(data, CultureInfo.InvariantCulture);
            }

            return data;
        }
    }
}
