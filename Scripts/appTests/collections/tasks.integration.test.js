/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Tasks Collection Integration Tests", {
	setup: function () {
		var that = this;
	}
});



amdTest("sync | given valid task saved | returns task in new collection",
	1,
	["app/collections/tasks","app/utilities"],
	function (TasksType, utilities) {
		stop(2000);
		var tasks = new TasksType();
		var uniqueId = utilities.CreateGuid();
		tasks.on('sync', function (model, resp, options) {
			var result = new TasksType();
			result.fetch({success: function(model2, resp2, options2) {
				var task = result.get(uniqueId);
				equal(task.id, uniqueId);
				start();
			}});
		});
		tasks.create({ id: uniqueId, title: "sync | given valid task saved | returns task in new collection" });
	}
);