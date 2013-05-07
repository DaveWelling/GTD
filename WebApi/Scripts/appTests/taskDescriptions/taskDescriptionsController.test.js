module("TaskDescriptions Controller Tests", {
	setup: function() {
	},
	teardown: function() {
		taskDescriptionsControllerTest.reset();
	}
});

var taskDescriptionsControllerTest = (function () {
	// Create view fake
	var viewFake = {
		taskSelected : sinon.spy()
	};
	_.extend(viewFake, Backbone.Events);
	
	var outputModule = {};
	// Add fakes to module
	outputModule.fakes = {
		// Always return the same object;
		"app/taskDescriptions/taskDescriptionsView": function () {
			return viewFake;
		}
	};
	// Allow fakes to be reset
	outputModule.reset = function() {
		viewFake.taskSelected = sinon.spy();
	};
	return outputModule;
}());

amdTest("View state changes to 'ActionPending' | Current task state = 'Archived' | Current task state = 'ActionPending'",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ status: "Archived" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);
		
		// prevent ajax call;
		sinon.stub(task, "save");
		view.trigger("StateChanged", "ActionPending");

		equal(controller.getCurrentTask().get("status"), "ActionPending");
	},
	taskDescriptionsControllerTest.fakes
);


amdTest("Current task status = 'Archived' | view status changes to 'ActionPending' | model 'save' method called",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ status: "Archived" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		// prevent ajax call;
		sinon.stub(task, "save");
		view.trigger("StateChanged", "ActionPending");

		ok(task.save.calledOnce);
	},
	taskDescriptionsControllerTest.fakes
);

amdTest("setCurrentTask | previous task null | getCurrentTask returns new task",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var task = new taskType();
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		equal(controller.getCurrentTask(), task);
	},
	taskDescriptionsControllerTest.fakes
);


amdTest("setCurrentTask | valid task passed | taskSelected called on view with passed task",
	2,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType();
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		// uses a sinon spy on taskSelected in fake
		ok(view.taskSelected.calledOnce);
		ok(view.taskSelected.calledWith(task));
	},
	taskDescriptionsControllerTest.fakes
);

amdTest("View 'When' detail changes to 'Now' | Current 'When' detail = 'Soon' | model 'save' method called",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ when: "Soon" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		// prevent ajax call;
		sinon.stub(task, "save");
		view.trigger("WhenChanged", "Now");

		ok(task.save.calledOnce);
	},
	taskDescriptionsControllerTest.fakes
);


amdTest("View 'When' detail changes to 'Now' | Current 'When' detail = 'Soon' | Current task when = 'Now'",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ when: "Soon" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		// prevent ajax call;
		sinon.stub(task, "save");
		view.trigger("WhenChanged", "Now");

		equal(controller.getCurrentTask().get("when"), "Now");
	},
	taskDescriptionsControllerTest.fakes
);

amdTest("View 'Where' detail changes to 'Home' | Current 'Where' detail = 'Work' | model 'save' method called",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ where: "Work" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		// prevent ajax call;
		sinon.stub(task, "save");
		view.trigger("WhereChanged", "Home");

		ok(task.save.calledOnce);
	},
	taskDescriptionsControllerTest.fakes
);


amdTest("View 'Where' detail changes to 'Home' | Current 'Where' detail = 'Work' | Current task where = 'Home'",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ where: "Work" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);

		// prevent ajax call;
		sinon.stub(task, "save");
		view.trigger("WhereChanged", "Home");

		equal(controller.getCurrentTask().get("where"), "Home");
	},
	taskDescriptionsControllerTest.fakes
);