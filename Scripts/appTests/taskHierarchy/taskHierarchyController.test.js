/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../sinon-qunit-1.0.0.js"/>
/// <reference path="../createContext.js"/>

module("Task Hierarchy Controller Tests.", {
	setup: function () {
		var that = this;
		this.asyncShell = function (numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			this.ctxt(['app/taskHierarchy/taskHierarchyController', 'app/eventSink']
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
			taskAddedToParent: sinon.stub()
		};
		this.stubs = {
			'app/taskHierarchy/taskHierarchyView': function () {
				return that.view;
			}
		};
		this.ctxt = new CreateContext(this.stubs);
	}
});

test("start viewTypeExists renderCalled", function () {
	this.asyncShell(1, function (controller, sink) {
		controller.start();
		ok(this.view.render.calledOnce, "render was called once on the task list view");
	});
});

test("tasks:taskAddedToParent validTaskAdded taskAddedToParent called", function () {
	this.asyncShell(1, function (controller, sink) {
		controller.start();
		sink.trigger("tasks:taskAddedToParent");
		ok(this.view.taskAddedToParent.calledOnce, "tasks:taskAddedToParent should trigger view.taskAddedToParent");
	});
});
