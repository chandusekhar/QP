using System.Collections.Generic;
using System.Linq;

namespace Quantumart.QP8.BLL.Repository.Articles
{
    /// <summary>
    /// Интерфейс репозитория для получения данных для блока поиска по статьям
    /// </summary>
    public interface IArticleSearchRepository
    {
        /// <summary>
        /// Возвращает список всех полей статьи
        /// </summary>
        /// <param name="contentId"></param>
        /// <returns></returns>
        IEnumerable<Field> GetAllArticleFields(int contentId);
		Dictionary<Field, IEnumerable<Field>> GetAllArticleRelatedFields(int contentId);
        /// <summary>
        /// Получить поле по ID
        /// </summary>
        /// <param name="fieldID"></param>
        /// <returns></returns>
        Field GetFieldByID(int fieldID);
        /// <summary>
        /// Получить LinkedID поля по его ID
        /// </summary>
        /// <param name="fieldID"></param>
        /// <returns></returns>
        int? GetFieldLinkedID(int fieldID);
        /// <summary>
        /// Возвращает список всех пользователей
        /// </summary>
        /// <returns></returns>
        IEnumerable<User> GetAllUsersList();
        /// <summary>
        /// Получить контент по его ID
        /// </summary>
        /// <param name="contentId"></param>
        /// <returns></returns>
        Content GetContentById(int contentId);
        /// <summary>
        /// Получить список статусов по ID сайта
        /// </summary>
        /// <param name="siteId"></param>
        /// <returns></returns>
        IEnumerable<StatusType> GetStatusList(int siteId);
    }

    /// <summary>
    /// Реализация репозитория для получения данных для блока поиска по статьям
    /// </summary>
    public class ArticleSearchRepository : IArticleSearchRepository
    {       
        public IEnumerable<Field> GetAllArticleFields(int contentId) => FieldRepository.GetFullList(contentId);

        public Dictionary<Field, IEnumerable<Field>> GetAllArticleRelatedFields(int contentId)
		{
			return FieldRepository.GetFullList(contentId).ToDictionary(f => f, GetRelatedFields);
		}

		private IEnumerable<Field> GetRelatedFields(Field field)
		{
		    if (field.RelationType == RelationType.OneToMany && field.RelationId.HasValue)
			{
				var relationField = FieldRepository.GetById(field.RelationId.Value);
				return GetAllArticleFields(relationField.ContentId).Where(f => f.UseInChildContentFilter);
			}

		    return new Field[0];
		}

        public Field GetFieldByID(int fieldID) => FieldRepository.GetById(fieldID);

        public int? GetFieldLinkedID(int fieldID)
        {
            var field = GetFieldByID(fieldID);
            if (field == null)
            {
                return null;
            }

            if (field.LinkId.HasValue)
            {
                return field.LinkId.Value;
            }

            if (field.BackRelationId.HasValue)
            {
                return field.BackRelationId.Value;
            }

            return null;
        }

        public IEnumerable<User> GetAllUsersList() => UserRepository.GetAllUsersList();

        public Content GetContentById(int contentId) => ContentRepository.GetById(contentId);

        public IEnumerable<StatusType> GetStatusList(int siteId) => StatusTypeRepository.GetStatusList(siteId);
    }
}
