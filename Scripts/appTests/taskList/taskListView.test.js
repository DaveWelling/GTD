/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Task List View Tests", {
	setup: function () {
		var that = this;
		this.asyncShell = function(numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			this.ctxt(['app/taskList/taskListView', 'app/collections/tasks', 'app/eventSink'], function(viewType, tasksType, sink) {
				var hierarchyCollection = that.getHierarchyCollection(tasksType);
				var view = new viewType({ collection: hierarchyCollection });
				try {
					testFunction = _.bind(testFunction, that);
					testFunction(view, hierarchyCollection, sink);
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
			this.hierarchyRoot = document.createElement("div");
			this.hierarchyRoot.id = AppConstants.RootId;
			this.hierarchyRoot.setAttribute("data-taskId", this.hierarchyRoot.id);
			$(hierarchyView).append(this.hierarchyRoot);
			this.firstParent = document.createElement("div");
			this.firstParent.id = "2";
			this.firstParent.setAttribute("data-taskId", this.firstParent.id);
			$(this.hierarchyRoot).append(this.firstParent);
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

test("selectedTask viewContainsSelectedTask selectedTaskReturned", function () {
	this.asyncShell(1, function (view, tasks) {
		var hierarchyView = this.generateTwoTierHierarchy();
		view.setElement(hierarchyView);
		$(this.hierarchyRoot).addClass('selectedTask');
		equal(view.getSelectedTask(), this.hierarchyRoot);
	});
});

test("selectedTask noSelectedTask nullReturned", function () {
	this.asyncShell(1, function (view, tasks) {
		var hierarchyView = this.generateTwoTierHierarchy();
		view.setElement(hierarchyView);
		equal(view.getSelectedTask(), null);
	});
});


test("taskSelected previousSelectedTaskExists previousSelectedClassNoLongerSelected", function () {
	this.asyncShell(1, function (view, tasks) {
		var hierarchyView = this.generateTwoTierHierarchy();
		view.setElement(hierarchyView);
		$(this.hierarchyRoot).addClass('selectedTask');
		view.taskSelected(this.firstParent);
		ok(!$(this.hierarchyRoot).hasClass('selectedTask'));
	});
});


test("taskSelected previousSelectedTaskExists newTaskSelected", function () {
	this.asyncShell(1, function (view, tasks) {
		var hierarchyView = this.generateTwoTierHierarchy();
		view.setElement(hierarchyView);
		$(this.hierarchyRoot).addClass('selectedTask');
		view.taskSelected(this.firstParent);
		ok($(this.firstParent).hasClass('selectedTask'));
	});
});

test("addTaskToParent raisedByRootChild raises Task:AddToParent with root Id", function () {
	this.asyncShell(1, function (view, tasks, sink) {
		this.generateTwoTierHierarchy();
		var fakeEventArgs = {
			target: this.hierarchyRoot.children[0]
		};
		sink.on("task:addToParent", function (parentTaskId) {
			equal(parentTaskId, AppConstants.RootId);
		});
		view.addTaskToParent(fakeEventArgs);
	});
});

amdTest("taskTitleChanged | valid task given | corresponding hierarchy element updated",
	1,
	['app/taskList/taskListView', 'app/models/task'],
	function (viewType, taskType) {
		var testCollection = this.getHierarchyCollection();
		var view = new viewType(testCollection);
		var task = testCollection.models[1];
		task.set
		var hierarchyView = this.generateTwoTierHierarchy();
		view.setElement(hierarchyView);
		
	}
);