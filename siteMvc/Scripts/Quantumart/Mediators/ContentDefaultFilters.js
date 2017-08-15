Quantumart.QP8.ContentDefaultFiltersMediator = function (parentElementId) {
  let $parentElement = jQuery(`#${parentElementId}`);
  let $siteCombo = $parentElement.find('.qp-deffilter-site');
  let contentPicker = $parentElement.find('.qp-deffilter-content').data('entity_data_list_component');
  let articlePicker = $parentElement.find('.qp-deffilter-articles').data('entity_data_list_component');

  $siteCombo.change(jQuery.proxy(() => {
    contentPicker.deselectAllListItems();
    contentPicker.set_parentEntityId(+$siteCombo.val() || 0);
  }, this));

  const onContentSelectedHandler = jQuery.proxy(() => {
    if (contentPicker.getSelectedListItemCount() === 0) {
      articlePicker.disableList();
      articlePicker.removeAllListItems();
      articlePicker.set_parentEntityId(0);
    } else {
      const selectedContent = contentPicker.getSelectedEntityIDs()[0];
      articlePicker.enableList();
      if (articlePicker.get_parentEntityId() !== selectedContent) {
        articlePicker.removeAllListItems();
        articlePicker.set_parentEntityId(selectedContent);
      }
    }
  }, this);

  return {
    initialize: function () {
      if (contentPicker.getSelectedListItemCount() === 0) {
        articlePicker.disableList();
        articlePicker.set_parentEntityId(0);
      } else {
        articlePicker.set_parentEntityId(contentPicker.getSelectedEntityIDs()[0]);
        articlePicker.enableList();
      }
      contentPicker.attachObserver(window.EVENT_TYPE_ENTITY_LIST_SELECTION_CHANGED, onContentSelectedHandler);
    },

    dispose: function () {
      if (contentPicker) {
        contentPicker.detachObserver(window.EVENT_TYPE_ENTITY_LIST_SELECTION_CHANGED, onContentSelectedHandler);
        contentPicker = null;
      }
      if ($siteCombo) {
        $siteCombo.off();
      }

      $siteCombo = null;
      articlePicker = null;
      $parentElement = null;
    }
  };
};
