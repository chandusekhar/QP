Quantumart.QP8.BackendSearchInArticle = function (gridElementId, searchBlockElementId, initQuery, documentContext) {
  this._gridElementId = gridElementId;
  this._searchBlockElementId = searchBlockElementId;
  this._onSearchButtonClickHandler = $.proxy(this._onSearchButtonClick, this);
  this._initQuery = initQuery;
  this._documentContext = documentContext;
};

Quantumart.QP8.BackendSearchInArticle.prototype = {
  _gridElementId: '',
  _searchBlockElementId: '',
  _initQuery: '',
  _documentContext: null,

  _onSearchButtonClick: function () {
    const searchQuery = $(`#${this._searchBlockElementId} input.textbox`).val();
    Quantumart.QP8.BackendEntityGridManager.getInstance().resetGrid(this._gridElementId, { searchQuery: searchQuery });
  },

  _getButton: function () {
    return $(`#${this._searchBlockElementId}`).find('.button');
  },

  initialize: function () {
    const $button = this._getButton();
    $button.bind('click', this._onSearchButtonClickHandler);
    this._refreshQuery(this._initQuery);
  },

  refreshQuery: function (eventArgs) {
    const context = eventArgs.get_context();
    const query = context && context.additionalUrlParameters ? context.additionalUrlParameters.query : '';
    this._documentContext.getHost()._additionalUrlParameters = null;
    this._refreshQuery(query);
  },

  _refreshQuery: function (query) {
    const $button = this._getButton();
    if (query) {
      $(`#${this._searchBlockElementId} input.textbox`).val(query);
      $button.trigger('click');
    }
  },

  dispose: function () {
    $(`#${this._searchBlockElementId}`).find('.button').unbind('click');
    this._onSearchButtonClickHandler = null;
  }
};
