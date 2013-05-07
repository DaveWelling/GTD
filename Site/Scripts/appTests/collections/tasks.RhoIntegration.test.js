/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Tasks Collection RHO Integration Tests");

amdTest("sync | given valid task saved | returns task in new collection",
	1,
	["app/collections/tasks", "app/utilities", "app/rhoSync", 'app/models/task' ],
	function (TasksType, utilities, rhoSync, TaskType) {
	    stop(2000);
	    TaskType.prototype.sync = rhoSync;
	    TasksType.prototype.sync = rhoSync;
	    TasksType.prototype.model = TaskType;
	    var tasks = new TasksType();
	    var uniqueId = utilities.CreateGuid();
	    
		tasks.on('sync', function (model, resp, options) {
			var result = new TasksType();
			result.fetch({
			    success: function (collection, response, options1) {
			        var task = result.get(uniqueId);
			        equal(task.id, uniqueId);
			        start();
			    },
			    error: function (collection, response, options2) {
			        start();
			    }
			});
		});
		tasks.create({ id: uniqueId, title: "sync | given valid task saved | returns task in new collection" });
	}
);