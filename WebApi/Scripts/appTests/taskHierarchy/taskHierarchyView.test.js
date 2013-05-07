/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../sinon-qunit-1.0.0.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>
var taskHierarchyViewTest = (function() {
	var output = {};
	output.getHierarchyCollection = function (tasksType) {
		var tasks = new tasksType();
		this.firstGrandchild = new tasks.model(
			{
				id: 3,
				title: 'firstGrandchild',
				children: []
			});
		tasks.add(this.firstGrandchild);
		var firstChild = new tasks.model(
			{
				id: 2,
				title: 'firstChild',
				children: [this.firstGrandchild.get("id")]
			});
		tasks.add(firstChild);
		output.root = new tasks.model(
			{
				id: AppConstants.RootId,
				title: 'root',
				children: [firstChild.get("id")]
			});
		tasks.add(output.root);
		return tasks;
	};
	return output;
}());

module("Task Hierarchy View Tests");

amdTest({
	testDescription: "taskAddedToParent | validTaskAndParentTask | newChildNodeAppendedToParentNode",
	numberExpectedAssertions : 1,
	amdDependencies : ["app/taskHierarchy/taskHierarchyView", "app/collections/tasks"],
	testFunction: function (viewType, tasksType) {
		var tasks = new tasksType();
		var parentTask = new tasks.model({ id: 1, title: "test title" });
		var childTask = new tasks.model({ id: 2, title: "test title" });
		tasks.add(parentTask);
		tasks.add(childTask);
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: parentTask });
		view.render();
		view.on("render", function () {
			equal(view.$el.find('[data-taskId=2]').length, 1);
		});
		parentTask.set("children", [2]);
	}
});


amdTest({
	testDescription: "task removed from parent | valid task and parentTask | child node removed from parent node",
	numberExpectedAssertions: 1,
	amdDependencies: ["app/taskHierarchy/taskHierarchyView", "app/collections/tasks"],
	testFunction: function (viewType, tasksType) {
		var tasks = new tasksType();
		var parentTask = new tasks.model({ id: 1, title: "test title", children: [2] });
		var childTask = new tasks.model({ id: 2, title: "test title" });
		tasks.add(parentTask);
		tasks.add(childTask);
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: parentTask });
		view.render();
		view.on("render", function () {
			equal(view.$el.find('[data-taskId=2]').length, 0);
		});
		parentTask.set("children", []);
	}
});
//test("taskAddedToParent validTaskAndParentTask newChildNodeAppendedToParentNode", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		var parentStub = hierarchyView.firstChild.firstChild;
//		view.setElement(hierarchyView);
//		var parentTaskStub = { id: '2', children: [], get: function () { return {}; } };
//		var newTaskStub = { id: '3', title: 'a new test task', toJSON: function () { return this; } };
//		view.taskAddedToParent(newTaskStub, parentTaskStub);
//		// parentstub / ul / li -> check attribute
//		equal(parentStub.firstChild.firstChild.getAttribute("data-taskId"), AppConstants.RootId, "Parent node of parent task should receive an append.");	
//	});
//});

amdTest("getSelectedTask | view Contains Selected Task | selected Task Returned",
	1,
	["app/taskHierarchy/taskHierarchyView", 'app/collections/tasks'],
	function (viewType, tasksType) {
		var tasks = taskHierarchyViewTest.getHierarchyCollection(tasksType);
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: tasks.get(AppConstants.RootId) });
		view.render();
		var hierarchyRoot = view.$el.find("[data-taskId='" + AppConstants.RootId + "']").first()[0];
		$(hierarchyRoot).addClass('selectedTask');
		equal(view.getSelectedTaskElement(), hierarchyRoot);
	}
);

amdTest("render | 1 task fails default filter | failing task filtered out of render",
	1,
	["app/taskHierarchy/taskHierarchyView", 'app/collections/tasks'],
	function (viewType, tasksType) {
		var tasks = taskHierarchyViewTest.getHierarchyCollection(tasksType);
		// status = 'Complete' fails default filter
		taskHierarchyViewTest.firstGrandchild.set("status", 'Complete');
		var failingId = taskHierarchyViewTest.firstGrandchild.id;
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: tasks.get(AppConstants.RootId) });
		view.render();
		equal(view.$el.find('[data-taskId="' + failingId + '"]').length, 0);
	}
);
//test("selectedTask noSelectedTask nullReturned", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
//		equal(view.getSelectedTask(), null);
//	});
//});


//test("taskSelected previousSelectedTaskExists previousSelectedClassNoLongerSelected", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
//		$(this.hierarchyRoot).addClass('selectedTask');
//		view.taskSelected(this.firstParent);
//		ok(!$(this.hierarchyRoot).hasClass('selectedTask'));
//	});
//});


//test("taskSelected previousSelectedTaskExists newTaskSelected", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
//		$(this.hierarchyRoot).addClass('selectedTask');
//		view.taskSelected(this.firstParent);
//		ok($(this.firstParent).hasClass('selectedTask'));
//	});
//});

//amdTest({
//	testDescription: "addNewTaskToParentRequest | raisedByRootChild | raises Task:AddToParent with root Id",
//	numberExpectedAssertions: 1,
//	amdDependencies: ["app/taskHierarchy/taskHierarchyView", "app/collections/tasks", 'app/eventSink'],
//	testFunction: function(viewType, tasksType, sink) {
//		stop();
//		var tasks = taskHierarchyViewTest.getHierarchyCollection(tasksType);
//		viewType.prototype.rootCollection = tasks;
//		var view = new viewType({ model: taskHierarchyViewTest.root });
//		view.render();
//		var target = view.$el.find(".taskAdd").first()[0];
//		var fakeEventArgs = {
//			target: target
//		};
//		sink.on("task:addToParent", function (parentTaskId) {
//			equal(parentTaskId, AppConstants.RootId);
//			start();
//		});
//		view.addNewTaskToParentRequest(fakeEventArgs);
//	}
//});

amdTest({
	testDescription: "addNewTaskToParentRequest | raisedByRootChild | raises Task:AddToParent with root Id",
	numberExpectedAssertions: 1,
	amdDependencies: ["app/taskHierarchy/taskHierarchyView", 'app/eventSink'],
	testFunction: function (viewType, sink) {
		stop();
		var view = new viewType();
		var parentNode = $("<div name='parent' data-taskId='" + AppConstants.RootId + "'></div>");
		var childNode = $("<div name='child'></div>");
		parentNode.append(childNode);
		var fakeEventArgs = {
			target: childNode[0]
		};
		sink.on("task:addToParent", function (parentTaskId) {
			equal(parentTaskId, AppConstants.RootId);
			start();
		});
		view.addNewTaskToParentRequest(fakeEventArgs);
	}
});

//test("addTaskToParent raisedByRootChild raises Task:AddToParent with root Id", function () {
//	this.asyncShell(1, function (view, tasks, sink) {
//		this.generateTwoTierHierarchy();
//		var fakeEventArgs = {
//			target: this.hierarchyRoot.children[0]
//		};
//		sink.on("task:addToParent", function (parentTaskId) {
//			equal(parentTaskId, AppConstants.RootId);
//		});
//		view.addTaskToParent(fakeEventArgs);
//	});
//});

//amdTest("taskTitleChanged | valid task given | corresponding hierarchy element updated",
//	1,
//	['app/taskHierarchy/taskHierarchyView', 'app/models/task'],
//	function (viewType, taskType) {
//		var testCollection = this.getHierarchyCollection();
//		var view = new viewType(testCollection);
//		var task = testCollection.models[1];
//		task.set
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
		
//	}
//);

//amdTest("model change event | new task added to children | new task renders",
//	1,
//	["app/taskHierarchy/taskHierarchyView", "app/models/task"],
//	function (viewType, taskType) {
//		stop();
//		var expectedId = 1;
//		var task = new taskType();
//		var view = new viewType({ model: task });
//		view.on("render", function() {
//			ok(true, "Expecting a render call when the children change on the view's task.");
//			start();
//		});
//		var children = task.get("children");
//		children.push(expectedId);
//		task.set("children", children);
//	}
//);