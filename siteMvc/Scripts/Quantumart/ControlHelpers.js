// ****************************************************************************
// *** Хелперы для работы с элементами управления             ***
// ****************************************************************************

Quantumart.QP8.ControlHelpers = function () { };

Quantumart.QP8.ControlHelpers.getAllFieldRows = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }
  return $q.toJQuery(parentElement).find('dl.row');
};

Quantumart.QP8.ControlHelpers.setFieldRowsVisibility = function (parentElement, fieldNames, visible) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $rows = Quantumart.QP8.ControlHelpers.getAllFieldRows(parentElement);
    $(fieldNames).each(function (i, name) {
      var $r = $rows.filter('[data-field_form_name="' + name + '"]').first();
      if (visible) {
        $r.show();
      } else {
        $r.hide();
      }
    });
  }
};


Quantumart.QP8.ControlHelpers.getAllCheckboxToggles = function (parentElement) {
  // Возвращает все чекбоксы-переключатели
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('INPUT.checkbox');
};

Quantumart.QP8.ControlHelpers.initAllCheckboxToggles = function (parentElement) {
  // Инициализирует все чекбоксы-переключатели
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $checkboxes = Quantumart.QP8.ControlHelpers.getAllCheckboxToggles(parentElement);
  $checkboxes.each(function (index, checkboxElem) {
    Quantumart.QP8.ControlHelpers.initCheckboxToggle(checkboxElem);
  });
};

Quantumart.QP8.ControlHelpers.initCheckboxToggle = function (checkboxElem) {
  // Инициализирует чекбокс-переключатель
  var $checkbox = $q.toJQuery(checkboxElem);

  var panelId = $checkbox.data('toggle_for');
  if (!$q.isNullOrWhiteSpace(panelId)) {
    var handler = Quantumart.QP8.ControlHelpers._onCheckboxToggleClickHandler;

    $checkbox.bind('click', handler);
    $checkbox.data('init', true);
    handler.apply($checkbox);
  }

  $checkbox = null;
};

Quantumart.QP8.ControlHelpers.destroyAllCheckboxToggles = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $checkboxes = Quantumart.QP8.ControlHelpers.getAllCheckboxToggles(parentElement);
  $checkboxes.each(function (index, checkboxElem) {
    Quantumart.QP8.ControlHelpers.destroyCheckboxToggle(checkboxElem);
  });
};

Quantumart.QP8.ControlHelpers.destroyCheckboxToggle = function (checkboxElem) {
  var $checkbox = $q.toJQuery(checkboxElem);
  $checkbox.unbind('click', Quantumart.QP8.ControlHelpers._onCheckboxToggleClickHandler);
};

Quantumart.QP8.ControlHelpers._onCheckboxToggleClickHandler = function (e) {
  var $checkbox = $(this);

  var panelId = $q.toString($checkbox.data('toggle_for'), '');
  var isReverse = $q.toBoolean($checkbox.data('reverse'), false);
  var isChecked = $checkbox.is(':checked');
  var state = isChecked;
  if (isReverse) {
    state = !isChecked;
  }

  var $panel = $('#' + panelId);
  if (state) {
    $panel.show();
    $panel.trigger('show');
    $c.fixAllEntityDataListsOverflow($panel);
    $c._refreshAllHta($panel);
    if (!$checkbox.data('init')) {
      $c._setPanelControlsDisabledState($panel, false);
    }
  } else {
    $panel.hide();
    $panel.trigger('hide');
    if (!$checkbox.data('init')) {
      $c._setPanelControlsDisabledState($panel, true);
    }
  }
  $checkbox.removeData('init');
};

Quantumart.QP8.ControlHelpers.getAllSwitcherLists = function (parentElement) {
  // Возвращает все списки переключателей
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.radioButtonsList, .dropDownList');
};

Quantumart.QP8.ControlHelpers.initDisableControlsPanels = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  $('div', parentElement).each(function () {
    var $panel = $(this);
    if ($panel.css('display') == 'none') {
      $c._setPanelControlsDisabledState($panel, true);
    }
  });
};

Quantumart.QP8.ControlHelpers.initAllSwitcherLists = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $switcherLists = Quantumart.QP8.ControlHelpers.getAllSwitcherLists(parentElement);
  $switcherLists.each(function (index, switcherListElem) {
    Quantumart.QP8.ControlHelpers.initSwitcherList(switcherListElem);
  });

  $c.initDisableControlsPanels(parentElement);
};

Quantumart.QP8.ControlHelpers.initSwitcherList = function (switcherListElem) {
  // Инициализирует список переключателей
  var $switcherList = $q.toJQuery(switcherListElem);
  var panelIDs = $switcherList.data('switch_for');

  if (!$q.isNullOrEmpty(panelIDs)) {
    var isRadio = $q.toBoolean($switcherList.data('is_radio'), false);
    var handler = null;

    if (!isRadio) {
      handler = Quantumart.QP8.ControlHelpers._onDropDownListSwitcherChangeHandler;

      $switcherList.bind('change keyup', handler);
      if ($switcherList.length > 0) {
        handler.apply($switcherList.get(0));
      }
    } else {
      handler = Quantumart.QP8.ControlHelpers._onRadioButtonSwitcherChangeHandler;

      var $switchers = $switcherList.find(':radio');
      $switchers.bind('change', handler);
      var $checkedSwitchers = $switchers.filter(':checked');
      if ($checkedSwitchers.length > 0) {
        handler.apply($switchers.filter(':checked').get(0));
      }
    }
  }
};

Quantumart.QP8.ControlHelpers.destroyAllSwitcherLists = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $switcherLists = Quantumart.QP8.ControlHelpers.getAllSwitcherLists(parentElement);
  $switcherLists.each(function (index, switcherListElem) {
    Quantumart.QP8.ControlHelpers.destroySwitcherList(switcherListElem);
  });
};

Quantumart.QP8.ControlHelpers.destroySwitcherList = function (switcherListElem) {
  // Уничтожает список переключателей
  var $switcherList = $q.toJQuery(switcherListElem);
  var panelIDs = $switcherList.data('switch_for');

  if (!$q.isNullOrEmpty(panelIDs)) {
    var isRadio = $q.toBoolean($switcherList.data('is_radio'), false);

    if (!isRadio) {
      $switcherList.unbind('change keyup', Quantumart.QP8.ControlHelpers._onDropDownListSwitcherChangeHandler);
    } else {
      var $switchers = $switcherList.find(':radio');
      $switchers.unbind('change', Quantumart.QP8.ControlHelpers._onRadioButtonSwitcherChangeHandler);

      $switchers = null;
    }
  }

  $switcherList = null;
};

Quantumart.QP8.ControlHelpers._onDropDownListSwitcherChangeHandler = function () {
  var $dropDownList = $(this);
  var $items = $dropDownList.find('OPTION');
  var $item = $items.filter(':selected');
  var panelIDs = $dropDownList.data('switch_for');

  Quantumart.QP8.ControlHelpers._switchPanel($item, panelIDs);
};

Quantumart.QP8.ControlHelpers._onRadioButtonSwitcherChangeHandler = function () {
  var $radioButton = $(this);
  var $radioButtonList = $radioButton.parent().parent().parent();
  var $radioButtons = $radioButtonList.find(':radio');
  var panelIDs = $radioButtonList.data('switch_for');

  Quantumart.QP8.ControlHelpers._switchPanel($radioButton, panelIDs);
};

Quantumart.QP8.ControlHelpers._setPanelControlsDisabledState = function ($panel, state) {
  if ($panel.data('disable_controls')) {
    var $inputs = $(':input', $panel);
    if (state) {
      var $disabled = $inputs.filter(':disabled');
      $disabled.data('realDisabled', true);
      $inputs.prop('disabled', true);
    } else {
      $inputs.prop('disabled', false);
      var $realDisabled = $inputs.filter(function () {
        return $(this).data('realDisabled') == true;
      });
      $realDisabled.prop('disabled', true).removeData('realDisabled');
    }
  }
};

Quantumart.QP8.ControlHelpers._switchPanel = function ($selectedSwitcher, panelIDs) {
  // Переключает панели
  for (var key in panelIDs) {
    var panelId = panelIDs[key];
    if (panelId) {
      $(panelId).filter(
        function () {
          return $(this).css('display') == 'block';
        }
      ).hide().trigger('hide').each(
        function () {
          $c._setPanelControlsDisabledState(jQuery(this), true);
        }
      );
    }
  }

  var selectedValue = $selectedSwitcher.val();
  var panelId = panelIDs[selectedValue];
  if (panelId) {
    var $panels = $(panelId);
    $panels.each(
      function () {
        $c._setPanelControlsDisabledState(jQuery(this), false);
      }
    ).show().trigger('show');
    $c.fixAllEntityDataListsOverflow($panels);
    $c._refreshAllHta($panels);
    $panels = null;
  }
};

// Устанвливает валидатор для поля
Quantumart.QP8.ControlHelpers.setValidator = function (input, errors) {
  var message = errors && errors[0] ? errors[0].Message : '';
  var $input = $(input);
  var operation = message ? 'addClass' : 'removeClass';
  if ($input.is(':input')) {
    $input[operation]('input-validation-error');
  }

  var html = !message ? '' : '<span id="' + input.prop('id') + '_validator" class="field-validation-error" >' + message + '</span>';
  var $container = $input.closest('dl.row');
  $container.find('em.validators').html(html);
};

// Возвращает все текстовые поля
Quantumart.QP8.ControlHelpers.getAllSimpleTextBox = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.textbox.simple-text');
};

// Устанавливает значения текстовых полей
Quantumart.QP8.ControlHelpers.setAllSimpleTextBoxValues = function (parentElement, fieldValues) {
  if (!$q.isNullOrEmpty(fieldValues)) {
    var $tboxes = Quantumart.QP8.ControlHelpers.getAllSimpleTextBox(parentElement);
    $(fieldValues).each(function (i, v) {
      var $tb = $tboxes.filter('[name="' + v.fieldName + '"]').first();
      if ($tb.length > 0) {
        $tb.val(v.value);
        $tb.change();
      }

      $c.setValidator($tb, v.errors);
    });
  }
};

// Возвращает все radiolist
Quantumart.QP8.ControlHelpers.getAllRadioLists = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.radioButtonsList');
};

// Устанавливает значения radiolist
Quantumart.QP8.ControlHelpers.setAllRadioListValues = function (parentElement, fieldValues) {
  if (!$q.isNullOrEmpty(fieldValues)) {
    var $glists = Quantumart.QP8.ControlHelpers.getAllRadioLists(parentElement);
    $(fieldValues).each(function (i, v) {
      var $list = $glists.filter('[data-field_form_name="' + v.fieldName + '"]:first');
      $list.find('input:radio[value="' + v.value + '"]').prop('checked', true);
      $c.setValidator($list, v.errors);
    });
  }
};


// Возвращает все Boolean поля
Quantumart.QP8.ControlHelpers.getAllBoolean = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('input.checkbox.simple-checkbox:checkbox');
};

// Устанавливает значения boolean полей
Quantumart.QP8.ControlHelpers.setAllBooleanValues = function (parentElement, fieldValues) {
  if (!$q.isNullOrEmpty(fieldValues)) {
    var $tboxes = Quantumart.QP8.ControlHelpers.getAllBoolean(parentElement);
    $(fieldValues).each(function (i, v) {
      var $chbox = $tboxes.filter('[name="' + v.fieldName + '"]').first();
      var value = $q.isString(v.value) ? v.value == 'true' || v.value == '1' : v.value;
      if ($chbox.length > 0) {
        if (value === true) {
          $chbox.prop('checked', true);
          $chbox.change();
        } else if (value === false) {
          $chbox.prop('checked', false);
          $chbox.change();
        }

        $c.setValidator($chbox, v.errors);
      }
    });
  }
};

// Устанавливает значения Numeric полей
Quantumart.QP8.ControlHelpers.setAllNumericBoxValues = function (parentElement, fieldValues) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  if (!$q.isNullOrEmpty(fieldValues)) {
    var $boxes = Quantumart.QP8.ControlHelpers.getAllNumericTextBoxes(parentElement);
    $(fieldValues).each(function (i, v) {
      var $nbox = $boxes.filter('[name="' + v.fieldName + '"]').first();
      if ($nbox.length > 0) {
        var numericComponent = $nbox.data('tTextBox');
        if (numericComponent) {
          numericComponent.value($q.toInt(v.value));
          $nbox.change();
        }

        numericComponent = null;
      }

      $c.setValidator($nbox, v.errors);
    });
  }
};

// Устанавливает значения Date/Time/DateTime полей
Quantumart.QP8.ControlHelpers.setAllDateTimePickersValues = function (parentElement, fieldValues) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  if (!$q.isNullOrEmpty(fieldValues)) {
    var $dtPickers = Quantumart.QP8.ControlHelpers.getAllDateTimePickers(parentElement);
    $(fieldValues).each(function (i, v) {
      var $p = $dtPickers.filter('[name="' + v.fieldName + '"]').first();
      if ($p.length > 0) {
        var picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent($p);
        if (picker) {
          if (v.value) {
            picker.value(v.value);
          } else {
            picker.value(null);
          }

          $p.change();
        }

        $c.setValidator($p, v.errors);
      }
    });
  }
};

// Возвращает все VisualEditor TextArea
Quantumart.QP8.ControlHelpers.getAllVisualEditorAreas = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.visualEditor');
};

// Устанавливает значения всех VisualEditor
Quantumart.QP8.ControlHelpers.setAllVisualEditorValues = function (parentElement, fieldValues) {
  if (!$q.isNullOrEmpty(fieldValues)) {
    if (!$q.isNullOrEmpty(fieldValues)) {
      var $tareas = Quantumart.QP8.ControlHelpers.getAllVisualEditorAreas(parentElement);
      $(fieldValues).each(function (i, v) {
        var $ta = $tareas.filter('[name="' + v.fieldName + '"]').first();
        if ($ta.length > 0) {
          $ta.text(v.value);
          var $ve = $ta.closest('.visualEditorComponent');
          if ($ve.length > 0) {
            var component = Quantumart.QP8.BackendVisualEditor.getComponent($ve);
            if (component && component.getCkEditor()) {
              component.getCkEditor().setData(v.value);
            }
          }

          $ta.change();
          $c.setValidator($ta, v.errors);
        }
      });
    }
  }
};

// Устанавливает значение всех списков
Quantumart.QP8.ControlHelpers.setAllEntityDataListValues = function (parentElement, fieldValues) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  if (!$q.isNullOrEmpty(fieldValues)) {
    var $lists = Quantumart.QP8.ControlHelpers.getAllEntityDataLists(parentElement);
    var $l = null;
    var listComponent = null;

    $(fieldValues).each(function (i, v) {
      $l = $lists.filter('[data-list_item_name="' + v.fieldName + '"]').first();
      if ($l.length > 0) {
        listComponent = $l.data('entity_data_list_component');
        if (listComponent) {
          var value = $q.isString(v.value) ? v.value.split(',') : v.value;
          listComponent.selectEntities(value);
        }
      }
      $c.setValidator($l, v.errors);
    });

    $lists = null;
    $l = null;
    listComponent = null;
  }
};

// Устанавливает значение всех классификаторов
Quantumart.QP8.ControlHelpers.setAllClassifierFieldValues = function (parentElement, fieldValues, disableChangeTracking) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  if (!$q.isNullOrEmpty(fieldValues)) {
    var $classifiers = Quantumart.QP8.ControlHelpers.getAllClassifierFields(parentElement);
    var $cl = null;
    var component = null;

    $(fieldValues).each(function (i, v) {
      $cl = $classifiers.filter('[data-field_name="' + v.fieldName + '"]').first();
      if ($cl.length > 0) {
        component = Quantumart.QP8.BackendClassifierField.getComponent($cl);
        if (component) {
          component.set_initFieldValues(fieldValues);
          component.set_disableChangeTracking(disableChangeTracking);
          component.selectContent(v.value);
        }
      }

      $c.setValidator($cl, v.errors);
    });

    $classifiers = null;
    $cl = null;
    component = null;
  }
};

// Устанавливает значение всех AggregationLists
Quantumart.QP8.ControlHelpers.setAllAggregationListValues = function (parentElement, fieldValues) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  if (!$q.isNullOrEmpty(fieldValues)) {
    var $lists = Quantumart.QP8.ControlHelpers.getAllAggregationLists(parentElement);
    $(fieldValues).each(function (i, v) {
      var $l = $lists.filter('[data-field_name="' + v.fieldName + '"]:first');
      var component = Quantumart.QP8.BackendAggregationList.getComponent($l);
      if (component) {
        component.set_items(v.value);
      }
    });
  }
};

// Устанавливает значение всех Highlighted TextAreas
Quantumart.QP8.ControlHelpers.setAllHighlightedTextAreaValues = function (parentElement, fieldValues) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }
  if (!$q.isNullOrEmpty(fieldValues)) {
    var $htas = Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas(parentElement);
    $(fieldValues).each(function (i, v) {
      var componentCM = $htas.filter('[name="' + v.fieldName + '"]:first').data('codeMirror');
      var componentJE = $htas.filter('[name="' + v.fieldName + '"]:first').data('jsonEditor');
      if (componentCM || componentJE) {
        if ($q.isNullOrEmpty(v.value)) {
          if (componentCM) {
            componentCM.setValue('');
          } else {
            componentJE.setText('');
          }
        } else if (componentCM) {
          componentCM.setValue(v.value);
        } else {
          componentJE.setText(v.value);
        }
      }
    });
    $htas = null;
  }
};


// Возвращает значение всех тестовых полей в формате [{fieldName: "...", value: "...", ...}]
Quantumart.QP8.ControlHelpers.getAllSimpleTextBoxValues = function (parentElement) {
  return Quantumart.QP8.ControlHelpers.getAllSimpleTextBox(parentElement).filter('[name]').map(function () {
    var $tb = $(this);
    return {
      fieldName: $tb.attr('name'),
      value: $tb.val()
    };
  });
};

// Возвращает значение всех Radio List
Quantumart.QP8.ControlHelpers.getAllRadioListValues = function (parentElement) {
  return Quantumart.QP8.ControlHelpers.getAllRadioLists(parentElement).filter('[data-field_form_name]').map(function () {
    var $tb = $(this);
    return {
      fieldName: $tb.data('field_form_name'),
      value: $tb.find('input:radio:checked').val()
    };
  });
};

// Возвращает значение всех boolean полей в формате [{fieldName: '...', value: true/false, ...}]
Quantumart.QP8.ControlHelpers.getAllBooleanValues = function (parentElement) {
  return Quantumart.QP8.ControlHelpers.getAllBoolean(parentElement).filter('[name]').map(function () {
    var $tb = $(this);
    return {
      fieldName: $tb.attr('name'),
      value: $tb.is(':checked')
    };
  });
};

// Возвращает значения Numeric полей
Quantumart.QP8.ControlHelpers.getAllNumericBoxValues = function (parentElement) {
  return $.grep(Quantumart.QP8.ControlHelpers.getAllNumericTextBoxes(parentElement)
    .filter('[name]')
    .map(function () {
      var $nbox = $(this);
      var numericComponent = $nbox.data('tTextBox');
      if (numericComponent) {
        return {
          fieldName: $nbox.attr('name'),
          value: numericComponent.value()
        };
      }
    }), function (v) {
    return v;
  });
};

// Возвращает значения DateTime полей
Quantumart.QP8.ControlHelpers.getAllDateTimePickersValues = function (parentElement) {
  return $.grep(Quantumart.QP8.ControlHelpers.getAllDateTimePickers(parentElement)
    .filter('[name]')
    .map(function () {
      var $p = $(this);
      var picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent($p);
      if (picker) {
        return {
          fieldName: $p.attr('name'),
          value: picker.inputValue
        };
      }
    }), function (v) {
    return v;
  }
  );
};

// Возвращает значения VisualEditor
Quantumart.QP8.ControlHelpers.getAllVisualEditorValues = function (parentElement) {
  return $.grep(Quantumart.QP8.ControlHelpers.getAllVisualEditors(parentElement)
    .map(function () {
      var $ve = $(this);
      var $ta = $ve.find('.visualEditor');
      var editor = Quantumart.QP8.BackendVisualEditor.getComponent($ve);
      if (editor) {
        if (editor.getCkEditor()) {
          return {
            fieldName: $ta.attr('name'),
            value: editor.getCkEditor().getData()
          };
        }

        return {
          fieldName: $ta.attr('name'),
          value: $ta.text()
        };
      }
    }), function (v) {
    return v;
  }
  );
};

// Возвращает значения всех списков
Quantumart.QP8.ControlHelpers.getAllEntityDataListValues = function (parentElement) {
  return $.grep(Quantumart.QP8.ControlHelpers.getAllEntityDataLists(parentElement).filter('[data-list_item_name]').map(function () {
    var $l = $(this);
    var listComponent = $l.data('entity_data_list_component');
    if (listComponent) {
      return {
        fieldName: $l.data('list_item_name'),
        value: listComponent.getSelectedEntityIDs()
      };
    }
  }), function (v) {
    return v;
  });
};

// Возвращает значение всех классификаторов
Quantumart.QP8.ControlHelpers.getAllClassifierFieldValues = function (parentElement) {
  return Quantumart.QP8.ControlHelpers.getAllClassifierFields(parentElement).filter('[data-field_name]').map(function () {
    var $c = $(this);
    var component = Quantumart.QP8.BackendClassifierField.getComponent($c);
    if (component) {
      return {
        fieldName: $c.data('field_name'),
        value: component.getSelectedContent()
      };
    }
  });
};

// Возвращает значение всех AggregationList
Quantumart.QP8.ControlHelpers.getAllAggregationListValues = function (parentElement) {
  return Quantumart.QP8.ControlHelpers.getAllAggregationLists(parentElement).filter('[data-field_name]').map(function () {
    var $l = $(this);
    var component = Quantumart.QP8.BackendAggregationList.getComponent($l);
    if (component) {
      return {
        fieldName: $l.data('field_name'),
        value: component.get_items()
      };
    }
  });
};

// Возвращает значение всех HighlightedTextAreas
Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreaValues = function (parentElement) {
  return Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas(parentElement).filter('[name]').map(function () {
    var $a = $(this);
    var componentCM = $a.data('codeMirror');
    var componentJE = $a.data('jsonEditor');
    if (componentCM || componentJE) {
      return {
        fieldName: $a.prop('name'),
        value: componentCM ? componentCM.getValue() : componentJE.getText()
      };
    }
  });
};

// Возвращает значение всех полей
Quantumart.QP8.ControlHelpers.getAllFieldValues = function (parentElement) {
  var $ch = Quantumart.QP8.ControlHelpers;
  var result = $.merge([], $ch.getAllSimpleTextBoxValues(parentElement));
  $.merge(result, $ch.getAllRadioListValues(parentElement));
  $.merge(result, $ch.getAllBooleanValues(parentElement));
  $.merge(result, $ch.getAllNumericBoxValues(parentElement));
  $.merge(result, $ch.getAllDateTimePickersValues(parentElement));
  $.merge(result, $ch.getAllVisualEditorValues(parentElement));
  $.merge(result, $ch.getAllEntityDataListValues(parentElement));
  $.merge(result, $ch.getAllClassifierFieldValues(parentElement));
  $.merge(result, $ch.getAllAggregationListValues(parentElement));
  $.merge(result, $ch.getAllHighlightedTextAreaValues(parentElement));
  return result;
};

// Readonly текстовых полей
Quantumart.QP8.ControlHelpers.makeReadonlySimpleTextBoxes = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $tboxes = Quantumart.QP8.ControlHelpers.getAllSimpleTextBox(parentElement);
    $(fieldNames).each(function (i, name) {
      var $tb = $tboxes.filter('[name="' + name + '"]').first();
      if ($tb.length > 0) {
        $tb.prop('readonly', true).addClass('readonly');
      }
    });
  }
};

// Readonly boolean полей
Quantumart.QP8.ControlHelpers.makeReadonlyBooleans = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $chboxes = Quantumart.QP8.ControlHelpers.getAllBoolean(parentElement);
    $(fieldNames).each(function (i, name) {
      var $cb = $chboxes.filter('[name="' + name + '"]').first();
      if ($cb.length > 0) {
        $cb.siblings('input[name="' + name + '"]').filter(':hidden').first().val($cb.prop('checked'));
        $cb.prop('disabled', true);
      }
    });
  }
};

// Readonly Radio List
Quantumart.QP8.ControlHelpers.makeReadonlyRadioList = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $glists = Quantumart.QP8.ControlHelpers.getAllRadioLists(parentElement);
    $(fieldNames).each(function (i, name) {
      var $gl = $glists.filter('[data-field_form_name="' + name + '"]:first');
      var cv = $gl.find('input:radio:checked').val();
      $gl.find('input:radio').prop('disabled', true);
      if (cv) {
        var $hdn = $gl.find('input:hidden[name="' + name + '"]');
        if ($hdn.length == 0) {
          var htmlHidden = new $.telerik.stringBuilder();
          htmlHidden.cat('<input type="hidden" name="').cat(name).cat('" value="').cat(cv).cat('" />');
          $gl.append(htmlHidden.string());
        } else {
          $hdn.prop('value', cv);
        }
      }
    });
  }
};

// Readonly Numeric полей
Quantumart.QP8.ControlHelpers.makeReadonlyNumericBox = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $boxes = Quantumart.QP8.ControlHelpers.getAllNumericTextBoxes(parentElement);
    $(fieldNames).each(function (i, name) {
      var $nbox = $boxes.filter('[name="' + name + '"]').first();
      if ($nbox.length > 0) {
        var numericComponent = $nbox.data('tTextBox');
        if (numericComponent) {
          numericComponent.disable();
          $nbox.prop('disabled', false)
            .prop('readonly', true)
            .addClass('readonly');
        }
        numericComponent = null;
      }
    });
  }
};

// Readonly DateTimePickers
Quantumart.QP8.ControlHelpers.makeReadonlyDateTimePickers = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $dtPickers = Quantumart.QP8.ControlHelpers.getAllDateTimePickers(parentElement);
    $(fieldNames).each(function (i, name) {
      var $p = $dtPickers.filter('[name="' + name + '"]').first();
      if ($p.length > 0) {
        var picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent($p);
        if (picker) {
          picker.disable();
          $p.prop('disabled', false)
            .prop('readonly', true)
            .addClass('readonly');
        }
        picker = null;
      }
    });
  }
};

// Readonly VisualEditors
Quantumart.QP8.ControlHelpers.makeReadonlyVisualEditors = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $tareas = Quantumart.QP8.ControlHelpers.getAllVisualEditorAreas(parentElement);
    $(fieldNames).each(function (i, name) {
      $tareas.filter('[name="' + name + '"]').first().data('is_readonly', true);
    });
  }
};

// Readonly File Fields
Quantumart.QP8.ControlHelpers.makeReadonlyFileFields = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $fileFields = $q.toJQuery(parentElement).find('div.fileField');
    $(fieldNames).each(function (i, name) {
      var $ff = $fileFields.filter('[data-field_name="' + name + '"]').first();
      if ($ff.length > 0) {
        Quantumart.QP8.ControlHelpers.makeReadonlySimpleTextBoxes($ff, [name]);
        $ff.find('.l-html-uploader, .l-sl-uploader, .libraryButton').hide();
      }
    });
  }
};

Quantumart.QP8.ControlHelpers.makeReadonlyEntityDataList = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $lists = Quantumart.QP8.ControlHelpers.getAllEntityDataLists(parentElement);
    var $l = null;
    var listComponent = null;
    $(fieldNames).each(function (i, name) {
      $l = $lists.filter('[data-list_item_name="' + name + '"]').first();
      if ($l.length > 0) {
        listComponent = $l.data('entity_data_list_component');
        if (listComponent) {
          listComponent.makeReadonly();
        }
      }
    });
    $lists = null;
    $l = null;
    listComponent = null;
  }
};

// Readonly всех классификаторов
Quantumart.QP8.ControlHelpers.makeReadonlyClassifierFields = function (parentElement, fieldNames) {
  if ($q.isArray(fieldNames) && !$q.isNullOrEmpty(fieldNames)) {
    var $classifiers = Quantumart.QP8.ControlHelpers.getAllClassifierFields(parentElement);
    var $c = null;
    var component = null;

    $(fieldNames).each(function (i, name) {
      $c = $classifiers.filter('[data-field_name="' + name + '"]').first();
      if ($c.length > 0) {
        component = Quantumart.QP8.BackendClassifierField.getComponent($c);
        if (component) {
          component.makeReadonly();
        }
      }
    });

    $classifiers = null;
    $c = null;
    component = null;
  }
};


Quantumart.QP8.ControlHelpers.getAllDateTimePickers = function Quantumart$QP8$ControlHelpers$getAllDateTimePickers(parentElement) {
  // Возвращает все DateTimePicker`ы
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.t-picker-wrap INPUT.t-input');
};

Quantumart.QP8.ControlHelpers.initAllDateTimePickers = function Quantumart$QP8$ControlHelpers$initAllDateTimePickers(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $fields = Quantumart.QP8.ControlHelpers.getAllDateTimePickers(parentElement);
  $fields.each(function (index, fieldElem) {
    Quantumart.QP8.ControlHelpers.initDateTimePicker(fieldElem);
  });
};

Quantumart.QP8.ControlHelpers.initDateTimePicker = function Quantumart$QP8$ControlHelpers$initDateTimePicker(fieldElem) {
  // Инициализирует DateTimePicker
  var $field = $q.toJQuery(fieldElem);

  $field.bind('valueChange', function () {
    var $t = $(this);
    $t.addClass(CHANGED_FIELD_CLASS_NAME);
    var value;
    if ($t.hasClass('time')) {
      value = $t.data('tTimePicker').value();
    } else if ($t.hasClass('datetime')) {
      value = $t.data('tDateTimePicker').value();
    } else if ($t.hasClass('date')) {
      value = $t.data('tDatePicker').value();
    }
    $t.trigger(JQ_CUSTOM_EVENT_ON_FIELD_CHANGED, { fieldName: $t.attr('name'), value: value, contentFieldName: $t.closest('dl').data('field_name') });
    $t = null;
  });

  $field = null;
};

Quantumart.QP8.ControlHelpers.getDateTimePickerComponent = function Quantumart$QP8$ControlHelpers$getDateTimePickerComponent(fieldElem) {
  var $fieldElem = $q.toJQuery(fieldElem);
  var $picker = $fieldElem.data('tDatePicker');
  if (!$picker) {
    $picker = $fieldElem.data('tDateTimePicker');
  }
  if (!$picker) {
    $picker = $fieldElem.data('tTimePicker');
  }
  return $picker;
};

Quantumart.QP8.ControlHelpers.disableDateTimePicker = function (fieldElem) {
  var $picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent(fieldElem);
  if ($picker) {
    $picker.disable();
  }
  $picker = null;
};

Quantumart.QP8.ControlHelpers.enableDateTimePicker = function (fieldElem) {
  var $picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent(fieldElem);
  if ($picker) {
    $picker.enable();
  }
  $picker = null;
};

Quantumart.QP8.ControlHelpers.getDateTimePickerValue = function (fieldElem) {
  var $picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent(fieldElem);
  if ($picker) {
    if ($picker.value() == null) {
      return null;
    }
    return $q.toJQuery(fieldElem).val();
  }
  return null;
};

Quantumart.QP8.ControlHelpers.setDateTimePickerValue = function (fieldElem, value) {
  var $picker = Quantumart.QP8.ControlHelpers.getDateTimePickerComponent(fieldElem);
  if ($picker) {
    if (!$q.isNull(value)) {
      $q.toJQuery(fieldElem).val(value);
    } else {
      $q.toJQuery(fieldElem).val(null);
    }
  }
};

Quantumart.QP8.ControlHelpers.destroyAllDateTimePickers = function Quantumart$QP8$ControlHelpers$destroyAllDateTimePickers(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $fields = Quantumart.QP8.ControlHelpers.getAllDateTimePickers(parentElement);

  $fields.each(function (index, fieldElem) {
    Quantumart.QP8.ControlHelpers.destroyDateTimePicker(fieldElem);
  });
};

Quantumart.QP8.ControlHelpers.destroyDateTimePicker = function Quantumart$QP8$ControlHelpers$destroyDateTimePicker(fieldElem) {
  $q.toJQuery(fieldElem)
    .unbind()
    .removeData('tDatePicker')
    .removeData('tDateTimePicker')
    .removeData('tTimePicker');
};


Quantumart.QP8.ControlHelpers.getAllNumericTextBoxes = function Quantumart$QP8$ControlHelpers$getAllNumericTextBoxes(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.t-numerictextbox INPUT.t-input');
};

Quantumart.QP8.ControlHelpers.initAllNumericTextBoxes = function Quantumart$QP8$ControlHelpers$initAllNumericTextBoxes(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $textBoxes = Quantumart.QP8.ControlHelpers.getAllNumericTextBoxes(parentElement);
  $textBoxes.each(function (index) {
    Quantumart.QP8.ControlHelpers.initNumericTextBox($textBoxes.eq(index));
  });
};

Quantumart.QP8.ControlHelpers.initNumericTextBox = function Quantumart$QP8$ControlHelpers$initNumericTextBox(textBoxElement) {
  var $textBox = $q.toJQuery(textBoxElement);
  $textBox
    .bind('valueChange', function () {
      var $t = $(this);
      $t.addClass(CHANGED_FIELD_CLASS_NAME);
      $t.trigger(JQ_CUSTOM_EVENT_ON_FIELD_CHANGED, { fieldName: $t.attr('name'), value: $t.data('tTextBox').value(), contentFieldName: $t.closest('dl').data('field_name') });
      $t = null;
    })
    .parent().find('.t-formatted-value')
    .css(
    {
      'font-family': '',
      'font-size': '',
      'font-weight': '',
      'line-height': '',
      color: '',
      'text-decoration': ''
    }
  );

  $textBox = null;
};

Quantumart.QP8.ControlHelpers.destroyAllNumericTextBoxes = function Quantumart$QP8$ControlHelpers$destroyAllNumericTextBoxes(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $textBoxes = Quantumart.QP8.ControlHelpers.getAllNumericTextBoxes(parentElement);
  $textBoxes.each(function (index) {
    Quantumart.QP8.ControlHelpers.destroyNumericTextBox($textBoxes.eq(index));
  });
};

Quantumart.QP8.ControlHelpers.destroyNumericTextBox = function Quantumart$QP8$ControlHelpers$destroyNumericTextBox(textBoxElement) {
  var $textBox = $q.toJQuery(textBoxElement);
  $textBox
    .unbind()
    .removeData('tTextBox');

  $textBox = null;
};

Quantumart.QP8.ControlHelpers.getAllFileFields = function Quantumart$QP8$ControlHelpers$getAllFileFields(parentElement) {
  // Возвращает все файловые поля
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.fileField');
};

Quantumart.QP8.ControlHelpers.initAllFileFields = function Quantumart$QP8$ControlHelpers$initAllFileFields(parentElement, actionExecutingHandler) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $fields = Quantumart.QP8.ControlHelpers.getAllFileFields(parentElement);
  $fields.each(function (index, fieldElem) {
    Quantumart.QP8.ControlHelpers.initFileField(fieldElem, actionExecutingHandler);
  });
};

Quantumart.QP8.ControlHelpers.initFileField = function Quantumart$QP8$ControlHelpers$initFileField(fieldElem, actionExecutingHandler) {
  // Инициализирует файловое поле
  var $field = $q.toJQuery(fieldElem);
  if (!$q.isNullOrEmpty($field)) {
    var wrapperId = $field.attr('id');
    var fieldId = $field.data('field_id');
    var entityId = +$field.data('entity_id') || 0;
    var allowFileUpload = $q.toBoolean($field.data('allow_file_upload'), false);

    var options = {};
    options.entityId = entityId;
    options.allowFileUpload = allowFileUpload;
    options.isVersion = $q.toBoolean($field.data('is_version'), false);

    options.useSiteLibrary = $q.toBoolean($field.data('use_site_library'), false);
    options.libraryEntityId = +$field.data('library_entity_id') || 0;
    options.libraryParentEntityId = +$field.data('library_parent_entity_id') || 0;
    options.subFolder = $field.data('subfolder');
    options.libraryPath = $q.toString($field.data('library_path'), '');
    options.libraryUrl = $q.toString($field.data('library_url'), '');
    options.renameMatched = $q.toBoolean($field.data('rename_matched'), false);
    options.isImage = $q.toBoolean($field.data('is_image'), false);

    if (allowFileUpload) {
      options.uploaderType = $q.toInt($field.data('uploader_type'), Quantumart.QP8.Enums.UploaderType.Silverlight);
    }

    var fileField = new Quantumart.QP8.BackendFileField(fieldId, wrapperId, options);

    fileField.initialize();

    if ($q.isFunction(actionExecutingHandler) && fileField._allowFileUpload) {
      fileField._uploaderComponent.attachObserver(EVENT_TYPE_LIBRARY_ALL_FILES_UPLOADED, actionExecutingHandler);
    }

    $field.data('file_field_component', fileField);
  }
};

Quantumart.QP8.ControlHelpers.destroyAllFileFields = function Quantumart$QP8$ControlHelpers$destroyAllFileFields(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $fields = Quantumart.QP8.ControlHelpers.getAllFileFields(parentElement);
  $fields.each(function (index, fieldElem) {
    Quantumart.QP8.ControlHelpers.destroyFileField(fieldElem);
  });
};

Quantumart.QP8.ControlHelpers.destroyFileField = function Quantumart$QP8$ControlHelpers$destroyFileField(fieldElem) {
  // Уничтожает файловое поле
  var $field = $q.toJQuery(fieldElem);
  if (!$q.isNullOrEmpty($field)) {
    var fileField = $field.data('file_field_component');
    if (fileField) {
      fileField.dispose();
      fileField = null;
    }

    $field.removeData('file_field_component');
  }

  $field = null;
};


Quantumart.QP8.ControlHelpers.getAllClassifierFields = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.classifierComponent');
};

Quantumart.QP8.ControlHelpers.initAllClassifierFields = function (parentElement, actionExecutingHandler, editorOptions, onClassifierEventHandler) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  Quantumart.QP8.ControlHelpers.getAllClassifierFields(parentElement).each(function () {
    Quantumart.QP8.ControlHelpers.initClassifierField(this, actionExecutingHandler, editorOptions, onClassifierEventHandler);
  });
};

Quantumart.QP8.ControlHelpers.initClassifierField = function (componentElem, actionExecutingHandler, editorOptions, onClassifierEventHandler) {
  var component = new Quantumart.QP8.BackendClassifierField(componentElem, actionExecutingHandler, editorOptions);
  component.initialize();
  if ($q.isFunction(onClassifierEventHandler)) {
    component.attachObserver(EVENT_TYPE_CLASSIFIER_FIELD_ARTICLE_LOADED, onClassifierEventHandler);
    component.attachObserver(EVENT_TYPE_CLASSIFIER_FIELD_ARTICLE_UNLOADING, onClassifierEventHandler);
  }
  component = null;
};

Quantumart.QP8.ControlHelpers.destroyAllClassifierFields = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  Quantumart.QP8.ControlHelpers.getAllClassifierFields(parentElement).each(function () {
    Quantumart.QP8.ControlHelpers.destroyClassifierField(this);
  });
};

Quantumart.QP8.ControlHelpers.destroyClassifierField = function (componentElem) {
  var component = Quantumart.QP8.BackendClassifierField.getComponent(componentElem);
  if (component) {
    component.detachObserver(EVENT_TYPE_CLASSIFIER_FIELD_ARTICLE_LOADED);
    component.dispose();
  }
};


Quantumart.QP8.ControlHelpers.getAllVisualEditors = function Quantumart$QP8$ControlHelpers$getAllVisualEditors(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.visualEditorComponent');
};

Quantumart.QP8.ControlHelpers.initAllVisualEditors = function Quantumart$QP8$ControlHelpers$initAllVisualEditors(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  Quantumart.QP8.ControlHelpers.getAllVisualEditors(parentElement).each(function (index, editorElem) {
    Quantumart.QP8.ControlHelpers.initVisualEditor(editorElem);
  });
};

Quantumart.QP8.ControlHelpers.initVisualEditor = function Quantumart$QP8$ControlHelpers$initVisualEditor(editorElem) {
  var editor = new Quantumart.QP8.BackendVisualEditor(editorElem);
  editor.initialize();
  editor = null;
};

Quantumart.QP8.ControlHelpers.destroyAllVisualEditors = function Quantumart$QP8$ControlHelpers$destroyAllVisualEditors(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  Quantumart.QP8.ControlHelpers.getAllVisualEditors(parentElement).each(function (index, editorElem) {
    Quantumart.QP8.ControlHelpers.destroyVisualEditor(editorElem);
  });

  $q.collectGarbageInIE();
};

Quantumart.QP8.ControlHelpers.destroyVisualEditor = function Quantumart$QP8$ControlHelpers$destroyVisualEditor(editorElem) {
  var editor = Quantumart.QP8.BackendVisualEditor.getComponent(editorElem);
  if (editor) {
    editor.dispose();
    editor = null;
  }
};

Quantumart.QP8.ControlHelpers.saveDataOfAllVisualEditors = function Quantumart$QP8$ControlHelpers$saveDataOfAllVisualEditors(parentElement) {
  Quantumart.QP8.ControlHelpers.getAllVisualEditors(parentElement).each(function (index, editorElem) {
    Quantumart.QP8.ControlHelpers.saveVisualEditorData(editorElem);
  });
};

Quantumart.QP8.ControlHelpers.saveVisualEditorData = function Quantumart$QP8$ControlHelpers$saveVisualEditorData(editorElem) {
  var editor = Quantumart.QP8.BackendVisualEditor.getComponent(editorElem);
  if (editor) {
    editor.saveVisualEditorData();
    editor = null;
  }
};


Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas = function (parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.highlightedTextarea');
};

Quantumart.QP8.ControlHelpers.initAllHighlightedTextAreas = function Quantumart$QP8$ControlHelpers$initAllHighlightedTextAreas(parentElem) {
  if (!parentElem) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas(parentElem).each(function () {
    Quantumart.QP8.ControlHelpers.initHighlightedTextArea($(this));
  });
};

Quantumart.QP8.ControlHelpers.initHighlightedTextArea = function Quantumart$QP8$ControlHelpers$initHighlightedTextArea(editorElem) {
  var area = new Quantumart.QP8.BackendHighlightedTextArea(editorElem);
  area.initialize();
  area = null;
};

Quantumart.QP8.ControlHelpers.SaveDataOfAllHighlightedTextAreas = function Quantumart$QP8$ControlHelpers$SaveDataOfAllHighlightedTextAreas(parentElem) {
  Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas(parentElem).each(function () {
    var area = new Quantumart.QP8.BackendHighlightedTextArea($(this));
    area.saveData();
  });
};

Quantumart.QP8.ControlHelpers.destroyAllHighlightedTextAreas = function Quantumart$QP8$ControlHelpers$destroyAllHighlightedTextAreas(parentElem) {
  Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas(parentElem).each(function () {
    Quantumart.QP8.ControlHelpers.destroyHighlightedTextArea($(this));
  });
};

Quantumart.QP8.ControlHelpers.destroyHighlightedTextArea = function Quantumart$QP8$ControlHelpers$destroyHighlightedTextArea(editorElem) {
  var area = new Quantumart.QP8.BackendHighlightedTextArea(editorElem);
  area.destroy();
  area = null;
};


Quantumart.QP8.ControlHelpers.getAllAggregationLists = function Quantumart$QP8$ControlHelpers$getAllAggregationLists(parentElement) {
  // Возвращает компоненты типа "AggregationList"
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.aggregationList');
};

Quantumart.QP8.ControlHelpers.initAllAggregationLists = function Quantumart$QP8$ControlHelpers$initAllAggregationLists(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $lists = Quantumart.QP8.ControlHelpers.getAllAggregationLists(parentElement);
  $lists.each(function () {
    Quantumart.QP8.ControlHelpers.initAggregationList($(this));
  });
};

Quantumart.QP8.ControlHelpers.initAggregationList = function Quantumart$QP8$ControlHelpers$initAggregationList(editorElem) {
  var list = new Quantumart.QP8.BackendAggregationList(editorElem);
  list.initialize();
  list = null;
};

Quantumart.QP8.ControlHelpers.destroyAllAggregationLists = function Quantumart$QP8$ControlHelpers$destroyAllAggregationLists(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $lists = Quantumart.QP8.ControlHelpers.getAllAggregationLists(parentElement);
  $lists.each(function () {
    Quantumart.QP8.ControlHelpers.destroyAggregationList($(this));
  });
};

Quantumart.QP8.ControlHelpers.destroyAggregationList = function Quantumart$QP8$ControlHelpers$destroyAggregationList(editorElem) {
  // Уничтожает компонент типа "AggregationList"
  (new Quantumart.QP8.BackendAggregationList(editorElem)).destroyAggregationList();
};

Quantumart.QP8.ControlHelpers.saveDataOfAllAggregationLists = function Quantumart$QP8$ControlHelpers$saveDataOfAllAggregationLists(parentElement) {
  var $lists = Quantumart.QP8.ControlHelpers.getAllAggregationLists(parentElement);
  $lists.each(function () {
    Quantumart.QP8.ControlHelpers.saveAggregationListData($(this));
  });
};

Quantumart.QP8.ControlHelpers.saveAggregationListData = function Quantumart$QP8$ControlHelpers$saveAggregationListData(editorElem) {
  // Сохраняет данные компонента типа "AggregationList"
  (new Quantumart.QP8.BackendAggregationList(editorElem)).saveAggregationListData();
};


Quantumart.QP8.ControlHelpers.getAllWorkflows = function Quantumart$QP8$ControlHelpers$getAllWorkflows(parentElement) {
  // Возвращает компоненты типа "AggregationList"
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.workflow_control');
};

Quantumart.QP8.ControlHelpers.initAllWorkflows = function Quantumart$QP8$ControlHelpers$initWorkflows(parentElement) {
  // Инициализирует все компоненты типа "Workflow"
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $workflows = Quantumart.QP8.ControlHelpers.getAllWorkflows(parentElement);
  $workflows.each(function () {
    Quantumart.QP8.ControlHelpers.initWorkflow($(this));
  });
};

Quantumart.QP8.ControlHelpers.initWorkflow = function Quantumart$QP8$ControlHelpers$initWorkflow(editorElem) {
  var workflow = new Quantumart.QP8.BackendWorkflow(editorElem);
  workflow.initialize();
};

Quantumart.QP8.ControlHelpers.saveDataOfAllWorkflows = function Quantumart$QP8$ControlHelper$saveDataOfAllWorkflows(editorElem) {
  var $workflows = Quantumart.QP8.ControlHelpers.getAllWorkflows(editorElem);
  $workflows.each(function () {
    Quantumart.QP8.ControlHelpers.saveWorkflowData($(this));
  });
};

Quantumart.QP8.ControlHelpers.saveWorkflowData = function Quantumart$QP8$ControlHelper$saveWorkflowData(editorElem) {
  var workflow = editorElem.data('workflow');
};



Quantumart.QP8.ControlHelpers.preview = function Quantumart$QP8$ControlHelpers$preview(testUrl) {
  var win = null;
  var queryResult = $q.getJsonSync(testUrl);
  if (queryResult.proceed) {
    win = $c.openPreviewWindow(queryResult.url, queryResult.width, queryResult.height);
  } else {
    window.alert(queryResult.msg);
  }

  return win;
};

Quantumart.QP8.ControlHelpers.crop = function Quantumart$QP8$ControlHelpers$crop(testUrl, urlParams) {
  var win = null;
  var queryResult = $q.getJsonSync(testUrl);
  if (queryResult.proceed) {
    win = $c.openCropWindow(queryResult.url, queryResult.folderUrl, urlParams);
  } else {
    window.alert(queryResult.msg);
  }

  return win;
};

// Создает и выводит окно с заданными свойствами
Quantumart.QP8.ControlHelpers.openPreviewWindow = function Quantumart$QP8$ControlHelpers$openPreviewWindow(url, width, height) {
  url = url + '?t=' + new Date().getTime();
  var html = new $.telerik.stringBuilder();
  html.cat('<div class="previewImage">').cat('<img src="' + url + '\" width="' + width + '" height="' + height + '" />').cat('</div>');
  var win = $.telerik.window.create({
    title: $l.FileField.previewWindowTitle,
    html: html.string(),
    height: $c.correctPreviewSize(height, 125, $(window).height()),
    width: $c.correctPreviewSize(width, 215, $(window).width())
  }).data('tWindow');

  win.center().open();
  return win;
};

Quantumart.QP8.ControlHelpers.openCropWindow = function Quantumart$QP8$ControlHelpers$openCropWindow(url, folderUrl, urlParams) {
  var imgCropResize = Quantumart.QP8.ImageCropResizeClient.create({
    sourceImageUrl: url,                  /*  URL исходного изображения   */
    resultImageFolder: folderUrl,               /*  URL для размещения итогового изображения (папка, при пустом значении или отсутствии размещаем там же, где исходное) */
    onCompleteCallback: function () {
      imgCropResize.closeWindow();
      imgCropResize.dispose();
      Sys.Debug.trace('image cropped');

      var newEventArgs = new Quantumart.QP8.BackendEventArgs();
      newEventArgs.set_entityTypeCode(urlParams.entityTypeCode);
      newEventArgs.set_actionTypeCode(ACTION_TYPE_CODE_FILE_CROPPED);
      var actionCode = urlParams.entityTypeCode == ENTITY_TYPE_CODE_SITE_FILE ? ACTION_CODE_UPDATE_SITE_FILE : ACTION_CODE_UPDATE_CONTENT_FILE;
      newEventArgs.set_actionCode(actionCode);
      newEventArgs.set_parentEntityId(urlParams.id);
      Quantumart.QP8.Backend.getInstance()._onActionExecuted(newEventArgs);
    }
  });

  imgCropResize.openWindow();
  return imgCropResize;
};

Quantumart.QP8.ControlHelpers.correctPreviewSize = function Quantumart$QP8$ControlHelpers$correctPreviewSize(size, minSize, maxSize) {
  var newSize = size;
  var offset = 50;
  if (size < minSize) {
    newSize = minSize;
  } else if (size > (maxSize - offset)) {
    newSize = maxSize - offset;
  }

  return newSize;
};

Quantumart.QP8.ControlHelpers.downloadFile = function Quantumart$QP8$ControlHelpers$downloadFile(url) {
  var id = 'hiddenDownloader';
  var iframe = $('#' + id).get(0);
  if (!iframe) {
    iframe = $('<iframe>').attr({
      id: id,
      width: 0,
      height: 0
    }).appendTo(document.body).get(0);
  }

  iframe.src = url;
};

Quantumart.QP8.ControlHelpers.downloadFileWithChecking = function Quantumart$QP8$ControlHelpers$downloadFileWithChecking(checkUrl, fileName) {
  var result = $q.getJsonSync(checkUrl);
  if (result.proceed) {
    var urlParams = { id: result.key, fileName: encodeURIComponent(fileName) };
    var url = Quantumart.QP8.BackendLibrary.generateActionUrl('DownloadFile', urlParams);
    $c.downloadFile(url);
  } else {
    window.alert(result.msg);
  }
};


// Преобразует список сущностей в коллекцию элементов списка
Quantumart.QP8.ControlHelpers.getListItemCollectionFromEntities = function (entities) {
  var dataItems = [];
  $.each(entities, function (index, entity) {
    Array.add(dataItems, { Value: entity.Id, Text: entity.Name, Selected: false });
  });

  return dataItems;
};

// Преобразует коллекцию элементов списка в список сущностей
Quantumart.QP8.ControlHelpers.getEntitiesFromListItemCollection = function (dataItems) {
  var entities = [];
  $.each(dataItems, function (index, dataItem) {
    Array.add(entities, { Id: dataItem.Value, Name: dataItem.Text });
  });

  return entities;
};


Quantumart.QP8.ControlHelpers.setPopupWindowTitle = function Quantumart$QP8$ControlHelpers$destroyPopupWindow$setPopupWindowTitle(windowComponent, titleText) {
  // Задает текст заголовка окна
  if (windowComponent) {
    $(windowComponent.element).find('.t-window-titlebar > .t-window-title').text(titleText);
  }
};

Quantumart.QP8.ControlHelpers.destroyPopupWindow = function Quantumart$QP8$ControlHelpers$destroyPopupWindow(windowComponent) {
  // Уничтожает окно
  if (windowComponent) {
    var $window = $(windowComponent.element);
    if (!$q.isNullOrEmpty($window)) {
      $window.removeData('tWindow').empty();
    }

    windowComponent.destroy();
  }
};

Quantumart.QP8.ControlHelpers.closePopupWindow = function Quantumart$QP8$ControlHelpers$closePopupWindow(windowComponent) {
  var $window = $(windowComponent.element);
  if ($window.is(':visible')) {
    windowComponent.overlayOnClose();
    $.telerik.fx.rewind(windowComponent.effects, $window, null, function () {
      $window.hide();
    });
  }

  if (windowComponent.isMaximized) {
    $('html, body').css('overflow', '');
    if (windowComponent._documentScrollTop && windowComponent._documentScrollTop > 0) {
      $(document).scrollTop(windowComponent._documentScrollTop);
    }
  }
};


Quantumart.QP8.ControlHelpers.getAllEntityDataLists = function Quantumart$QP8$ControlHelpers$getAllEntityDataLists(parentElement) {
  // Возвращает компоненты типа "Упрощенный список сущностей"
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.dataList');
};

Quantumart.QP8.ControlHelpers.initAllEntityDataLists = function Quantumart$QP8$ControlHelpers$initAllEntityDataLists(parentElement, actionExecutingHandler, editorOptions) {
  // Инициализирует компоненты типа "Упрощенный список сущностей"
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $dataLists = Quantumart.QP8.ControlHelpers.getAllEntityDataLists(parentElement);
  $dataLists.each(function (index, dataListElem) {
    Quantumart.QP8.ControlHelpers.initEntityDataList(dataListElem, actionExecutingHandler, editorOptions);
  });
};

Quantumart.QP8.ControlHelpers.initEntityDataList = function Quantumart$QP8$ControlHelpers$initEntityDataList(dataListElem, actionExecutingHandler, editorOptions) {
  // Инициализирует компонент типа "Упрощенный список сущностей"
  var $dataList = $q.toJQuery(dataListElem);
  if (!$q.isNullOrEmpty($dataList)) {
    var listType = Quantumart.QP8.Enums.DataListType.None;
    if ($dataList.hasClass('dropDownList')) {
      listType = Quantumart.QP8.Enums.DataListType.DropDownList;
    } else if ($dataList.hasClass('radioButtonsList')) {
      listType = Quantumart.QP8.Enums.DataListType.RadioButtonList;
    } else if ($dataList.hasClass('checkboxsList')) {
      listType = Quantumart.QP8.Enums.DataListType.CheckBoxList;
    } else if ($dataList.hasClass('singleItemPicker')) {
      listType = Quantumart.QP8.Enums.DataListType.SingleItemPicker;
    } else if ($dataList.hasClass('multipleItemPicker')) {
      listType = Quantumart.QP8.Enums.DataListType.MultipleItemPicker;
    }

    var options = {
      listId: +$dataList.data('list_id') || 0,
      listItemName: $q.toString($dataList.data('list_item_name'), ''),
      addNewActionCode: $q.toString($dataList.data('add_new_action_code'), ACTION_CODE_NONE),
      readActionCode: $q.toString($dataList.data('read_action_code'), ACTION_CODE_NONE),
      selectActionCode: $q.toString($dataList.data('select_action_code'), ACTION_CODE_NONE),
      maxListWidth: +$dataList.data('max_list_width') || 0,
      maxListHeight: +$dataList.data('max_list_height') || 0,
      showIds: $q.toBoolean($dataList.data('show_ids'), false),
      filter: $q.toString($dataList.data('filter'), ''),
      hostIsWindow: $q.toBoolean(editorOptions ? editorOptions.hostIsWindow : false, false),
      isCollapsable: $q.toBoolean($dataList.data('is_collapsable'), false),
      enableCopy: $q.toBoolean($dataList.data('enable_copy'), true),
      readDataOnInsert: $q.toBoolean($dataList.data('read_data_on_insert'), false),
      countLimit: $q.toInt($dataList.data('count_limit'), 1)
    };

    var entityDataList = Quantumart.QP8.BackendEntityDataListManager.getInstance().createList(
      $dataList.attr('id'),
      $dataList.data('entity_type_code'),
      $dataList.data('parent_entity_id'),
      $dataList.data('entity_id'),
      listType,
      options
    );

    if ($q.toBoolean($dataList.data('list_enabled'), true)) {
      entityDataList.enableList();
    } else {
      entityDataList.disableList();
    }

    if ($q.isFunction(actionExecutingHandler)) {
      entityDataList.attachObserver(EVENT_TYPE_ENTITY_LIST_ACTION_EXECUTING, actionExecutingHandler);
    }

    $dataList.data('entity_data_list_component', entityDataList);
  }
};

Quantumart.QP8.ControlHelpers.fixAllEntityDataListsOverflow = function Quantumart$QP8$ControlHelpers$fixAllEntityDataListsOverflow($container) {
  var $dataLists = Quantumart.QP8.ControlHelpers.getAllEntityDataLists($container);
  $dataLists.each(function () {
    var $dataList = $q.toJQuery(this);
    var component = $dataList.data('entity_data_list_component');
    if (component) {
      component._fixListOverflow();
    }
  });
};

Quantumart.QP8.ControlHelpers._refreshAllHta = function Quantumart$QP8$ControlHelpers$refreshAllHta($container) {
  var $htas = Quantumart.QP8.ControlHelpers.getAllHighlightedTextAreas($container);
  $htas.each(function () {
    var $hta = $q.toJQuery(this);
    var component = $hta.data('codeMirror');
    if (component) {
      component.refresh();
    }
  });
};

Quantumart.QP8.ControlHelpers.destroyAllEntityDataLists = function Quantumart$QP8$ControlHelpers$destroyAllEntityDataLists(parentElement) {
  // Уничтожает компоненты типа "Упрощенный список сущностей"
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $dataLists = Quantumart.QP8.ControlHelpers.getAllEntityDataLists(parentElement);
  $dataLists.each(function (index, dataListElem) {
    Quantumart.QP8.ControlHelpers.destroyEntityDataList(dataListElem);
  });
};

Quantumart.QP8.ControlHelpers.destroyEntityDataList = function Quantumart$QP8$ControlHelpers$destroyEntityDataList(dataListElem) {
  // Инициализирует компонент типа "Упрощенный список сущностей"
  var $dataList = $q.toJQuery(dataListElem);
  if (!$q.isNullOrEmpty($dataList)) {
    var entityDataList = $dataList.data('entity_data_list_component');
    if (entityDataList) {
      entityDataList.detachObserver(EVENT_TYPE_ENTITY_LIST_ACTION_EXECUTING);
      entityDataList.dispose();
    }
  }
};


Quantumart.QP8.ControlHelpers.getAllEntityDataTrees = function Quantumart$QP8$ControlHelpers$getAllEntityDataTrees(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  return $q.toJQuery(parentElement).find('.checkboxTree');
};

Quantumart.QP8.ControlHelpers.initAllEntityDataTrees = function Quantumart$QP8$ControlHelpers$initAllEntityDataTrees(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $dataTrees = Quantumart.QP8.ControlHelpers.getAllEntityDataTrees(parentElement);
  $dataTrees.each(function (index, dataTreeElem) {
    Quantumart.QP8.ControlHelpers.initEntityDataTree(dataTreeElem);
  });
};

Quantumart.QP8.ControlHelpers.initEntityDataTree = function Quantumart$QP8$ControlHelpers$initAllEntityDataTree(dataTreeElem) {
  var $dataTree = $q.toJQuery(dataTreeElem);
  if (!$q.isNullOrEmpty($dataTree)) {
    var treeElementId = $dataTree.attr('id'),
      treeName = $dataTree.data('tree_name'),
      entityTypeCode = $dataTree.data('entity_type_code'),
      parentEntityId = $dataTree.data('parent_entity_id'),
      actionCode = $dataTree.data('read_action_code'),
      allowGlobalSelection = $dataTree.data('allow_global_selection'),
      allowMultipleNodeSelection = $dataTree.data('show_checkbox'),
      selectedIDsString = $dataTree.data('selected_ids'),
      selectedEntitiesIDs,
      virtualContentId = $dataTree.data('virtual_content_id');

    if (!$q.isNullOrWhiteSpace(selectedIDsString)) {
      selectedEntitiesIDs = selectedIDsString.toString().split(';');
    }

    var options = {
      treeName: treeName,
      allowGlobalSelection: allowGlobalSelection,
      allowMultipleNodeSelection: allowMultipleNodeSelection,
      selectedEntitiesIDs: selectedEntitiesIDs,
      virtualContentId: virtualContentId
    };

    var entityDataTree = Quantumart.QP8.BackendEntityTreeManager.getInstance().createTree(treeElementId, entityTypeCode, parentEntityId, actionCode, options);
    entityDataTree.initialize();
    $dataTree.data('entity_data_tree_component', entityDataTree);
  }
};

Quantumart.QP8.ControlHelpers.destroyAllEntityDataTrees = function Quantumart$QP8$ControlHelpers$destroyAllEntityDataTrees(parentElement) {
  if (!parentElement) {
    throw new Error($l.Common.parentDomElementNotSpecified);
  }

  var $dataTrees = Quantumart.QP8.ControlHelpers.getAllEntityDataTrees(parentElement);
  $dataTrees.each(function (index, dataTreeElem) {
    Quantumart.QP8.ControlHelpers.destroyEntityDataTree(dataTreeElem);
  });
};

Quantumart.QP8.ControlHelpers.destroyEntityDataTree = function Quantumart$QP8$ControlHelpers$destroyEntityDataTree(dataTreeElem) {
  var $dataTree = $q.toJQuery(dataTreeElem);
  if (!$q.isNullOrEmpty($dataTree)) {
    var entityDataTree = $dataTree.data('entity_data_tree_component');
    if (entityDataTree) {
      entityDataTree.dispose();
    }
  }
};

Quantumart.QP8.ControlHelpers.notImplemented = function () {
  window.alert($l.Common.methodNotImplemented);
};

Quantumart.QP8.ControlHelpers.registerClass('Quantumart.QP8.ControlHelpers');
window.$c = Quantumart.QP8.ControlHelpers;
