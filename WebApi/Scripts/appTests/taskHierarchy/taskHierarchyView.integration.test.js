/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Task Hierarchy View Integration Tests", {
	setup: function () {
		this.getHierarchyCollectionRoot = function (tasks, utilities) {
			var firstGrandchild = tasks.create(
				{
					id: utilities.CreateGuid(),
					title: 'firstGrandchild',
					children: []		
				});
			var firstChild = tasks.create(
				{
					id: utilities.CreateGuid(),
					title: 'firstChild',
					children: [firstGrandchild.get("id")]
				});
			var root = tasks.get(AppConstants.RootId);
			if (root == null) {
				root = tasks.create(
					{
						id: AppConstants.RootId,
						title: 'root',
						children: [firstChild.get("id")]
					});
			} else {
				root.set("children", [firstChild.get("id")]);
			};
			return root;
		};
		
	},
	teardown: function () {
		var hierarchy = $(document).find("#hierarchy");
		if (hierarchy.length > 0) {
			document.removeChild(hierarchy[0]);
		}
		//localStorage.clear();
	}
});


amdTest("render givenHierarchyInCollection rendersWholeHierarchy",
	1,
	['app/taskHierarchy/taskHierarchyView', 'app/collections/tasks', 'app/utilities'],
	function (ViewType, TasksType, utilities) {
		var tasks = new TasksType();
		var that = this;
		tasks.fetch({
			success: function() {
				var root = that.getHierarchyCollectionRoot(tasks, utilities);
				ViewType.prototype.rootCollection = root.collection;
				var view = new ViewType({ model: root });
				var hierarchyContainer = $('<ul id="hierarchy"> </ul>');
				view.setElement(hierarchyContainer);
				view.render();
				var treeNodes = $(hierarchyContainer).find('.taskTitle');
				equal(treeNodes.length, 3);
			}
		});
	}
);
