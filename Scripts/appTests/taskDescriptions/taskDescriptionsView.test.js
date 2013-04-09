/// <reference path="../amdQunit.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
/// <reference path="../../backbone.min.js"/>
module("TaskDescriptions View Tests", {
	setup: function () {
		//var that = this;
		//this.asyncShell = function (numberAssertionsExpected, testFunction) {
		//	expect(numberAssertionsExpected);
		//	stop(2000);
		//	that.ctxt(['app/taskDescriptions/taskDescriptionsView', 'app/eventSink']
		//		, function (viewType, sink) {
		//			var view = new viewType();
		//			try {
		//				testFunction = _.bind(testFunction, that);
		//				testFunction(view, sink);
		//			} catch (e) {
		//				throw e;
		//			}
		//			start();
		//		});
		//};
		//this.buildMockDom = function() {
		//	this.mockDom = $('<div id="descriptionsContainer"> \
		//				<input id="taskTitleInput" type="text" placeholder="Enter a task title" />  \
		//				<textarea id="taskLongDescription"></textarea> \
		//				<input type="radio" id="radio-choice-actionPending" /> \
		//			</div>');
		//	// mock out kendo methods
		//	var longDescriptionElement = this.mockDom[0].children[1];
		//	longDescriptionElement.textEditor = {
		//		getValue: function () {
		//			return $(longDescriptionElement).val();
		//		}
		//	};
			
		//	return this.mockDom;
		//};
		
		//this.stubs = {};
		//this.ctxt = new CreateContext(this.stubs);
	}
});


//test("selectedTask viewContainsSelectedTask selectedTaskReturned", function () {
//	this.asyncShell(1, function (view, sink) {
//		var fakeTask = {id: "someId"};
//		view.model = fakeTask;
//		var titleChangedCallback = function(task) {
//			equal(task.id, fakeTask.id);
//		};
//		sink.on("task:titleChanged", titleChangedCallback);
//		view.taskTitleChanged();
//		sink.off("task:titleChanged", titleChangedCallback);
//	});
//});



//amdTest("LongDescriptionChanged.proxy | new text entered | model updated with text",
//	1,
//	["app/taskDescriptions/taskDescriptionsView", "app/models/task"],
//	function (viewType, taskType) {
//		var expectedText = "some test text";
//		var view = new viewType();
//		var task = new taskType();
//		view.model = task;
//		var mockElement = this.buildMockDom();
//		view.setElement(mockElement);
//		var longDescription = $(mockElement).children("#taskLongDescription").first();
//		$(longDescription).val(expectedText);
//		var handlerInstance = new view.LongDescriptionChanged(view);
//		handlerInstance.proxy();
//		equal(task.get("description"), expectedText);
//	}
//);

amdTest("Change status to 'Complete'| previous status 'ActionPending' | 'StateChanged' event raised"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("status", "ActionPending");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		view.on("StateChanged", function(newState) {
			equal(newState, "Complete");
		});
		var completeRadio = view.$el.find("#radio-choice-complete");
		completeRadio.attr('checked', true);
		completeRadio.trigger('change');
	}
);

amdTest("Render| status 'Complete' | 'Complete' radio is checked"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("status", "Complete");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		var completeRadio = view.$el.find("#radio-choice-complete")[0];
		equal(completeRadio.checked, true);
	}
);


amdTest("Render| status 'Complete' | 'ActionPending' radio is NOT checked"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("status", "Complete");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		var actionPendingRadio = view.$el.find("#radio-choice-actionPending")[0];
		equal(actionPendingRadio.checked, false);
	}
);


amdTest("Change 'When' to 'Now'| previous 'When = 'Soon' | 'WhenChanged' event raised"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("when", "Soon");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		view.on("WhenChanged", function (newWhen) {
			equal(newWhen, "Now");
		});
		var radioNow = view.$el.find("#radioNow");
		radioNow.attr('checked', true);
		radioNow.trigger('change');
	}
);

amdTest("Render| when = 'Now' | 'Now' radio is checked"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("when", "Now");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		var radioNow = view.$el.find("#radioNow")[0];
		equal(radioNow.checked, true);
	}
);

amdTest("Render| when = 'Now' | 'Soon' radio is NOT checked"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("when", "Now");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		var radioSoon = view.$el.find("#radioSoon")[0];
		equal(radioSoon.checked, false);
	}
);


amdTest("Change 'Where' to 'Home'| previous 'Where = 'Work' | 'WhereChanged' event raised"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("where", "Work");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		view.on("WhereChanged", function (newWhere) {
			equal(newWhere, "Home");
		});
		var radioHome = view.$el.find("#radioHome");
		radioHome.attr('checked', true);
		radioHome.trigger('change');
	}
);

amdTest("Render| where = 'Home' | 'Home' radio is checked"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("where", "Home");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		var radioHome = view.$el.find("#radioHome")[0];
		equal(radioHome.checked, true);
	}
);

amdTest("Render| where = 'Home' | 'Work' radio is NOT checked"
	, 1
	, ["app/taskDescriptions/taskDescriptionsView", "app/models/task"]
	, function (viewType, taskType) {
		var view = new viewType();
		var task = new taskType();
		task.set("where", "Home");
		view.model = task;
		view.setElement($("<div id='descriptionsContainer'></div>"));
		view.render();
		var radioWork = view.$el.find("#radioWork")[0];
		equal(radioWork.checked, false);
	}
);