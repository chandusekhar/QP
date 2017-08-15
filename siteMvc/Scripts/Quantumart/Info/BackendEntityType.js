Quantumart.QP8.BackendEntityType = function () {};
Quantumart.QP8.BackendEntityType.getEntityTypeByCode = function (entityTypeCode) {
  const cacheKey = `EntityTypeByEntityTypeCode_${entityTypeCode}`;
  let entityType = Quantumart.QP8.Cache.getItem(cacheKey);

  if (!entityType) {
    $q.getJsonFromUrl(
      'GET',
      `${window.CONTROLLER_URL_ENTITY_TYPE}/GetByCode`,
      { entityTypeCode: entityTypeCode },
      false,
      false,
      (data, textStatus, jqXHR) => {
        entityType = data;
      },
      (jqXHR, textStatus, errorThrown) => {
        entityType = null;
      }
    );

    Quantumart.QP8.Cache.addItem(cacheKey, entityType);
  }

  return entityType;
};

Quantumart.QP8.BackendEntityType.getEntityTypeById = function (entityTypeId) {
  const cacheKey = `EntityTypeByEntityTypeId_${entityTypeId}`;
  let entityTypeCode = Quantumart.QP8.Cache.getItem(cacheKey);

  if (!entityTypeCode) {
    $q.getJsonFromUrl(
      'GET',
      `${window.CONTROLLER_URL_ENTITY_TYPE}/GetCodeById`,
      { entityTypeId: entityTypeId },
      false,
      false,
      (data, textStatus, jqXHR) => {
        entityTypeCode = data;
      },
      (jqXHR, textStatus, errorThrown) => {
        entityTypeCode = null;
      }
    );

    Quantumart.QP8.Cache.addItem(cacheKey, entityTypeCode);
  }

  return Quantumart.QP8.BackendEntityType.getEntityTypeByCode(entityTypeCode);
};

Quantumart.QP8.BackendEntityType.getParentEntityTypeCodeByCode = function (entityTypeCode) {
  const cacheKey = `ParentEntityTypeCodeByEntityTypeCode_${entityTypeCode}`;
  let parentEntityTypeCode = Quantumart.QP8.Cache.getItem(cacheKey);

  if (!parentEntityTypeCode) {
    $q.getJsonFromUrl(
      'GET',
      `${window.CONTROLLER_URL_ENTITY_TYPE}/GetParentCodeByCode`,
      { entityTypeCode: entityTypeCode },
      false,
      false,
      (data, textStatus, jqXHR) => {
        parentEntityTypeCode = data;
      },
      (jqXHR, textStatus, errorThrown) => {
        parentEntityTypeCode = null;
        $q.processGenericAjaxError(jqXHR);
      }
    );

    Quantumart.QP8.Cache.addItem(cacheKey, parentEntityTypeCode);
  }

  return parentEntityTypeCode;
};

Quantumart.QP8.BackendEntityType.getEntityTypeIdToActionListItemDictionary = function () {
  const cacheKey = 'EntityTypeIdToActionListItemDictionary';
  let dictionary = Quantumart.QP8.Cache.getItem(cacheKey);

  if (!dictionary) {
    $q.getJsonFromUrl(
      'GET',
      `${window.CONTROLLER_URL_BACKEND_ACTION}GetEntityTypeIdToActionListItemsDictionary`,
      null,
      false,
      false
    )
      .done(
        data => {
          if (data.success) {
            dictionary = data.dictionary;
            Quantumart.QP8.Cache.addItem(cacheKey, data.dictionary);
          } else {
            dictionary = null;
            $q.alertError(data.Text);
          }
        })
      .fail((jqXHR, textStatus, errorThrown) => {
        dictionary = null;
        $q.processGenericAjaxError(jqXHR);
      });
  }

  return dictionary;
};

Quantumart.QP8.BackendEntityType.registerClass('Quantumart.QP8.BackendEntityType');
