/// <reference path="../amdQunit.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
/// <reference path="../../backbone.min.js"/>
module("TaskDescriptions View Tests", {
	setup: function () {
		var that = this;
		this.asyncShell = function (numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			that.ctxt(['app/taskDescriptions/taskDescriptionsView', 'app/eventSink']
				, function (viewType, sink) {
					var view = new viewType();
					try {
						testFunction = _.bind(testFunction, that);
						testFunction(view, sink);
					} catch (e) {
						throw e;
					}
					start();
				});
		};
		this.buildMockDom = function() {
			this.mockDom = $('<div id="descriptionsContainer"> \
						<input id="taskTitleInput" type="text" placeholder="Enter a task title" />  \
						<textarea id="taskLongDescription"></textarea> \
						<input type="radio" id="radio-choice-actionPending" /> \
					</div>');
			// mock out kendo methods
			var longDescriptionElement = this.mockDom[0].children[1];
			longDescriptionElement.textEditor = {
				getValue: function () {
					return $(longDescriptionElement).val();
				}
			};
			
			return this.mockDom;
		};
		
		this.stubs = {};
		this.ctxt = new CreateContext(this.stubs);
	}
});


test("selectedTask viewContainsSelectedTask selectedTaskReturned", function () {
	this.asyncShell(1, function (view, sink) {
		var fakeTask = {id: "someId"};
		view.model = fakeTask;
		var titleChangedCallback = function(task) {
			equal(task.id, fakeTask.id);
		};
		sink.on("task:titleChanged", titleChangedCallback);
		view.taskTitleChanged();
		sink.off("task:titleChanged", titleChangedCallback);
	});
});



amdTest("LongDescriptionChanged.proxy | new text entered | model updated with text",
	1,
	["app/taskDescriptions/taskDescriptionsView", "app/models/task"],
	function (viewType, taskType) {
		var expectedText = "some test text";
		var view = new viewType();
		var task = new taskType();
		view.model = task;
		var mockElement = this.buildMockDom();
		view.setElement(mockElement);
		var longDescription = $(mockElement).children("#taskLongDescription").first();
		$(longDescription).val(expectedText);
		var handlerInstance = new view.LongDescriptionChanged(view);
		handlerInstance.proxy();
		equal(task.get("description"), expectedText);
	}
);