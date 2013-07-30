/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../amdQunit.js"/>
/// <reference path="../../backbone.js"/>
/// 

module("Task Hierarchy Controller Tests.", {
	teardown : function() {
		taskHierarchyControllerTests.reset();
	}
});

var taskHierarchyControllerTests = (function () {
	this.reset = function() {
		this.view = {
			render: sinon.stub(),
			taskSelected: sinon.stub(),
			rootCollection: this.tasks
		};
		this.tasks.addToParent = sinon.spy();
	};
	var that = this;
	this.tasks = {
		get: function () { },
		addToParent: sinon.spy()
	};
	_.extend(this.tasks, Backbone.Events);
	this.reset();
	this.stubs = {
		'app/taskHierarchy/taskHierarchyView': function() {
			return that.view;
		},
		'app/collections/tasks': function() {
			return that.tasks;
		}
	};
	return this;
}());

amdTest("start | viewTypeExists | renderCalled",
	1,
	["app/taskHierarchy/taskHierarchyController"],
	function (controllerType) {
		var modelFake = { collection: taskHierarchyControllerTests.tasks };
		var controller = new controllerType(modelFake);
		controller.start();
		ok(taskHierarchyControllerTests.view.render.calledOnce, "render was called once on the task list view");
	},
	taskHierarchyControllerTests.stubs
);


amdTest("router:taskIdSelected | causes taskSelected to run",
	1,
	["app/taskHierarchy/taskHierarchyController", "app/eventSink"]
	, function (controllerType, sink) {
		var modelFake = { collection: taskHierarchyControllerTests.tasks };
		var controller = new controllerType(modelFake);
		controller.start();
		sink.trigger("router:taskIdSelected", 9999);

		ok(taskHierarchyControllerTests.view.taskSelected.calledOnce);
	},
	taskHierarchyControllerTests.stubs
);

amdTest("tasks:FilterChange | | view.render called",
	1,
	["app/taskHierarchy/taskHierarchyController"],
	function (controllerType) {
		var modelFake = { collection: taskHierarchyControllerTests.tasks };
		var controller = new controllerType(modelFake);
		controller.start();
		taskHierarchyControllerTests.tasks.trigger("tasks:FilterChange");
		// rendered in start and then in tasks:FilterChange handler
		ok(taskHierarchyControllerTests.view.render.calledTwice);
	},
	taskHierarchyControllerTests.stubs
);

amdTest("addNewTaskToParent | given parent task id | tasks addToParent called with parent task id",
	1,
	["app/taskHierarchy/taskHierarchyController"],
	function (controllerType) {
		var controller = new controllerType({ collection: taskHierarchyControllerTests.tasks });
		var expectedParentId = "fake";
		controller.addNewTaskToParent(expectedParentId);
		ok(taskHierarchyControllerTests.stubs["app/collections/tasks"]().addToParent.calledWith(expectedParentId));
	},
	taskHierarchyControllerTests.stubs
);
