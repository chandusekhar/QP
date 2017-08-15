window.EVENT_TYPE_POPUP_WINDOW_ACTION_EXECUTING = 'OnPopupWindowActionExecuting';
window.EVENT_TYPE_POPUP_WINDOW_ENTITY_READED = 'OnPopupWindowEntityReaded';
window.EVENT_TYPE_POPUP_WINDOW_CLOSED = 'OnPopupWindowClosed';

Quantumart.QP8.BackendPopupWindow = function (popupWindowId, eventArgs, options) {
  Quantumart.QP8.BackendPopupWindow.initializeBase(this, [eventArgs, options]);

  let $currentWindow = $(window);
  const currentWindowWidth = $currentWindow.width();
  const currentWindowHeight = $currentWindow.height();
  $currentWindow = null;

  this._popupWindowId = popupWindowId;

  if ($q.isObject(eventArgs)) {
    this._applyEventArgs(eventArgs, true);
    this.bindExternalCallerContext(eventArgs);
  }

  this._loadDefaultSearchBlockState();

  if ($q.isObject(options)) {
    if (!$q.isNull(options.showBreadCrumbs)) {
      this._showBreadCrumbs = options.showBreadCrumbs;
    }

    if (options.customActionToolbarComponent) {
      this._actionToolbarComponent = options.customActionToolbarComponent;
      this._useCustomActionToolbar = true;
    }

    this._selectedEntities = [];

    if (!$q.isNull(options.saveSelectionWhenChangingView)) {
      this._saveSelectionWhenChangingView = options.saveSelectionWhenChangingView;
    }

    if (options.title) {
      this._title = options.title;
    }

    if (options.width) {
      this._width = options.width;
    } else {
      this._width = Math.floor(currentWindowWidth * 0.8);
    }

    if (options.height) {
      this._height = options.height;
    } else {
      this._height = Math.floor(currentWindowHeight * 0.8);
    }

    if (options.minWidth) {
      this._minWidth = options.minWidth;
    } else {
      this._minWidth = Math.floor(currentWindowWidth * 0.2);
    }

    if (options.minHeight) {
      this._minHeight = options.minHeight;
    } else {
      this._minHeight = Math.floor(currentWindowHeight * 0.2);
    }

    if (!$q.isNull(options.isModal)) {
      this._isModal = options.isModal;
    }

    if (!$q.isNull(options.allowResize)) {
      this._allowResize = options.allowResize;
    }

    if (!$q.isNull(options.allowDrag)) {
      this._allowDrag = options.allowDrag;
    }

    if (!$q.isNull(options.showCloseButton)) {
      this._showCloseButton = options.showCloseButton;
    }

    if (!$q.isNull(options.showMinimizeButton)) {
      this._showMinimizeButton = options.showMinimizeButton;
    }

    if (!$q.isNull(options.showMaximizeButton)) {
      this._showMaximizeButton = options.showMaximizeButton;
    }

    if (options.additionalUrlParameters) {
      this._additionalUrlParameters = options.additionalUrlParameters;
    }
    if (eventArgs.get_context() && eventArgs.get_context().additionalUrlParameters) {
      this._additionalUrlParameters = Object.assign({}, this._additionalUrlParameters, eventArgs.get_context().additionalUrlParameters);
    }

    if (options.zIndex) {
      this._zIndex = $q.toInt(options.zIndex);
    }

    if (options.filter) {
      this._filter = options.filter;
    }

    if (options.isMultiOpen) {
      this._isMultiOpen = options.isMultiOpen;
    }
  }

  this._onPopupWindowResizeHandler = jQuery.proxy(this._onPopupWindowResize, this);
  this._onPopupWindowOpenHandler = jQuery.proxy(this._onPopupWindowOpen, this);
  this._onPopupWindowCloseHandler = jQuery.proxy(this._onPopupWindowClose, this);
  this._onPopupWindowActivatedHandler = jQuery.proxy(this._onPopupWindowActivated, this);
};

Quantumart.QP8.BackendPopupWindow.prototype = {
  _popupWindowId: '',
  _popupWindowElement: null,
  _popupWindowComponent: null,
  _showBreadCrumbs: false,
  _breadCrumbsWrapperElement: null,
  _toolbarWrapperElement: null,
  _actionToolbarWrapperElement: null,
  _viewToolbarWrapperElement: null,
  _searchBlockWrapperElement: null,
  _contextBlockWrapperElement: null,
  _documentAreaElement: null,
  _loadingLayerElement: null,
  _selectionContext: null,
  _saveSelectionWhenChangingView: false,
  _title: '',
  _width: 400,
  _height: 300,
  _minWidth: 400,
  _minHeight: 300,
  _isModal: true,
  _allowResize: true,
  _allowDrag: true,
  _showRefreshButton: false,
  _showCloseButton: true,
  _showMaximizeButton: true,
  _popupWindowManagerComponent: null,
  _additionalUrlParameters: null,
  _zIndex: 0,
  _isMultiOpen: false,

  get_popupWindowId: function () {
    return this._popupWindowId;
  },

  get_showBreadCrumbs: function () {
    return this._showBreadCrumbs;
  },

  get_saveSelectionWhenChangingView: function () {
    return this._saveSelectionWhenChangingView;
  },

  set_saveSelectionWhenChangingView: function (value) {
    this._saveSelectionWhenChangingView = value;
  },

  get_title: function () {
    return this._title;
  },

  set_title: function (value) {
    this._title = value;
  },

  get_width: function () {
    return this._width;
  },

  set_width: function (value) {
    this._width = value;
  },

  get_height: function () {
    return this._height;
  },

  set_height: function (value) {
    this._height = value;
  },

  get_minWidth: function () {
    return this._minWidth;
  },

  set_minWidth: function (value) {
    this._minWidth = value;
  },

  get_minHeight: function () {
    return this._minHeight;
  },

  set_minHeight: function (value) {
    this._minHeight = value;
  },

  get_isModal: function () {
    return this._isModal;
  },

  set_isModal: function (value) {
    this._isModal = value;
  },

  get_allowResize: function () {
    return this._allowResize;
  },

  set_allowResize: function (value) {
    this._allowResize = value;
  },

  get_allowDrag: function () {
    return this._allowDrag;
  },

  set_allowDrag: function (value) {
    this._allowDrag = value;
  },

  get_showRefreshButton: function () {
    return this._showRefreshButton;
  },

  set_showRefreshButton: function (value) {
    this._showRefreshButton = value;
  },

  get_showCloseButton: function () {
    return this._showCloseButton;
  },

  set_showCloseButton: function (value) {
    this._showCloseButton = value;
  },

  get_showMaximizeButton: function () {
    return this._showMaximizeButton;
  },

  set_showMaximizeButton: function (value) {
    this._showMaximizeButton = value;
  },

  get_popupWindowManager: function () {
    return this._popupWindowManagerComponent;
  },

  set_popupWindowManager: function (value) {
    this._popupWindowManagerComponent = value;
  },

  get_hostType: function () {
    return window.DOCUMENT_HOST_TYPE_POPUP_WINDOW;
  },

  get_zIndex: function () {
    return parseInt(jQuery(this._popupWindowElement).css('z-index'), 10);
  },

  get_selectionContext: function () {
    return this._selectionContext;
  },
  set_selectionContext: function (value) {
    this._selectionContext = value;
  },

  _onPopupWindowResizeHandler: null,
  _onPopupWindowOpenHandler: null,
  _onPopupWindowCloseHandler: null,
  _onPopupWindowActivatedHandler: null,

  initialize: function () {
    this._initSelectedEntities();

    const action = this.getCurrentAction();
    if ($q.isNullOrWhiteSpace(this._title) && this._popupWindowManagerComponent && action) {
      const eventArgs = new Quantumart.QP8.BackendEventArgs();
      eventArgs.set_entityTypeCode(this._entityTypeCode);
      eventArgs.set_entityId(this._entityId);
      eventArgs.set_entityName(this._entityName);
      eventArgs.set_parentEntityId(this._parentEntityId);
      eventArgs.set_actionCode(this._actionCode);
      this._title = this._popupWindowManagerComponent.generatePopupWindowTitle(eventArgs);
    }

    this.createPanels();

    const popupWindowComponent = this._createWindow();
    popupWindowComponent.close = function () {
      $.telerik.trigger(popupWindowComponent.element, 'close');
    };
    const $popupWindow = $(popupWindowComponent.element);

    this._popupWindowElement = $popupWindow.get(0);
    this._popupWindowComponent = popupWindowComponent;

    this._attachPopupWindowEventHandlers();
  },

  _initSelectedEntities: function () {
    const actionTypeCode = this._actionTypeCode;
    if (actionTypeCode === window.ACTION_TYPE_CODE_SELECT || actionTypeCode === window.ACTION_TYPE_CODE_MULTIPLE_SELECT) {
      if (this._isMultipleEntities) {
        this._selectedEntities = Array.clone(this._entities);
      } else if (this._entityId && this._entityName) {
        this._selectedEntities = [{ Id: this._entityId, Name: this._entityName}];
      } else {
        this._selectedEntities = [];
      }
    }
  },

  generateDocumentUrl: function (options) {
    const isSelectAction = this._actionTypeCode == window.ACTION_TYPE_CODE_SELECT || this._actionTypeCode == window.ACTION_TYPE_CODE_MULTIPLE_SELECT;
    const entityIDs = this._isMultipleEntities ? $o.getEntityIDsFromEntities(isSelectAction ? this._selectedEntities : this._entities) : [this._entityId];
    const extraOptions = {
      additionalUrlParameters: this._additionalUrlParameters,
      controllerActionUrl: this.getCurrentViewActionUrl()
    };

    if (this.get_isBindToExternal()) {
      extraOptions.additionalUrlParameters = Object.assign({}, extraOptions.additionalUrlParameters, { boundToExternal: true });
    }

    options = !$q.isObject(options) ? extraOptions : Object.assign({}, options, extraOptions);
    this._documentUrl = $a.generateActionUrl(this._isMultipleEntities, entityIDs, this._parentEntityId, this._popupWindowId, this.getCurrentAction(), options);

    const params = {};
    if (this._isMultipleEntities || this._isCustomAction) {
      params.IDs = entityIDs;
    }
    if (this._isCustomAction) {
      params.actionCode = this._actionCode;
    }
    this._documentPostParams = params;
  },

  _createWindow: function () {
    const popupWindowId = this._popupWindowId;
    const actions = [];
    if (this._showRefreshButton) {
      Array.add(actions, 'Refresh');
    }

    if (this._showMaximizeButton) {
      Array.add(actions, 'Maximize');
    }

    if (this._showCloseButton) {
      Array.add(actions, 'Close');
    }

    const breadCrumbsWrapperId = `breadCrumbsWrapper_${popupWindowId}`;
    const toolbarWrapperId = `toolbarWrapper_${popupWindowId}`;
    const actionToolbarWrapperId = `actionToolbarWrapper_${popupWindowId}`;
    const viewToolbarWrapperId = `viewToolbarWrapper_${popupWindowId}`;
    const searchBlockWrapperId = `searchBlockWrapper_${popupWindowId}`;
    const contextBlockWrapperId = `contextBlockWrapper_${popupWindowId}`;
    const documentAreaId = `documentArea_${popupWindowId}`;
    const documentWrapperId = `document_${popupWindowId}`;

    const windowContentHtml = new $.telerik.stringBuilder();
    windowContentHtml
      .catIf(`<div id="${breadCrumbsWrapperId}" class="breadCrumbsWrapper"></div>`, this._showBreadCrumbs)
      .cat(`<div id="${toolbarWrapperId}" class="toolbarWrapper">\n`)
      .cat(`  <div id="${actionToolbarWrapperId}" class="actionToolbarWrapper"></div>\n`)
      .cat(`  <div id="${viewToolbarWrapperId}" class="viewToolbarWrapper"></div>\n`)
      .cat('</div>\n')
      .cat(`<div id="${documentAreaId}" class="area">`)
      .cat(`  <div id="${searchBlockWrapperId}" class="searchWrapper"></div>`)
      .cat(`  <div id="${contextBlockWrapperId}" class="contextWrapper"></div>`)
      .cat(`  <div id="${documentWrapperId}" class="documentWrapper"></div>`)
      .cat('</div>\n')
    ;

    const popupWindowComponent = $.telerik.window.create({
      title: $('<div/>').text(this._title).html(),
      html: windowContentHtml.string(),
      width: this._width,
      height: this._height,
      minWidth: this._minWidth,
      minHeight: this._minHeight,
      modal: this._isModal,
      actions: actions,
      resizable: this._allowResize,
      draggable: this._allowDrag
    }).data('tWindow').center();

    const $popupWindow = $(popupWindowComponent.element);
    $popupWindow.addClass('popupWindow').css('display', 'none');

    if (this._zIndex) {
      $popupWindow.css('z-index', this._zIndex);
    }

    const $content = $popupWindow.find('DIV.t-window-content:first');
    let bottomPaddingFix = 0;
    if (jQuery.support.borderRadius) {
      bottomPaddingFix = 15;
    } else {
      bottomPaddingFix = 10;
    }

    $content.css('padding-bottom', `${bottomPaddingFix}px`);

    let $breadCrumbsWrapper = null;
    if (this._breadCrumbsComponent) {
      const $breadCrumbs = $(this._breadCrumbsComponent.get_breadCrumbsElement());
      $breadCrumbsWrapper = $popupWindow.find(`#${breadCrumbsWrapperId}`);
      $breadCrumbsWrapper.append($breadCrumbs);
    }

    const $actionToolbar = $(this._actionToolbarComponent.get_toolbarElement());
    const $viewToolbar = $(this._viewToolbarComponent.get_toolbarElement());
    const $toolbarWrapper = $popupWindow.find(`#${toolbarWrapperId}`);

    const $actionToolbarWrapper = $popupWindow.find(`#${actionToolbarWrapperId}`);
    $actionToolbarWrapper.append($actionToolbar);

    const $viewToolbarWrapper = $popupWindow.find(`#${viewToolbarWrapperId}`);
    $viewToolbarWrapper.append($viewToolbar);

    const $searchBlockWrapper = $popupWindow.find(`#${searchBlockWrapperId}`);
    const $contextBlockWrapper = $popupWindow.find(`#${contextBlockWrapperId}`);
    const $documentArea = $popupWindow.find(`#${documentAreaId}`);

    const $loadingLayer = $('<div />', { class: 'loadingLayer', css: { display: 'none'} });
    $documentArea.prepend($loadingLayer);

    const $documentWrapper = $popupWindow.find(`#${documentWrapperId}`);

    if (!$q.isNullOrEmpty($breadCrumbsWrapper)) {
      this._breadCrumbsWrapperElement = $breadCrumbsWrapper.get(0);
    }
    this._toolbarWrapperElement = $toolbarWrapper.get(0);
    this._actionToolbarWrapperElement = $actionToolbarWrapper.get(0);
    this._viewToolbarWrapperElement = $viewToolbarWrapper.get(0);
    this._searchBlockWrapperElement = $searchBlockWrapper.get(0);
    this._contextBlockWrapperElement = $contextBlockWrapper.get(0);
    this._documentAreaElement = $documentArea.get(0);
    this._loadingLayerElement = $loadingLayer.get(0);
    this._documentWrapperElementId = documentWrapperId;
    this._documentWrapperElement = $documentWrapper.get(0);

    return popupWindowComponent;
  },

  openWindow: function (options) {
    if (this._isMultiOpen && this._isContentLoaded()) {
      this._popupWindowComponent.open();
    } else {
      this.onDocumentChanging();
      this._popupWindowComponent.open();
      this.generateDocumentUrl(options);
      this.renderPanels();
      const self = this;
      this.loadHtmlContentToDocumentWrapper(() => {
        self.onDocumentChanged();
      }, options);
    }
  },

  closeWindow: function () {
    if (this._isMultiOpen) {
      $c.closePopupWindow(this._popupWindowComponent);
    } else if (this.allowClose()) {
      this.markMainComponentAsBusy();
      this.cancel();
      this.onDocumentUnloaded();
      this.unbindExternalCallerContexts('closed');

      const eventArgs = new Quantumart.QP8.BackendEventArgs();
      this.notify(window.EVENT_TYPE_POPUP_WINDOW_CLOSED, eventArgs);
      this.dispose();
    }
  },

  setWindowTitle: function (titleText) {
    $c.setPopupWindowTitle(this._popupWindowComponent, titleText);
    this._title = titleText;
  },

  _attachPopupWindowEventHandlers: function () {
    const $popupWindow = $(this._popupWindowElement);
    $popupWindow
      .bind('open', this._onPopupWindowOpenHandler)
      .bind('resize', this._onPopupWindowResizeHandler)
      .bind('close', this._onPopupWindowCloseHandler)
      .bind('activated', this._onPopupWindowActivatedHandler);
  },

  _detachPopupWindowEventHandlers: function () {
    const $popupWindow = $(this._popupWindowElement);
    $popupWindow
      .unbind('open', this._onPopupWindowOpenHandler)
      .unbind('resize', this._onPopupWindowResizeHandler)
      .unbind('close', this._onPopupWindowCloseHandler)
      .unbind('activated', this._onPopupWindowActivatedHandler);
  },

  _fixDocumentAreaHeight: function () {
    const $popupWindow = $(this._popupWindowElement);
    const $content = $popupWindow.find('DIV.t-window-content:first');
    let $breadCrumbsWrapper = null;
    if (this._breadCrumbsWrapperElement) {
      $breadCrumbsWrapper = $(this._breadCrumbsWrapperElement);
    }

    const $toolbarWrapper = $(this._toolbarWrapperElement);
    const $area = $(this._documentAreaElement);

    const contentHeight = parseInt($content.height(), 10);
    let breadCrumbsWrapperHeight = 0;
    if (!$q.isNullOrEmpty($breadCrumbsWrapper)) {
      breadCrumbsWrapperHeight = parseInt($breadCrumbsWrapper.outerHeight(), 10);
    }

    const toolbarWrapperHeight = parseInt($toolbarWrapper.outerHeight(), 10);
    const areaHeight = contentHeight - breadCrumbsWrapperHeight - toolbarWrapperHeight;
    $area.height(areaHeight);

    const main = this.get_mainComponent();
    if (main && Quantumart.QP8.BackendLibrary.isInstanceOfType(main)) {
      main.resize();
    }
  },

  showLoadingLayer: function () {
    const $loadingLayer = $(this._loadingLayerElement);
    $loadingLayer.show();
  },

  hideLoadingLayer: function () {
    const $loadingLayer = $(this._loadingLayerElement);
    $loadingLayer.hide();
  },

  htmlLoadingMethod: function () {
    return this._isMultipleEntities || this._isCustomAction ? 'POST' : 'GET';
  },

  createPanels: function () {
    const action = this.getCurrentAction();

    // Создаем хлебные крошки
    if (this._showBreadCrumbs) {
      const breadCrumbsComponent = Quantumart.QP8.BackendBreadCrumbsManager.getInstance().createBreadCrumbs(`breadCrumbs_${this._popupWindowId}`, {
        documentHost: this
      });

      breadCrumbsComponent.attachObserver(window.EVENT_TYPE_BREAD_CRUMBS_ITEM_CLICK, this._onGeneralEventHandler);
      breadCrumbsComponent.attachObserver(window.EVENT_TYPE_BREAD_CRUMBS_ITEM_CTRL_CLICK, this._onGeneralEventHandler);

      this._breadCrumbsComponent = breadCrumbsComponent;
    }

    // Создаем панель инструментов для действий
    if (!this._useCustomActionToolbar) {
      let actionToolbarOptions;
      const eventArgsAdditionalData = this.get_eventArgsAdditionalData();
      if (eventArgsAdditionalData && eventArgsAdditionalData.disabledActionCodes) {
        actionToolbarOptions = { disabledActionCodes: eventArgsAdditionalData.disabledActionCodes };
      }
      const actionToolbarComponent = new Quantumart.QP8.BackendActionToolbar(`actionToolbar_${this._popupWindowId}`, this._actionCode, this._parentEntityId, actionToolbarOptions);
      actionToolbarComponent.initialize();
      actionToolbarComponent.attachObserver(window.EVENT_TYPE_ACTION_TOOLBAR_BUTTON_CLICKED, this._onGeneralEventHandler);
      this._actionToolbarComponent = actionToolbarComponent;
    }

    // Создаем панель инструментов для представлений
    const viewToolbarOptions = {};
    const state = this.loadHostState();
    if (state && state.viewTypeCode) {
      viewToolbarOptions.viewTypeCode = state.viewTypeCode;
    }

    const viewToolbarComponent = new Quantumart.QP8.BackendViewToolbar(`viewToolbar_${this._popupWindowId}`, this._actionCode, viewToolbarOptions);
    viewToolbarComponent.initialize();

    viewToolbarComponent.attachObserver(window.EVENT_TYPE_VIEW_TOOLBAR_VIEWS_DROPDOWN_SELECTED_INDEX_CHANGED, this._onGeneralEventHandler);
    viewToolbarComponent.attachObserver(window.EVENT_TYPE_VIEW_TOOLBAR_SEARCH_BUTTON_CLICKED, this._onGeneralEventHandler);
    viewToolbarComponent.attachObserver(window.EVENT_TYPE_VIEW_TOOLBAR_CONTEXT_BUTTON_CLICKED, this._onGeneralEventHandler);

    this._viewToolbarComponent = viewToolbarComponent;
  },

  hidePanels: function (callback) {
    if (this._breadCrumbsComponent) {
      this._breadCrumbsComponent.hideBreadCrumbs();
    }

    this._actionToolbarComponent.hideToolbar(callback);
    this._viewToolbarComponent.hideToolbar();

    if (this.get_isSearchBlockVisible() && this._searchBlockComponent) {
      this._searchBlockComponent.hideSearchBlock();
    }

    if (this._isContextBlockVisible && this._contextBlockComponent) {
      this._contextBlockComponent.hideSearchBlock();
    }
  },

  showPanels: function (callback) {
    if (this._breadCrumbsComponent) {
      this._breadCrumbsComponent.showBreadCrumbs();
    }

    this._actionToolbarComponent.showToolbar(callback);
    this._viewToolbarComponent.showToolbar();
    this.fixActionToolbarWidth();

    if (this.get_isSearchBlockVisible() && this._searchBlockComponent) {
      this._searchBlockComponent.showSearchBlock();
    }

    if (this._isContextBlockVisible && this._contextBlockComponent) {
      this._contextBlockComponent.showSearchBlock();
    }
  },

  destroyPanels: function () {
    if (this._breadCrumbsComponent) {
      this._breadCrumbsComponent.detachObserver(window.EVENT_TYPE_BREAD_CRUMBS_ITEM_CLICK, this._onGeneralEventHandler);
      this._breadCrumbsComponent.detachObserver(window.EVENT_TYPE_BREAD_CRUMBS_ITEM_CTRL_CLICK, this._onGeneralEventHandler);
      const breadCrumbsElementId = this._breadCrumbsComponent.get_breadCrumbsElementId();
      Quantumart.QP8.BackendBreadCrumbsManager.getInstance().destroyBreadCrumbs(breadCrumbsElementId);
      this._breadCrumbsComponent = null;
    }

    if (this._actionToolbarComponent) {
      if (!this._useCustomActionToolbar) {
        this._actionToolbarComponent.detachObserver(window.EVENT_TYPE_ACTION_TOOLBAR_BUTTON_CLICKED, this._onGeneralEventHandler);
      }
      this._actionToolbarComponent.dispose();
      this._actionToolbarComponent = null;
    }

    if (this._viewToolbarComponent) {
      this._viewToolbarComponent.detachObserver(window.EVENT_TYPE_VIEW_TOOLBAR_VIEWS_DROPDOWN_SELECTED_INDEX_CHANGED, this._onGeneralEventHandler);
      this._viewToolbarComponent.detachObserver(window.EVENT_TYPE_VIEW_TOOLBAR_SEARCH_BUTTON_CLICKED, this._onGeneralEventHandler);
      this._viewToolbarComponent.detachObserver(window.EVENT_TYPE_VIEW_TOOLBAR_CONTEXT_BUTTON_CLICKED, this._onGeneralEventHandler);
      this._viewToolbarComponent.dispose();
      this._viewToolbarComponent = null;
    }
  },

  createSearchBlock: function () {
    const searchBlockComponent = Quantumart.QP8.BackendSearchBlockManager.getInstance()
      .createSearchBlock(`searchBlock_${this._popupWindowId}`, this._entityTypeCode, this._parentEntityId, this,
        {
          searchBlockContainerElementId: $(this._searchBlockWrapperElement).attr('id'),
          popupWindowId: this._popupWindowId,
          actionCode: this._actionCode,
          searchBlockState: this.getHostStateProp('searchBlockState')
        });

    searchBlockComponent.attachObserver(window.EVENT_TYPE_SEARCH_BLOCK_FIND_START, this._onSearchHandler);
    searchBlockComponent.attachObserver(window.EVENT_TYPE_SEARCH_BLOCK_RESET_START, this._onSearchHandler);
    searchBlockComponent.attachObserver(window.EVENT_TYPE_SEARCH_BLOCK_RESIZED, this._onSearchBlockResizeHandler);

    this._searchBlockComponent = searchBlockComponent;
  },

  createContextBlock: function () {
    const contextBlockComponent = Quantumart.QP8.BackendSearchBlockManager.getInstance()
      .createSearchBlock(`contextBlock_${this._popupWindowId}`, this._entityTypeCode, this._parentEntityId, this,
        {
          searchBlockContainerElementId: $(this._searchBlockWrapperElement).attr('id'),
          popupWindowId: this._popupWindowId,
          actionCode: this._actionCode,
          contextSearch: true,
          hideButtons: true,
          searchBlockState: this.get_contextState()
        });
    contextBlockComponent.initialize();

    contextBlockComponent.attachObserver(window.EVENT_TYPE_CONTEXT_BLOCK_FIND_START, this._onContextSwitchingHandler);

    this._contextBlockComponent = contextBlockComponent;
  },

  destroySearchBlock: function () {
    const searchBlockComponent = this._searchBlockComponent;

    if (searchBlockComponent) {
      searchBlockComponent.hideSearchBlock();
      searchBlockComponent.detachObserver(window.EVENT_TYPE_SEARCH_BLOCK_FIND_START, this._onSearchHandler);
      searchBlockComponent.detachObserver(window.EVENT_TYPE_SEARCH_BLOCK_RESET_START, this._onSearchHandler);
      searchBlockComponent.detachObserver(window.EVENT_TYPE_SEARCH_BLOCK_RESIZED, this._onSearchBlockResizeHandler);

      const searchBlockElementId = searchBlockComponent.get_searchBlockElementId();
      Quantumart.QP8.BackendSearchBlockManager.getInstance().destroySearchBlock(searchBlockElementId);

      this._searchBlockComponent = null;
    }
  },

  destroyContextBlock: function () {
    const searchBlockComponent = this._searchBlockComponent;
    const contextBlockComponent = this._contextBlockComponent;

    if (contextBlockComponent) {
      contextBlockComponent.hideSearchBlock();
      contextBlockComponent.detachObserver(window.EVENT_TYPE_CONTEXT_BLOCK_FIND_START, this._onContextSwitchingHandler);

      const searchBlockElementId = searchBlockComponent.get_searchBlockElementId();
      Quantumart.QP8.BackendSearchBlockManager.getInstance().destroySearchBlock(searchBlockElementId);

      this._contextBlockComponent = null;
      this._isContextBlockVisible = false;
    }
  },

  showErrorMessageInDocumentWrapper: function (status) {
    const $documentWrapper = $(this._documentWrapperElement);
    $documentWrapper.html($q.generateErrorMessageText());
  },

  updateTitle: function (eventArgs) {
    this.setWindowTitle(this._popupWindowManagerComponent.generatePopupWindowTitle(eventArgs));
  },

  onChangeContent: function (eventType, sender, eventArgs) {
    this.changeContent(eventArgs);
  },

  saveSelectionContext: function (eventArgs) {
    this._selectionContext = eventArgs.get_context();
  },

  onActionExecuting: function (eventArgs) {
    this._copyCurrentContextToEventArgs(eventArgs);
    return this._popupWindowManagerComponent.notify(window.EVENT_TYPE_POPUP_WINDOW_ACTION_EXECUTING, eventArgs);
  },

  onEntityReaded: function (eventArgs) {
    return this._popupWindowManagerComponent.notify(window.EVENT_TYPE_POPUP_WINDOW_ENTITY_READED, eventArgs);
  },

  onDocumentChanging: function (isLocal) {
    this.markPanelsAsBusy();
  },

  onDocumentChanged: function (isLocal) {
    this.unmarkPanelsAsBusy();
  },

  onNeedUp: function (eventArgs) {
    this._popupWindowManagerComponent.onNeedUp(eventArgs, this.get_popupWindowId());
  },

  resetSelectedEntities: function () {
    this._initSelectedEntities();
  },

  _onLibraryResized: function (eventType, sender) {
    const elHeight = $(this._documentAreaElement).height();
    $(sender._libraryElement).height(elHeight + 8);
  },

  _onPopupWindowResize: function () {
    this._fixDocumentAreaHeight();
  },

  _onPopupWindowOpen: function () {
    this._fixDocumentAreaHeight();
  },

  _onPopupWindowClose: function () {
    const $active = $(document.activeElement);
    if ($active) {
      $active.blur();
    }

    this.closeWindow();
  },

  _onPopupWindowActivated: function () {
    const main = this.get_mainComponent();
    if (main && Quantumart.QP8.BackendLibrary.isInstanceOfType(main)) {
      main.resize();
    }
  },

  _onExternalCallerContextsUnbinded: function (unbindingEventArgs) {
    this.get_popupWindowManager().hostExternalCallerContextsUnbinded(unbindingEventArgs);
  },

  _isContentLoaded: function () {
    const $wrapper = $(this._documentWrapperElement);
    return $wrapper && $wrapper.html() != '';
  },

  onDocumentError: function () {
    this.closeWindow();
  },

  _isWindow: function () {
    return true;
  },

  dispose: function () {
    Quantumart.QP8.BackendPopupWindow.callBaseMethod(this, 'dispose');

    this._detachPopupWindowEventHandlers();

    this._breadCrumbsWrapperElement = null;
    this._toolbarWrapperElement = null;
    this._actionToolbarWrapperElement = null;
    this._viewToolbarWrapperElement = null;
    this._searchBlockWrapperElement = null;
    this._contextBlockWrapperElement = null;
    this._documentAreaElement = null;
    this._documentWrapperElement = null;

    if (this._loadingLayerElement) {
      const $loadingLayer = $(this._loadingLayerElement);
      $loadingLayer.empty();
      $loadingLayer.remove();
      this._loadingLayerElement = null;
    }

    this.destroyPanels();
    this.destroySearchBlock();
    this.destroyContextBlock();

    if (this._popupWindowManagerComponent) {
      const popupWindowId = this._popupWindowId;
      if (!$q.isNullOrWhiteSpace(popupWindowId)) {
        this._popupWindowManagerComponent.removePopupWindow(popupWindowId);
      }

      this._popupWindowManagerComponent = null;
    }

    if (this._popupWindowComponent) {
      $c.destroyPopupWindow(this._popupWindowComponent);
      this._popupWindowComponent = null;
    }

    this._popupWindowElement = null;
    this._onPopupWindowResizeHandler = null;
    this._onPopupWindowOpenHandler = null;
    this._onPopupWindowCloseHandler = null;
    this._onPopupWindowActivatedHandler = null;
  }
};

Quantumart.QP8.BackendPopupWindow.registerClass('Quantumart.QP8.BackendPopupWindow', Quantumart.QP8.BackendDocumentHost);
