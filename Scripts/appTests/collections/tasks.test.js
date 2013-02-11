/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>

module("Tasks Collection Tests", {
	setup: function () {
		stop();
		var that = this;
		require(['app/collections/tasks', 'app/eventSink', 'app/models/task'], function(tasksType, sink, taskType) {
			that.tasksType = tasksType;
			that.sink = sink;
			that.tasksType = taskType;
			that.tasks = new tasksType();
			start();
		});
	},
	teardown: function() {
		this.tasks.destroy();
	}
});

test("on task:addToParent event - where parent does not exist - exception", function () {
	var that = this;
	testUtilities.expectException(function() {
		that.sink.trigger("task:addToParent", 'does not exist');
	}, "No task for parent ID");
	
});

test("on destruction - removes event bindings", function() {
	equal(this.tasks.length, 1);
	this.tasks.destroy();
	this.sink.trigger("task:addToParent", "root");
	equal(this.tasks.length, 1);
});