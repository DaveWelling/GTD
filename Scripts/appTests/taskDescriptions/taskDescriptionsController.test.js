module("TaskDescriptions Controller Tests", {
	setup: function() {
		var that = this;
		this.asyncShell = function (numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			that.ctxt(['app/taskDescriptions/taskDescriptionsController', 'app/eventSink']
				, function (controllerType, sink) {
					var controller = new controllerType();
					try {
						testFunction = _.bind(testFunction, that);
						testFunction(controller, sink);
						controller.destroy();
					} catch (e) {
						controller.destroy();
						throw e;
					}
					start();
				});
		};
		this.view = {
			render: sinon.stub(),
		};
		this.stubs = {
			'app/taskDescriptions/taskDescriptionsView': function () {
				return that.view;
			}
		};
		this.ctxt = new CreateContext(this.stubs);
	}
});

test("taskSelected raised taskRendered", function() {
	this.asyncShell(1, function (controller, sink) {
		controller.start();
		sink.trigger("task:idSelected", 1);
		ok(this.view.render.calledOnce, "TaskDescriptions render should be called when a task is selected.");
	});
});

test("taskSelected raised task title selected", function () {

});