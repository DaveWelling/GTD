/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../amdQunit.js"/>

var taskHierarchyControllerTests = {
	view : {
		render: sinon.stub(),
		taskSelected: sinon.stub(),
		rootCollection: {get: function() {}}
		},
		stubs : {
			'app/taskHierarchy/taskHierarchyView': function () {
				return taskHierarchyControllerTests.view;
			}
		}
};

module("Task Hierarchy Controller Tests.");


amdTest("start | viewTypeExists | renderCalled", 
	1,
	["app/taskHierarchy/taskHierarchyController"],
	function (controllerType) {
		var modelFake = { collection: { get: function () { } } };
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
		var modelFake = { collection: {} };
		var controller = new controllerType(modelFake);
		controller.start();
		sink.trigger("router:taskIdSelected", 9999);

		ok(taskHierarchyControllerTests.view.taskSelected.calledOnce);
	},
	taskHierarchyControllerTests.stubs
);



