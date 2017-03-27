Quantumart.QP8.MultistepActionCopySiteSettings = function MultistepActionCopySiteSettings() {
  // ctor
};

Quantumart.QP8.MultistepActionCopySiteSettings.prototype = {
  COPY_BUTTON: 'Create like site',
  AddButtons: function (dataItems) {
    var exportButton = {
      Type: window.TOOLBAR_ITEM_TYPE_BUTTON,
      Value: this.COPY_BUTTON,
      Text: $l.MultistepAction.createLikeSite,
      Tooltip: $l.MultistepAction.createLikeSite,
      AlwaysEnabled: false,
      Icon: 'action.gif'
    };

    return dataItems.concat(exportButton);
  },

  InitActions: function () {
    // empty fn
  },

  Validate: function () {
    return '';
  },

  dispose: function () {
    // empty fn
  }
};
