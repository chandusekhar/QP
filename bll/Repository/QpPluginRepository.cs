using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Quantumart.QP8.BLL.Facades;
using Quantumart.QP8.BLL.ListItems;
using Quantumart.QP8.Constants;
using Quantumart.QP8.DAL;
using Quantumart.QP8.DAL.Entities;
using Quantumart.QP8.Utils;
using EntityState = Microsoft.EntityFrameworkCore.EntityState;

namespace Quantumart.QP8.BLL.Repository
{
    internal class QpPluginRepository
    {
        internal static IEnumerable<QpPluginListItem> List(ListCommand cmd, int contentId, out int totalRecords)
        {
            using (var scope = new QPConnectionScope())
            {
                var rows = Common.GetQpPluginsPage(scope.DbConnection, contentId, cmd.SortExpression, out totalRecords, cmd.StartRecord, cmd.PageSize);
                return MapperFacade.QpPluginListItemRowMapper.GetBizList(rows.ToList());
            }
        }

        /// <summary>
        /// Возвращает список Plugin по ids
        /// </summary>
        /// <returns></returns>
        internal static IEnumerable<QpPlugin> GetPluginList(IEnumerable<int> ids)
        {
            IEnumerable<decimal> decIDs = Converter.ToDecimalCollection(ids).Distinct().ToArray();
            return MapperFacade.QpPluginMapper
                .GetBizList(QPContext.EFContext.PluginSet
                    .Where(f => decIDs.Contains(f.Id))
                    .ToList()
                );
        }
        internal static QpPlugin GetById(int id)
        {
            return MapperFacade.QpPluginMapper.GetBizObject(QPContext.EFContext.PluginSet
                .Include(n => n.Fields)
                .Include(n => n.LastModifiedByUser)
                .SingleOrDefault(g => g.Id == id)
            );
        }

        internal static QpPlugin UpdatePluginProperties(QpPlugin plugin)
        {
            var entities = QPContext.EFContext;
            DateTime timeStamp;
            using (var scope = new QPConnectionScope())
            {
                timeStamp = Common.GetSqlDate(scope.DbConnection);

                var dal = MapperFacade.QpPluginMapper.GetDalObject(plugin);
                dal.LastModifiedBy = QPContext.CurrentUserId;
                dal.Modified = timeStamp;
                entities.Entry(dal).State = EntityState.Modified;
                DefaultRepository.TurnIdentityInsertOn(EntityTypeCode.QpPlugin, plugin);
                entities.SaveChanges();
                DefaultRepository.TurnIdentityInsertOff(EntityTypeCode.QpPlugin);

                var forceIds = plugin.ForceFieldIds == null ? null : new Queue<int>(plugin.ForceFieldIds);
                var fields = new List<PluginFieldDAL>();
                foreach (var field in plugin.Fields.Where(n => n.Id == 0))
                {
                    var dalField = MapperFacade.QpPluginFieldMapper.GetDalObject(field);
                    dalField.PluginId = dal.Id;
                    if (forceIds != null)
                    {
                        dalField.Id = forceIds.Dequeue();
                    }

                    entities.Entry(dalField).State = EntityState.Added;
                    fields.Add(dalField);
                }

                DefaultRepository.TurnIdentityInsertOn(EntityTypeCode.QpPluginField);
                entities.SaveChanges();
                DefaultRepository.TurnIdentityInsertOff(EntityTypeCode.QpPluginField);

                foreach (var field in fields)
                {
                    Common.AddPluginColumn(scope.DbConnection, field);
                }

                return GetById(plugin.Id);
            }
        }

        internal static void Delete(int id)
        {
            using (var scope = new QPConnectionScope())
            {
                DefaultRepository.Delete<PluginDAL>(id);
                Common.DropPluginTables(scope.DbConnection, id);
            }
        }

        internal static QpPlugin SavePluginProperties(QpPlugin plugin)
        {
            var entities = QPContext.EFContext;
            DateTime timeStamp;
            using (var scope = new QPConnectionScope())
            {
                timeStamp = Common.GetSqlDate(scope.DbConnection);

                var dal = MapperFacade.QpPluginMapper.GetDalObject(plugin);
                dal.LastModifiedBy = QPContext.CurrentUserId;
                dal.Modified = timeStamp;
                dal.Created = timeStamp;

                entities.Entry(dal).State = EntityState.Added;

                DefaultRepository.TurnIdentityInsertOn(EntityTypeCode.QpPlugin, plugin);
                if (plugin.ForceId != 0)
                {
                    dal.Id = plugin.ForceId;
                }

                entities.SaveChanges();
                DefaultRepository.TurnIdentityInsertOff(EntityTypeCode.QpPlugin);

                Common.CreatePluginTables(scope.DbConnection, (int)dal.Id);

                var forceIds = plugin.ForceFieldIds == null ? null : new Queue<int>(plugin.ForceFieldIds);
                var fields = new List<PluginFieldDAL>();
                foreach (var field in plugin.Fields)
                {
                    var dalField = MapperFacade.QpPluginFieldMapper.GetDalObject(field);
                    dalField.PluginId = dal.Id;
                    if (forceIds != null)
                    {
                        dalField.Id = forceIds.Dequeue();
                    }

                    entities.Entry(dalField).State = EntityState.Added;
                    fields.Add(dalField);
                }

                DefaultRepository.TurnIdentityInsertOn(EntityTypeCode.QpPluginField);
                entities.SaveChanges();
                DefaultRepository.TurnIdentityInsertOff(EntityTypeCode.QpPluginField);

                foreach (var field in fields)
                {
                    Common.AddPluginColumn(scope.DbConnection, field);
                }

                return MapperFacade.QpPluginMapper.GetBizObject(dal);
            }
        }

        internal static int GetPluginMaxOrder()
        {
            var plugins = QPContext.EFContext.PluginSet;
            return plugins.Any() ? plugins.Max(n => n.Order) : 0;
        }
    }
}
