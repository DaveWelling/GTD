/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>

module("Tasks Collection Tests", {
	setup: function () {
		var that = this;
		this.ctxt = new CreateContext({});
		this.asyncShell = function (numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			this.ctxt(['app/collections/tasks', 'app/eventSink', 'app/models/task'], function (tasksType, sink, taskType) {
				var tasks = new tasksType();
				try {
					testFunction = _.bind(testFunction, that);
					testFunction(tasks, sink, taskType, tasksType);
					tasks.destroy();
				} catch (e) {
					tasks.destroy();
					throw e;
				}
				start();
			});
		};
	}
});

test("on task:addToParent event - where parent does not exist - exception", function () {
	this.asyncShell(1, function(tasks, sink, taskType, tasksType) {
		testUtilities.expectException(function() {
			sink.trigger("task:addToParent", 'does not exist');
		}, "No task for parent ID");
	});
});

test("on destruction - removes event bindings", function () {
	this.asyncShell(2, function (tasks, sink, taskType, tasksType) {
		equal(tasks.length, 0);
		tasks.destroy();
		sink.trigger("task:addToParent", "root");
		equal(tasks.length, 0);	
	});
});

test("addToParent triggers tasks:taskAddedToParent", function () {
	this.asyncShell(1, function (tasks, sink, taskType, tasksType) {
		sink.on("tasks:taskAddedToParent", function (task, parentTask) {
			equal(parentTask.get("title"), "parent task title");
		}, this);
		var testParentTask = tasks.create({ title: "parent task title" });
		sink.trigger("task:addToParent", testParentTask.id);
		
	});
});