/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../app/constants.js"/>

module("Task List View Tests", {
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
		//taskListTemplate
		this.fakeTemplateResult = function () {
			var content = "<li data-taskId='" + AppConstants.RootId + "'>whatever</li>";
			return $(content)[0];
		};
		this.template = {
			load: function (name, req, onload, config) {
				that.template.loadCalled = true;
				onload(that.fakeTemplateResult);
			},
			loadCalled: false
		};
		this.stubs = {
			'hbs': that.template
		};
		this.ctxt = new CreateContext(this.stubs);
		this.generateTwoTierHierarchy = function () {
			var hierarchyView = document.createElement("div");
			hierarchyView.id = "hierarchy";
			var root = document.createElement("div");
			root.id = AppConstants.RootId;
			root.setAttribute("data-taskId", root.id);
			$(hierarchyView).append(root);
			var parent = document.createElement("div");
			parent.id = "2";
			parent.setAttribute("data-taskId", parent.id);
			$(root).append(parent);
			return hierarchyView;
		};
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
test("verify shell works", function() {
	this.asyncShell(3, function(view, tasks) {
		ok(typeof view != 'undefined');
		ok(typeof tasks != 'undefined');
		equal(tasks.models.length, 3);
	});
});

test("Render NotPassedParent RendersRootCollection", function () {
	this.asyncShell(2, function (view, tasks) {
		// prevent recursive render calls by removing children
		var rootTask = tasks.get(AppConstants.RootId);
		rootTask.set("children",[]);
		var elStub = document.createElement('div');
		elStub.setAttribute("id", "hierarchy");
		view.setElement(elStub);
		view.render();
		ok(this.template.loadCalled, "template constructor should be called");
		ok($(elStub).find("[data-taskId='" + AppConstants.RootId + "']").length > 0,"root render should append to $el");
	});
});

test("taskAddedToParent validTaskAndParentTask newChildNodeAppendedToParentNode", function () {
	this.asyncShell(1, function (view, tasks) {
		var hierarchyView = this.generateTwoTierHierarchy();
		var parentStub = hierarchyView.firstChild.firstChild;
		view.setElement(hierarchyView);
		var parentTaskStub = { id: '2', children: [], get: function () { return {}; } };
		var newTaskStub = { id: '3', title: 'a new test task', toJSON: function () { return this; } };
		view.taskAddedToParent(newTaskStub, parentTaskStub);
		// parentstub / ul / li -> check attribute
		equal(parentStub.firstChild.firstChild.getAttribute("data-taskId"), AppConstants.RootId, "Parent node of parent task should receive an append.");	
	});
});

