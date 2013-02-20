/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../app/constants.js"/>

module("Task List View Integration Tests", {
	setup: function () {
		var that = this;
		this.asyncShell = function(numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			this.ctxt(['app/taskList/taskListView', 'app/collections/tasks'], function(viewType, tasksType) {
				var hierarchyCollection = that.getHierarchyCollection(tasksType);
				var view = new viewType({ collection: hierarchyCollection });
				try {
					testFunction = _.bind(testFunction, that);
					testFunction(view, hierarchyCollection);
					hierarchyCollection.destroy();
				} catch(e) {
					hierarchyCollection.destroy();
					throw e;
				}
				start();
			});
		};
		this.ctxt = new CreateContext({});
		this.getHierarchyCollection = function (tasksType) {
			var tasks = new tasksType();
			var firstGrandchild = tasks.create(
				{
					id: 3,
					title: 'firstGrandchild',
					children: []		
				});
			var firstChild = tasks.create(
				{
					id: 2,
					title: 'firstChild',
					children: [firstGrandchild.id]
				});
			var root = tasks.create(
			{
				id: AppConstants.RootId,
				title: 'root',
				children: [firstChild.id]
			});
			return tasks;
		};
	},
	teardown: function () {
		var hierarchy = $(document).find("#hierarchy");
		if (hierarchy.length > 0) {
			document.removeChild(hierarchy[0]);
		}
		localStorage.clear();
	}
});

test("render givenHierarchyInCollection rendersWholeHierarchy", function () {
	this.asyncShell(1, function (view, tasks) {
		var hierarchyContainer = $('<div id="hierarchy"> </div>');
		view.setElement(hierarchyContainer);
		view.render();
		var treeNodes = $(hierarchyContainer).find('[data-taskId]');
		equal(treeNodes.length, 3);
	});
});
