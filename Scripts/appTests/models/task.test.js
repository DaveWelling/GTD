/// <reference path="../../jasmine/jasmine.js"/>
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define(['app/models/task', 'app/utilities'], function (taskType, utilities) {
	describe("Task Model Tests", function () {
		it("does not retain attributes from previous incarnations", function () {
			var id = utilities.Guid();
			var task1 = new taskType();
			task1.set("description", "expected description");
			task1.set("children", [id]);
			var task2 = new taskType();
			expect(task2.get("description")).toNotEqual("expected description");
			expect(task2.get("children").length).toEqual(0);
		});
	});
});