﻿using System.Collections.Generic;
using System.Linq;
using Quantumart.QP8.BLL.Repository;

namespace Quantumart.QP8.BLL.Services.Audit
{
	public interface IRemovedEntitiesService
	{
		ListResult<RemovedEntity> GetPage(ListCommand cmd);
	}
	public class RemovedEntitiesService : IRemovedEntitiesService
	{
		private readonly IRemovedEntitiesPagesRepository repository;

		public RemovedEntitiesService(IRemovedEntitiesPagesRepository repository)
		{
			this.repository = repository;
		}

		#region IRemovedEntitiesService Members

		public ListResult<RemovedEntity> GetPage(ListCommand cmd)
		{
            List<RemovedEntity> data = repository.GetPage(cmd, out int totalRecords).ToList();
            return new ListResult<RemovedEntity>
			{
				Data = data,
				TotalRecords = totalRecords
			};
		}

		#endregion
	}
}
