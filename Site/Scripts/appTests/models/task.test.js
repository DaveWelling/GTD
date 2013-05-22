/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>

module("Task Model Tests");

amdTest("does not retain attributes from previous incarnations",
    2,
    ['app/models/task', 'app/utilities'],
    function (taskType, appUtilities) {
		var id = appUtilities.CreateGuid();
		var task1 = new taskType();
		task1.set("description", "expected description");
		task1.set("children", [id]);
		var task2 = new taskType();
		notEqual(task2.get("description"), "expected description");
		equal(task2.get("children").length, 0);
	}
);
