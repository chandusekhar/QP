Quantumart.QP8.BackendArticleSearchBlock.FullTextBlock = function (fullTextBlockElement, parentEntityId) {
  this._fullTextBlockElement = fullTextBlockElement;
  this._parentEntityId = parentEntityId;
  this._elementIdPrefix = Quantumart.QP8.BackendSearchBlockBase.generateElementPrefix();
};

Quantumart.QP8.BackendArticleSearchBlock.FullTextBlock.prototype = {
  _fullTextBlockElement: null,
  _textFieldsComboElement: null,
  _queryTextBoxElement: null,
  _parentEntityId: 0,
  _elementIdPrefix: '',

  initialize: function () {
    let serverContent;

    $q.getJsonFromUrl('GET', `${window.CONTROLLER_URL_ARTICLE_SEARCH_BLOCK}FullTextBlock`, {
      parentEntityId: this._parentEntityId,
      elementIdPrefix: this._elementIdPrefix
    }, false, false, data => {
      if (data.success) {
        serverContent = data.view;
      } else {
        $q.alertError(data.message);
      }
    }, jqXHR => {
      serverContent = null;
      $q.processGenericAjaxError(jqXHR);
    });

    if (!$q.isNullOrWhiteSpace(serverContent)) {
      let $fullTextBlockElement = $(this._fullTextBlockElement);

      $fullTextBlockElement.html(serverContent);
      this._textFieldsComboElement = $fullTextBlockElement.find(`#${this._elementIdPrefix}_TextFieldsCombo`).get(0);
      $(this._textFieldsComboElement).bind('change', $.proxy(this.onFieldChanged, this));
      this._queryTextBoxElement = $fullTextBlockElement.find(`#${this._elementIdPrefix}_QueryTextBox`).get(0);
      $fullTextBlockElement = null;
    }
  },

  get_searchQuery: function () {
    const data = this._get_searchData();
    if (data) {
      return Quantumart.QP8.BackendArticleSearchBlock.createFieldSearchQuery(Quantumart.QP8.Enums.ArticleFieldSearchType.FullText, data.fieldID, data.fieldColumn, data.contentID, data.referenceFieldID, data.text);
    }

    return null;
  },

  get_blockState: function () {
    const data = this._get_searchData();

    if (data) {
      const state = {};
      if (data.fieldID) {
        state.fieldID = data.fieldID;
      }

      if (data.text) {
        state.text = data.text;
      }

      if ($.isEmptyObject(state)) {
        return null;
      }

      return state;

    }

    return null;
  },

  restore_blockState: function (state) {
    if (state) {
      $(this._queryTextBoxElement).prop('value', state.text);

      let $selectedField = null;

      if (state.fieldID) {
        $selectedField = $(`option[data-field_id='${state.fieldID}']`, this._textFieldsComboElement);
      } else {
        $selectedField = $('option[data-field_id=]', this._textFieldsComboElement);
      }

      $selectedField.prop('selected', true);
    }
  },

  _get_searchData: function () {
    if (this._textFieldsComboElement) {
      const $selectedField = $(this._textFieldsComboElement).find('option:selected');

      if ($selectedField) {
        const fieldValue = $selectedField.val();
        const fieldID = $selectedField.data('field_id');
        const contentID = $selectedField.data('content_id');
        const fieldColumn = $selectedField.attr('field_column');
        const referenceFieldID = $selectedField.data('reference_field_id');

        return {
          fieldID: fieldID,
          contentID: contentID,
          referenceFieldID: referenceFieldID,
          fieldColumn: fieldColumn,
          fieldValue: fieldValue,
          text: $(this._queryTextBoxElement).val()
        };
      }
      return null;

    }
    return null;

  },
  clear: function () {
    let $resetElem;
    if (this._textFieldsComboElement) {
      $resetElem = $(this._textFieldsComboElement).find("option[data-field_is_title='True']");
      if (!$resetElem.length) {
        $resetElem = $(this._textFieldsComboElement).find("option[value='']");
      }
    }

    $resetElem.prop('selected', true);

    // очистить текстовое поле
    if (this._queryTextBoxElement) {
      $(this._queryTextBoxElement).val('');
    }
  },

  onFieldChanged: function () {
    if ($(this._queryTextBoxElement).val()) {
      $(this._fullTextBlockElement).closest('form').trigger('submit');
    }
  },

  dispose: function () {
    $(this._textFieldsComboElement).unbind('change');
    this._fullTextBlockElement = null;
    this._queryTextBoxElement = null;
    this._textFieldsComboElement = null;
  }
};

Quantumart.QP8.BackendArticleSearchBlock.FullTextBlock.registerClass('Quantumart.QP8.BackendArticleSearchBlock.FullTextBlock', null, Sys.IDisposable);
