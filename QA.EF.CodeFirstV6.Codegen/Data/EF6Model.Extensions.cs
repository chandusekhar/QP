// Code generated by a template
using System;
using System.Linq;
using System.Data.Entity;
using System.Data.Common;
using System.Data.Entity.Core.EntityClient;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using Quantumart.QPublishing.Database;


namespace QA.EF.CodeFirstV6.Codegen.Data
{
    public partial class EF6Model: IQPLibraryService, IQPFormService
    {
		#region Constructors

		public EF6Model(string connectionStringOrName)
            : base(connectionStringOrName)
        {
            this.Configuration.LazyLoadingEnabled = true;
            OnContextCreated();
        }

		public EF6Model(DbConnection connection, bool contextOwnsConnection)
            : base(connection, contextOwnsConnection)
        {
            this.Configuration.LazyLoadingEnabled = true;
            OnContextCreated();
        }

        public EF6Model(DbCompiledModel model) : base(model)
        {
            this.Configuration.LazyLoadingEnabled = true;
            OnContextCreated();
        }

        public EF6Model(DbConnection connection, DbCompiledModel model, bool contextOwnsConnection)
            : base(connection, model, contextOwnsConnection)
        {
            this.Configuration.LazyLoadingEnabled = true;
            OnContextCreated();
        }


		protected ObjectContext CurrentObjectContext
		{
			get 
			{
				return ((IObjectContextAdapter)this).ObjectContext;
			}
		}

		#endregion

		#region Private members
		private const string uploadPlaceholder = "<%=upload_url%>";
		private const string sitePlaceholder = "<%=site_url%>";
		private static string _defaultSiteName = "Product Catalog";
		private static string _defaultConnectionString;
		private static string _defaultConnectionStringName = "EF6Model";
		private bool _shouldRemoveSchema = false;
		private string _siteName;
		private DBConnector _cnn;
		#endregion

		#region Properties
		public static bool RemoveUploadUrlSchema = false;

		public bool ShouldRemoveSchema { get { return _shouldRemoveSchema; } set { _shouldRemoveSchema = value; } }
		public Int32 SiteId { get; private set; }
		public string SiteUrl { get { return StageSiteUrl; } }		
		public string UploadUrl { get { return LongUploadUrl; } }		
		public string LiveSiteUrl { get; private set; }		
		public string LiveSiteUrlRel { get; private set; }		
		public string StageSiteUrl { get; private set; }		
		public string StageSiteUrlRel { get; private set; }		
		public string LongUploadUrl { get; private set; }		
		public string ShortUploadUrl { get; private set; }		
		public Int32 PublishedId { get; private set; }
		public string ConnectionString { get; private set; }
		public static string DefaultSiteName 
		{ 
			get { return _defaultSiteName; }
			set { _defaultSiteName = value; }
		}
		public DBConnector Cnn
		{
			get 
			{
				if (_cnn == null) 
				{
					_cnn = //(CurrentObjectContext.Connection != null) ? new DBConnector(((EntityConnection)CurrentObjectContext.Connection).StoreConnection) : 
					      new DBConnector(DefaultConnectionString);				
					_cnn.UpdateManyToMany = false;
				}
				return _cnn;
			}
		}
		public string SiteName 
		{ 
			get { return _siteName; } 
			set
			{
				if (!String.Equals(_siteName, value, StringComparison.InvariantCultureIgnoreCase))
				{
					_siteName = value;
					SiteId = Cnn.GetSiteId(_siteName);
					LoadSiteSpecificInfo();
				}
			}
		}
		public static string DefaultConnectionString 
		{ 
			get
			{
				if (_defaultConnectionString == null)
				{
					var obj = System.Configuration.ConfigurationManager.ConnectionStrings[_defaultConnectionStringName];
					if (obj == null)
						throw new ApplicationException(string.Format("Connection string '{0}' is not specified", _defaultConnectionStringName));
					_defaultConnectionString = obj.ConnectionString;
				}
				return _defaultConnectionString;
			}
			set
			{
				_defaultConnectionString = value;
			}
		}
		#endregion

		#region Factory methods
		public static EF6Model Create(SqlConnection connection)
		{
			return Create(connection, DefaultSiteName);
		}

		public static EF6Model Create(IMappingConfigurator configurator, SqlConnection connection, bool contextOwnsConnection)
        {
            var ctx = new EF6Model(connection, configurator.GetBuiltModel(connection), contextOwnsConnection);
            ctx.SiteName = DefaultSiteName;
            ctx.ConnectionString = connection.ConnectionString;
            return ctx;
        }

        public static EF6Model Create(IMappingConfigurator configurator, SqlConnection connection)
        {
            return Create(configurator, connection, true);
        }

        public static EF6Model Create(IMappingConfigurator configurator)
        {
            return Create(configurator, new SqlConnection(DefaultConnectionString), true);
        }

		public static EF6Model Create(string connection, string siteName) 
		{
            EF6Model ctx;
			if(connection.IndexOf("metadata", StringComparison.InvariantCultureIgnoreCase) == -1)
			{
				ctx = new EF6Model(new SqlConnection(connection), true);
				ctx.SiteName = siteName;
				ctx.ConnectionString = connection;
				return ctx;
			}

			ctx = new EF6Model(connection);
			ctx.SiteName = siteName;
			ctx.ConnectionString = connection;
			return ctx;
		}

		public static EF6Model Create(SqlConnection connection, string siteName) 
		{
			EF6Model ctx = new EF6Model(connection, false);
			ctx.SiteName = siteName;
			ctx.ConnectionString = connection.ConnectionString;
			return ctx;
		}

		public static EF6Model Create(string connection) 
		{
			return Create(connection, DefaultSiteName);
		}

		public static EF6Model Create() 
		{
			return Create(DefaultConnectionString);
		}

		#endregion

		#region Partial methods
		partial void OnObjectMaterialized(object entity);
		#endregion

		#region Helpers
		public string ReplacePlaceholders(string input)
		{
			string result = input;
			if (result != null)
			{
				result = result.Replace(uploadPlaceholder, UploadUrl);
				result = result.Replace(sitePlaceholder, SiteUrl);
			}
			return result;
		}

		public string GetUrl(string input, string className, string propertyName)
		{
            return String.Format(@"{0}/{1}", Cnn.GetUrlForFileAttribute(Cnn.GetAttributeIdByNetNames(SiteId, className, propertyName), true, ShouldRemoveSchema), input);
		}


		public string GetUploadPath(string input, string className, string propertyName)
		{
			return Cnn.GetDirectoryForFileAttribute(Cnn.GetAttributeIdByNetNames(SiteId, className, propertyName));
		}
		
		public void LoadSiteSpecificInfo()
        {
            if (RemoveUploadUrlSchema && !_shouldRemoveSchema)
            {
                _shouldRemoveSchema = RemoveUploadUrlSchema;
            }

            LiveSiteUrl = Cnn.GetSiteUrl(SiteId, true);
            LiveSiteUrlRel = Cnn.GetSiteUrlRel(SiteId, true);
            StageSiteUrl = Cnn.GetSiteUrl(SiteId, false);
            StageSiteUrlRel = Cnn.GetSiteUrlRel(SiteId, false);
            LongUploadUrl = Cnn.GetImagesUploadUrl(SiteId, false, _shouldRemoveSchema);
            ShortUploadUrl = Cnn.GetImagesUploadUrl(SiteId, true, _shouldRemoveSchema);
            PublishedId = Cnn.GetMaximumWeightStatusTypeId(SiteId);
        }
		#endregion

		partial void OnContextCreated()
		{
			this.CurrentObjectContext.ObjectMaterialized += OnObjectMaterialized;
		}

        void OnObjectMaterialized(object sender, ObjectMaterializedEventArgs e)
        {
            if (e.Entity == null)
                return;

            var entity = e.Entity;
            OnObjectMaterialized(entity);
			if(e.Entity is IQPArticle)
			{
				((IQPArticle)e.Entity).OnMaterialized(this);
			}
        }

		#region Save changes
		public override int SaveChanges()
        {
            return OnSaveChanges();
        }

        int OnSaveChanges()
        {
			base.ChangeTracker.DetectChanges();

            var objectCount = 0;
            var ctx = CurrentObjectContext;
            var manager = ctx.ObjectStateManager;

            var added = manager.GetObjectStateEntries(EntityState.Added);
            var modified = manager.GetObjectStateEntries(EntityState.Modified);
            var deleted = manager.GetObjectStateEntries(EntityState.Deleted);

            foreach (var addedItem in added)
            {
                objectCount++;
                if (!addedItem.IsRelationship)
                {
                    var entity = addedItem.Entity as IQPArticle;
					if(entity != null)
					{
                        ProcessCreating(addedItem.EntitySet.ElementType.Name, entity, addedItem);
					}
                }
                else
                {
                }
            }

            foreach (var modifiedItem in modified)
            {
                if (!modifiedItem.IsRelationship)
                {
                    objectCount++;
                    var entity = modifiedItem.Entity as IQPArticle;
                    if (entity != null)
                    {
                        ProcessUpdating(modifiedItem.EntitySet.ElementType.Name, entity, modifiedItem);
                    }
                }
                else
                {
                }
            }

            return 0;
        }


        private void ProcessCreating(string contentName, IQPArticle instance, ObjectStateEntry entry)
        {
			throw new NotImplementedException();
            var properties = entry.GetModifiedProperties().ToList();
            var values = instance.Pack(this);
            DateTime created = DateTime.Now;
            // instance.LoadStatusType();
            // todo: load first status
            const string lowestStatus = "None";
            if (!properties.Contains("Visible"))
                instance.Visible = true;
            if (!properties.Contains("Archive"))
                instance.Archive = false;

            // instance.Id = Cnn.AddFormToContent(SiteId, Cnn.GetContentIdByNetName(SiteId, contentName), lowestStatus, ref values, 0, true, 0, instance.Visible, instance.Archive, true, ref created);
            instance.Created = created;
            instance.Modified = created;
        }

		private void ProcessUpdating(string contentName, IQPArticle instance, ObjectStateEntry entry)
        {
		    throw new NotImplementedException();
		    var properties = entry.GetModifiedProperties().ToList();
			var values = instance.Pack(this);
			DateTime modified = DateTime.Now;
			throw new NotImplementedException("CUD operations are not implemented yet.");
			// Cnn.AddFormToContent(SiteId, Cnn.GetContentIdByNetName(SiteId, contentName), instance.StatusType.StatusTypeName, ref values, (int)instance.Id, true, 0, instance.Visible, instance.Archive, true, ref modified);
			// instance.Modified = modified;
        }
		#endregion
		string IQPFormService.GetFormNameByNetNames(string netContentName, string netFieldName)
		{
			return Cnn.GetFormNameByNetNames(this.SiteId, netContentName, netFieldName);
		}
	}
}
