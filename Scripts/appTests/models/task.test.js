/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>

module("Task Model Tests", {
	setup: function () {
		stop();
		var that = this;
		require(['app/models/task', 'app/utilities'], function (taskType, appUtilities) {
			that.TaskType = taskType;
			that.task = new taskType();
			that.appUtilities = appUtilities;
			start();
		});
	},
	teardown: function () {
		this.task.destroy();
	}
});

test("does not retain attributes from previous incarnations", function () {
	var that = this;
	var id = that.appUtilities.CreateGuid();
	var task1 = that.task;
	task1.set("description", "expected description");
	task1.set("children", [id]);
	var task2 = new that.TaskType();
	notEqual(task2.get("description"),"expected description");
	equal(task2.get("children").length, 0);
});
