/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>

module("Google Sync Tests");

amdTest("tasks.fetch | not logged in | requests a login",
    1,
    ['app/collections/tasks', 'app/googleSync/googleSync', 'app/models/task'],
    function (tasksType, googleSync, taskType) {
        stop(2000);
        tasksType.prototype.sync = googleSync;
        tasksType.prototype.sync = googleSync;
        tasksType.prototype.model = taskType;
        var tasks = new tasksType();
        tasks.fetch({
            success: function(collection, response, options) {
                start();
            },
            error: function(collection, response, options) {
                ok(true, "expecting an error");
                start();
            }
        });
    }
);


amdTest("sync | given valid task saved | returns task in new collection",
	1,
	["app/collections/tasks", "app/utilities", "app/googleSync/googleSync", 'app/models/task'],
	function (TasksType, utilities, googleSync, TaskType) {
	    stop(2000);
	    TaskType.prototype.sync = googleSync;
	    TasksType.prototype.sync = googleSync;
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