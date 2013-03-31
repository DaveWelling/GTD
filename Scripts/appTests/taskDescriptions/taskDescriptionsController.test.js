module("TaskDescriptions Controller Tests", {
	setup: function() {
	}
});

var taskDescriptionsControllerTest = (function () {
	var viewFake = {
		taskSelected : sinon.spy()
	};
	_.extend(viewFake, Backbone.Events);
	
	var output = {};
	output.fakes = {
		// Always return the same object;
		"app/taskDescriptions/taskDescriptionsView": function() {
			return viewFake;
		}
	};
	return output;
}());

amdTest("Current task state = 'Archived' | view state changes to 'ActionPending' | Current task state = 'ActionPending'",
	1,
	["app/taskDescriptions/taskDescriptionsController", "app/models/task"],
	function (controllerType, taskType) {
		var view = taskDescriptionsControllerTest.fakes["app/taskDescriptions/taskDescriptionsView"]();
		var task = new taskType({ State: "Archived" });
		var controller = new controllerType();
		controller.start();
		controller.setCurrentTask(task);
		view.trigger("StateChanged", "ActionPending");

		equal(controller.getCurrentTask().get("State"), "ActionPending");
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
