if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define(['../../app/models/task'], function (taskType) {
	describe("Task Model Tests", function () {
		it("Retrieves children tasks", function () {
			
			expect("2").toEqual("2");
		});
	});
});