// #region class BackendEntityType
Quantumart.QP8.BackendEntityType = function () {};

// Возвращает тип сущности по ее коду
Quantumart.QP8.BackendEntityType.getEntityTypeByCode = function Quantumart$QP8$BackendEntityType$getEntityTypeByCode(entityTypeCode) {
	var cacheKey = "EntityTypeByEntityTypeCode_" + entityTypeCode;
	var entityType = $cache.getItem(cacheKey);

	if (!entityType) {
		$q.getJsonFromUrl(
			"GET",
			CONTROLLER_URL_ENTITY_TYPE + "/GetByCode",
			{ entityTypeCode: entityTypeCode },
			false,
			false,
			function (data, textStatus, jqXHR) {
				entityType = data;
			},
			function (jqXHR, textStatus, errorThrown) {
				entityType = null;
			}
		);

		$cache.addItem(cacheKey, entityType);
	}

	return entityType;
};

// Возвращает тип сущности по его id
Quantumart.QP8.BackendEntityType.getEntityTypeById = function Quantumart$QP8$BackendEntityType$getEntityTypeByCode(entityTypeId) {
	var cacheKey = "EntityTypeByEntityTypeId_" + entityTypeId;
	var entityTypeCode = $cache.getItem(cacheKey);

	if (!entityTypeCode) {
		$q.getJsonFromUrl(
			"GET",
			CONTROLLER_URL_ENTITY_TYPE + "/GetCodeById",
			{ entityTypeId: entityTypeId },
			false,
			false,
			function (data, textStatus, jqXHR) {
				entityTypeCode = data;
			},
			function (jqXHR, textStatus, errorThrown) {
				entityTypeCode = null;
			}
		);

		$cache.addItem(cacheKey, entityTypeCode);
	}

	return Quantumart.QP8.BackendEntityType.getEntityTypeByCode(entityTypeCode);
};

// Возвращает код типа родительской сущности
Quantumart.QP8.BackendEntityType.getParentEntityTypeCodeByCode = function Quantumart$QP8$BackendEntityType$getParentEntityTypeCodeByCode(entityTypeCode) {
	var cacheKey = "ParentEntityTypeCodeByEntityTypeCode_" + entityTypeCode;
	var parentEntityTypeCode = $cache.getItem(cacheKey);

	if (!parentEntityTypeCode) {
		$q.getJsonFromUrl(
			"GET",
			CONTROLLER_URL_ENTITY_TYPE + "/GetParentCodeByCode",
			{ entityTypeCode: entityTypeCode },
			false,
			false,
			function (data, textStatus, jqXHR) {
				parentEntityTypeCode = data;
			},
			function (jqXHR, textStatus, errorThrown) {
				parentEntityTypeCode = null;
				$q.processGenericAjaxError(jqXHR);
			}
		);

		$cache.addItem(cacheKey, parentEntityTypeCode);
	}

	return parentEntityTypeCode;
};

Quantumart.QP8.BackendEntityType.getEntityTypeIdToActionListItemDictionary = function Quantumart$QP8$BackendEntityType$getEntityTypeIdToActionListItemDictionary() {
	var cacheKey = "EntityTypeIdToActionListItemDictionary";
	var dictionary = $cache.getItem(cacheKey);
	if (!dictionary) {
		$q.getJsonFromUrl(
			"GET",
			CONTROLLER_URL_BACKEND_ACTION + "GetEntityTypeIdToActionListItemsDictionary",
			null,
			false,
			false
		)
		.done(
			function (data) {
				if (data.success) {
					dictionary = data.dictionary;
					$cache.addItem(cacheKey, data.dictionary);
				} else {
					dictionary = null;
					alert(data.Text);
				}
		})
		.fail(function (jqXHR, textStatus, errorThrown) {
			dictionary = null;
			$q.processGenericAjaxError(jqXHR);
		});
	}
	return dictionary;
};

Quantumart.QP8.BackendEntityType.registerClass("Quantumart.QP8.BackendEntityType");

// #endregion
