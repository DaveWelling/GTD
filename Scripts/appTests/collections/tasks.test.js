/// <reference path="~/Scripts/require.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../jasmine/jasmine.js"/>
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define(['app/vent','app/collections/tasks'], function (vent, tasksType) {
	describe("Tasks Collection Tests", function () {
		it("on task:addToParent event - adds a new task to collection", function () {
			var tasks = new tasksType();
			expect(tasks.length).toEqual(0);
			vent.trigger("task:addToParent");
			expect(tasks.length).toEqual(1);
		});
		it("on task:addToParent event - adds a new task Id to parent's child collection", function () {
		});
		it("on task:addToParent event - triggers task:created event", function () {
			// TODO : Code reaction tests to this event in various other objects
		});
	});
});