Quantumart.QP8.Home = function (documentContext, siteElementId, searchElementId, lockedElementId, approvalElementId, loggedAsElementId, customerCode) {

	function initialize() {
		var $search = jQuery("#" + searchElementId);
		$search.wrap($("<div/>", { id : searchElementId + "_wrapper", class : "fieldWrapper group myClass" }));
		var $wrapper = $search.parent("div");
		var $form = $search.parents("form");
		$form.on("submit", onSubmit);
		var $div = $("<div/>", {
			id : searchElementId + '_preview',
			class : 'previewButton',
			title: $l.Home.search
		});
		$div.append($("<img/>", { src: '/Backend/Content/Common/0.gif' }));
		$wrapper.append($div);
		$div.on("click", onSubmit);
		var $locked = jQuery("#" + lockedElementId);
		var $loggedAs = jQuery("#" + loggedAsElementId);
		var $approval = jQuery("#" + approvalElementId);
		var temp = ' (<a class="js" href="javascript:void(0)">{0}</a>) ';
		var listStr = String.format(temp, $l.Home.list);
		var profileStr = String.format(temp, $l.Home.profile); ;

		if ($locked.text().trim() != "0") {
			$locked.append(listStr);
			$locked.find("a").on("click", function () {
 executeAction('list_locked_article', 'db', 1, customerCode, 0); 
});
		}

		if ($approval.text().trim() != "0") {
			$approval.append(listStr);
			$approval.find("a").on("click", function () {
 executeAction('list_articles_for_approval', 'db', 1, customerCode, 0); 
});
		}

		$loggedAs.append(profileStr);
		$loggedAs.find("a").on("click", function () {
 executeAction('edit_profile', 'db', 1, customerCode, 0); 
});

	}

	function onSubmit(e) {
		e.preventDefault();
		var $site = jQuery("#" + siteElementId);
		var siteId = $site.val();

		if (siteId) {
			var siteName = $site.text();
			var text = jQuery("#" + searchElementId).val();
			executeAction('search_in_articles', 'site', siteId, siteName, 1, { query: text });
		}
	}

	function executeAction(actionCode, entityTypeCode, entityId, entityName, parentEntityId, additionalUrlParameters) {
		var action = $a.getBackendActionByCode(actionCode);

		var params = new Quantumart.QP8.BackendActionParameters({
			entityTypeCode: entityTypeCode,
			entityId: entityId,
			entityName: entityName,
			parentEntityId: parentEntityId
		});

		var eventArgs = $a.getEventArgsFromActionWithParams(action, params);
		eventArgs.set_context({ additionalUrlParameters: additionalUrlParameters });
		documentContext.getHost().onActionExecuting(eventArgs);
	}


	function dispose() {
		jQuery("#" + searchElementId).siblings(".previewButton").off("click");
		jQuery("#" + searchElementId).parents("form").off("sumbit");
		jQuery("#" + lockedElementId).find("a").off("click");
		jQuery("#" + loggedAsElementId).find("a").off("click");
		jQuery("#" + approvalElementId).find("a").off("click");
	}

	return {
		dispose: dispose,
		initialize: initialize
	};
};
