Quantumart.QP8.BackendArticleSearchBlock.ClassifierFieldSearch = function (containerElement, parentEntityId, fieldID, contentID, fieldColumn, fieldName, fieldGroup, referenceFieldID, searchType) {
  Quantumart.QP8.BackendArticleSearchBlock.ClassifierFieldSearch.initializeBase(this, [containerElement, parentEntityId, fieldID, contentID, fieldColumn, fieldName, fieldGroup, referenceFieldID, searchType]);
  this._searchType = searchType;
  this._onIsNullCheckBoxChangeHandler = $.proxy(this._onIsNullCheckBoxChange, this);
};

Quantumart.QP8.BackendArticleSearchBlock.ClassifierFieldSearch.prototype = {
  _contentElement: null,
  initialize: function () {
    let serverContent;
    $q.getJsonFromUrl('GET', `${window.CONTROLLER_URL_ARTICLE_SEARCH_BLOCK}ContentsListForClassifier`, {
      elementIdPrefix: this._elementIdPrefix,
      fieldID: this._fieldID
    }, false, false, (data, textStatus, jqXHR) => {
      if (data.success) {
        serverContent = data.view;
      } else {
        $q.alertError(data.message);
      }
    }, (jqXHR, textStatus, errorThrown) => {
      serverContent = null;
      $q.processGenericAjaxError(jqXHR);
    });

    if (!$q.isNullOrWhiteSpace(serverContent)) {
      const isNullCheckBoxID = `${this._elementIdPrefix}_isNullCheckBox`;
      const contentID = `${this._elementIdPrefix}_contentID`;

      // полученную с сервера разметку добавить на страницу
      const $containerElement = $(this._containerElement);
      $containerElement.html(serverContent);

      const $content = $containerElement.find(`#${contentID}`);

      // назначить обработчик события change чекбоксу
      const $isNullCheckBoxElement = $containerElement.find(`#${isNullCheckBoxID}`);
      $isNullCheckBoxElement.bind('change', this._onIsNullCheckBoxChangeHandler);

      // запомнить ссылку на dom-элементы
      this._isNullCheckBoxElement = $isNullCheckBoxElement.get(0);
      this._contentElement = $content.get(0);

      $(document).ready(this._onLoadHandler);
    }
  },

  get_searchQuery: function () {
    const contentObj = new Array($(this._contentElement).val());
    return Quantumart.QP8.BackendArticleSearchBlock.createFieldSearchQuery(this._searchType, this._fieldID, this._fieldColumn, this._contentID, this._referenceFieldID, contentObj, this.get_IsNull(), false);
  },

  get_blockState: function () {
    return new Quantumart.QP8.BackendArticleSearchBlock.FieldSearchState(this._searchType, this._fieldID, this._contentID, this._fieldColumn, this._fieldName, this._fieldGroup, this._referenceFieldID, {
      isNull: this.get_IsNull(),
      contentID: $(this._contentElement).val()
    });
  },

  get_filterDetails: function () {
    const stateData = this.get_blockState().data;
    if (stateData.isNull) {
      return $l.SearchBlock.isNullCheckBoxLabelText;
    } else if (stateData.contentID) {
      return $q.cutShort($(this._contentElement).find(`[value=${stateData.contentID}]`).text(), 12);
    }
    return '';

  },

  restore_blockState: function (state) {
    if (state) {
      if (this._isNullCheckBoxElement) {
        let $isNullCheckBoxElement = $(this._isNullCheckBoxElement);
        $isNullCheckBoxElement.prop('checked', state.isNull);
        $isNullCheckBoxElement.trigger('change');
        $isNullCheckBoxElement = null;
      }

      Sys.Debug.trace(state.contentID);
      if (!$q.isNull(state.contentID)) {
        $(this._contentElement).val(state.contentID);
      }
    }
  },

  _onIsNullCheckBoxChangeHandler: null,
  get_IsNull: function () {
    if (this._isNullCheckBoxElement) {
      return $(this._isNullCheckBoxElement).is(':checked');
    }
    return false;

  },

  _onIsNullCheckBoxChange: function () {
    if (this.get_IsNull()) {
      $(this._contentElement).prop('disabled', true);
    } else {
      $(this._contentElement).prop('disabled', false);
    }
  },

  dispose: function () {
    if (this._isNullCheckBoxElement) {
      const $isNullCheckBoxElement = $(this._isNullCheckBoxElement);
      $isNullCheckBoxElement.unbind('change', this._onIsNullCheckBoxChangeHandler);
    }

    $c.destroyAllNumericTextBoxes(this._contentElement);
    this._isNullCheckBoxElement = null;
    this._onIsNullCheckBoxChangeHandler = null;
    this._contentElement = null;

    Quantumart.QP8.BackendArticleSearchBlock.ClassifierFieldSearch.callBaseMethod(this, 'dispose');
  },

  _searchType: 0,
  _isNullCheckBoxElement: null,
  _contentID: null
};

Quantumart.QP8.BackendArticleSearchBlock.ClassifierFieldSearch.registerClass('Quantumart.QP8.BackendArticleSearchBlock.ClassifierFieldSearch', Quantumart.QP8.BackendArticleSearchBlock.FieldSearchBase);
