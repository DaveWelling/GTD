/// <reference path="../amdQunit.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../sinon-1.4.2.js"/>

module("TaskFilters Controller Tests", {
	teardown: function() {
		taskFiltersControllerTest.reset();
	}
});

// create fakes used by tests
var taskFiltersControllerTest = (function () {
	var viewFake = {};
	var outputModule = {};
	var setFake = function() {
		viewFake = {
			render: sinon.spy(),
			getFilters: sinon.stub().returns(outputModule.FiltersResult)
		};
		_.extend(viewFake, Backbone.Events);
	};
	setFake();
	// default values
	outputModule.FiltersResult = {
		state: ["Action Pending"],
		when: ["Now", "Next", "Soon", "Later"],
		where: ["Work"]
	};
	outputModule.fakes = {
		"app/taskFilters/taskFiltersView": function() {
			return viewFake;
		}
	};
	// Allow fakes to be reset
	outputModule.reset = function () {
		setFake();
	};
	return outputModule;
}());

amdTest("Start | valid view passed in | view renders",
	1,
	["app/taskFilters/taskFiltersController"],
	function(controllerType) {
		var controller = new controllerType();
		controller.start();
		var view = taskFiltersControllerTest.fakes["app/taskFilters/taskFiltersView"]();
		ok(view.render.calledOnce);
	},
	taskFiltersControllerTest.fakes);

amdTest("View.applyFilters event | | View.getfilters called",
	1,
	["app/taskFilters/taskFiltersController"],
	function(controllerType) {
		var controller = new controllerType();
		controller.start();
		var view = taskFiltersControllerTest.fakes["app/taskFilters/taskFiltersView"]();
		view.trigger("applyFilters");
		ok(view.getFilters.calledOnce);
	},
	taskFiltersControllerTest.fakes);

amdTest("View.applyFilters event | valid filter exists | raises sink event FilterChange",
	1,
	["app/taskFilters/taskFiltersController", "app/eventSink"],
	function(controllerType, sink) {
		var controller = new controllerType();
		controller.start();
		var view = taskFiltersControllerTest.fakes["app/taskFilters/taskFiltersView"]();
		var assertion = function(filter) {
			ok(true);
		};
		try {
			sink.on("taskFiltersController:FilterChange", assertion, this);
			view.trigger("applyFilters");
		} finally {
			sink.off("taskFiltersController:FilterChange", assertion);
		} 
	},
	taskFiltersControllerTest.fakes
);

amdTest("View.applyFilters event | getFilters returns default filters | raises sink event FilterChange with default filters",
	1,
	["app/taskFilters/taskFiltersController", "app/eventSink"],
	function(controllerType, sink) {
		var controller = new controllerType();
		controller.start();
		var view = taskFiltersControllerTest.fakes["app/taskFilters/taskFiltersView"]();
		var assertion = function(filter) {
			deepEqual(filter, taskFiltersControllerTest.FiltersResult);
		};
		try {
			sink.on("taskFiltersController:FilterChange", assertion, this);
			view.trigger("applyFilters");
		} finally {
			sink.off("taskFiltersController:FilterChange", assertion);
		} 
	},
	taskFiltersControllerTest.fakes
);