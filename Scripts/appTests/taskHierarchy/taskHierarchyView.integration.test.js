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
		this.getHierarchyCollectionRoot = function (tasksType) {
			var tasks = new tasksType();
			var firstGrandchild = tasks.create(
				{
					Id: 3,
					title: 'firstGrandchild',
					children: []		
				});
			var firstChild = tasks.create(
				{
					Id: 2,
					title: 'firstChild',
					children: [firstGrandchild.get("Id")]
				});
			var root = tasks.create(
			{
				Id: AppConstants.RootId,
				title: 'root',
				children: [firstChild.get("Id")]
			});
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
	['app/taskHierarchy/taskHierarchyView', 'app/collections/tasks'],
	function (ViewType, TasksType) {
		var root = this.getHierarchyCollectionRoot(TasksType);
		ViewType.prototype.rootCollection = root.collection;
		var view = new ViewType({ model: root });
		var hierarchyContainer = $('<ul id="hierarchy"> </ul>');
		view.setElement(hierarchyContainer);
		view.render();
		var treeNodes = $(hierarchyContainer).find('.taskTitle');
		equal(treeNodes.length, 3);
	}
);
