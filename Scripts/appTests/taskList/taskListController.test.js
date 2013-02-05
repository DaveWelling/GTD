/// <reference path="../../underscore.js"/>
/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../sinon-qunit-1.0.0.js"/>
/// <reference path="../createContext.js"/>

module("Task List Controller Tests.", {
	setup: function () {
		QUnit.config.testTimeout = 3000;
		var that = this;
		this.view = {
			render: sinon.stub()
		};
		this.stubs = {
			'app/taskList/taskListView': function () {
				return that.view;
			}
		};
		this.ctxt = new createContext(this.stubs);
	}
});

test("start viewTypeExists renderCalled", function () {
	expect(1);
	stop();
	var that = this;
	this.ctxt(['app/taskList/taskListController'], function (controllerType) {
		var controller = new controllerType();
		controller.start();
		ok(that.view.render.calledOnce, "render was called once on the task list view");
		controller.destroy();
		start();
	});
});


asyncTest("task:addToParent event triggers render", function () {
	expect(1);
	var that = this;
	this.ctxt(['app/eventSink', 'app/taskList/taskListController']
		, function (sink, controllerType) {
			var controller = new controllerType();
			controller.start();
			sink.trigger("task:addToParent", "root");
			ok(that.view.render.calledTwice, "render should be called in the start method and the addToParent event.");
			controller.destroy();
			start();
	});
});