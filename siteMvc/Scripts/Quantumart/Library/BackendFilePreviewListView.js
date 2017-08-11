// #region class BackendFilePreviewListView
// === Класс "Список превью файлов" ===
Quantumart.QP8.BackendFilePreviewListView = function (fileListContentElement, contextMenuCode, selectMode, zIndex) {
    Quantumart.QP8.BackendFilePreviewListView.initializeBase(this, [fileListContentElement, contextMenuCode, selectMode, zIndex]);
};

Quantumart.QP8.BackendFilePreviewListView.prototype = {
	initialize: function () {
		var $fileListContentElement = jQuery(this._fileListContentElement);
		$fileListContentElement.html('<div class="fileListPreviewContainer"></div>');

		// привязать события
		$fileListContentElement.delegate('.fileItem input:checkbox', "click", jQuery.proxy(this._onFileCheckBoxClickedHandler, this));
		$fileListContentElement.delegate('.fileItem', "click", jQuery.proxy(this._onFileContainerClickedHandler, this));

		if (!$q.isNullOrWhiteSpace(this._contextMenuCode)) {
			var contextMenuComponent = new Quantumart.QP8.BackendContextMenu(this._contextMenuCode, String.format("{0}_ContextMenu", $fileListContentElement.attr("id")),
				{ targetElements: this._fileListContentElement, allowManualShowing: true, zIndex: this._zIndex});
			contextMenuComponent.initialize();

			contextMenuComponent.addMenuItemsToMenu(false);

			var contextMenuEventType = contextMenuComponent.getContextMenuEventType();
			$fileListContentElement.delegate('.fileItem', contextMenuEventType, jQuery.proxy(this._onContextMenuHandler, this));
			contextMenuComponent.attachObserver(EVENT_TYPE_CONTEXT_MENU_ITEM_CLICKING, jQuery.proxy(this._onNodeContextMenuItemClickingHandler, this));
			contextMenuComponent.attachObserver(EVENT_TYPE_CONTEXT_MENU_HIDDEN, jQuery.proxy(this._onNodeContextMenuHiddenHandler, this));
			this._contextMenuComponent = contextMenuComponent;
			contextMenuComponent = null;
		}

		$fileListContentElement = null;
	},

	// инициализация
	redraw: function (data, options) {
		var $fileListContentElement = jQuery(this._fileListContentElement);
		var $fileListPreviewContainer = $fileListContentElement.find('.fileListPreviewContainer');
		var html = new $.telerik.stringBuilder();

		var self = this;
		if (data.TotalRecords > 0) {
			// сформировать содержимое
			jQuery.each(data.Data, function (index, item) {
				var ss = self._getThumbnailLink(item, options);
				html.cat(String.format('<div class="fileItem" data-file_name="{0}">', item.FullName))
					.catIf('<input type="checkbox" />', self._selectMode == FILE_LIST_SELECT_MODE_MULTIPLE)
					.cat(
						String.format('<div class="preview" style="background-image:url({3});"></div>'
						+ '<h5><ul><li title="{4}">{0}</li></ul></h5>'
						+ '<span>{1}</span>'
						+ '<span>{2}</span>'
					+ '</div>', item.Name, item.Modified, item.Size, self._getThumbnailLink(item, options), item.FullName));
			});
		} else {
 html.cat($l.FileList.noRecords); 
}

		$fileListPreviewContainer.html(html.string());

		$fileListPreviewContainer = null;
		$fileListContentElement = null;
		html = null;

		// поднимаем deselect так как на новой странице нет выбранных элементов
		this._raiseSelectEvent();
	},

	// перерисовать
	dispose: function () {
		Quantumart.QP8.BackendFilePreviewListView.callBaseMethod(this, "dispose");
	},

	// dispose

	shortNameLength: 15,

	_getThumbnailLink: function (item, options) {
		if (item.FileType == Quantumart.QP8.Enums.LibraryFileType.Image) {
			var url = "";

			// определить url в зависимости от fileEntityTypeCode
			if (options.fileEntityTypeCode == ENTITY_TYPE_CODE_SITE_FILE) {
 url = CONTROLLER_URL_THUMBNAIL + '_SiteFileThumbnail'; 
} else if (options.fileEntityTypeCode == ENTITY_TYPE_CODE_CONTENT_FILE) {
 url = CONTROLLER_URL_THUMBNAIL + '_ContentFileThumbnail'; 
}

			return $q.htmlEncode(String.format("'{0}?folderId={1}&fileName={2}&{3}'", url, options.folderId, item.FullName, new Date().getTime()));
		} else {
 return $q.htmlEncode(String.format("'{0}{1}'", THEME_IMAGE_FOLDER_URL_BIG_FILE_TYPE_ICONS, item.BigIconLink)); 
}
	} // сформировать ссылку на Thumbnail в зависимости от типа файла
};

Quantumart.QP8.BackendFilePreviewListView.registerClass("Quantumart.QP8.BackendFilePreviewListView", Quantumart.QP8.BackendFileNameListView);

// #endregion
