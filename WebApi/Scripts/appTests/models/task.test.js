/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../createContext.js"/>

module("Task Model Tests", {
	setup: function () {
		var that = this;
		this.ctxt = new CreateContext({});
		this.asyncShell = function (numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			this.ctxt(['app/models/task', 'app/utilities', 'backbone-localStorage'], function (taskType, appUtilities) {
				try {
					testFunction = _.bind(testFunction, that);
					testFunction(taskType, appUtilities);
				} catch (e) {
					throw e;
				}
				start();
			});
		};
	}
});

test("does not retain attributes from previous incarnations", function () {
	this.asyncShell(2, function (taskType, appUtilities) {
		var id = appUtilities.CreateGuid();
		var task1 = new taskType();
		task1.set("description", "expected description");
		task1.set("children", [id]);
		var task2 = new taskType();
		notEqual(task2.get("description"), "expected description");
		equal(task2.get("children").length, 0);
	});
});
