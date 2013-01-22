/// <reference path="../../require.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../jasmine/jasmine.js"/>
/// <reference path="../../app/Utilities.js"/>

if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define(['app/eventSink', 'app/models/task', 'app/collections/tasks']
	, function (sink, taskType, tasksType) {
		describe("Tasks Collection Tests", function () {
			var tasks;
			beforeEach(function() {
				tasks = new tasksType();
			});
			afterEach(function() {
				tasks.destroy();
			});
			it("on task:addToParent event - where parent does not exist - exception", function () {
				expect( function() {
					sink.trigger("task:addToParent", 'does not exist');
				}).toThrow();
			});
			it("on destruction - removes event bindings", function () {
				expect(tasks.length).toEqual(1);
				tasks.destroy();
				sink.trigger("task:addToParent", "root");
				expect(tasks.length).toEqual(1);
			});
			it("during construction - creates a root task", function () {
				expect(tasks.root).toBeDefined();
				expect(tasks.length).toEqual(1);
			});
			it("on task:addToParent event - adds a new task to collection", function () {
				expect(tasks.length).toEqual(1);
				sink.trigger("task:addToParent", "root");
				expect(tasks.length).toEqual(2);
			});
			it("on task:addToParent event - adds a new task Id to parent's child collection", function () {
				var parentTask = new taskType();
				tasks.add(parentTask);
				sink.trigger("task:addToParent", parentTask.id);
				expect(parentTask.get("children").length).toEqual(1);
			});
			it("on task:addToParent event - with 'root' parent - adds new task id to root", function () {
				var parentTask = tasks.root;

				var rootChildren = parentTask.get("children");
				var expectedLength = rootChildren.length + 1;

				sink.trigger("task:addToParent", 'root');
				expect(parentTask.get("children").length).toEqual(expectedLength);
			});
			it("on task:addToParent event - triggers task:created event", function () {
				// TODO : Code reaction tests to this event in various other objects
			});
		});
	});