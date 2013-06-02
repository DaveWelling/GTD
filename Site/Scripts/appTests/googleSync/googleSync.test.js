/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

module("Google Sync Tests");

//amdTest("tasks.fetch | not logged in | requests a login",
//    1,
//    ['app/collections/tasks', 'app/googleSync/googleSync', 'app/models/task'],
//    function (tasksType, googleSync, taskType) {
//        stop(2000);
//        tasksType.prototype.sync = googleSync;
//        tasksType.prototype.sync = googleSync;
//        tasksType.prototype.model = taskType;
//        var tasks = new tasksType();
//        tasks.fetch({
//            success: function(collection, response, options) {
//                start();
//            },
//            error: function(collection, response, options) {
//                ok(true, "expecting an error");
//                start();
//            }
//        });
//    }
//);

amdTest("deleteRoot | root does not exist | returns 404",
    1,
    ['app/googleSync/deleteTask'],
    function (deleteTask) {
        stop(2000); 
        var promise = deleteTask(AppConstants.RootId);
        promise.fail(function (response) {
            equal(response.code, 404);
            start();
        });
        promise.done(function() {
            ok(false, "expecting failure");
            start();
        });
    });

amdTest("getRoot | root does not exist | 404",
    1,
    ['app/googleSync/deleteTask', 'app/googleSync/getTask'],
    function (deleteTask, getTask) {
        stop(2000);
        var deletePromise = deleteTask(AppConstants.RootId);
        deletePromise.always(function() {
            var getPromise = getTask(AppConstants.RootId);
            getPromise.fail(function (response) {
                equal(response.code, 404);
                start();
            });
            getPromise.done(function () {
                ok(false, "expecting failure");
                start();
            });
        });
    });

amdTest("insertRoot | root does not exist | 200",
    1,
    ['app/googleSync/deleteTask', 'app/googleSync/createTask'],
    function (deleteTask, createTask) {
        stop(5000);
        var deletePromise = deleteTask(AppConstants.RootId);
        deletePromise.always(function () {
            var taskMock = {
                id: AppConstants.RootId,
                attributes: {
                    id: AppConstants.RootId,
                    title: "Tasks",
                    description: "Root node for all tasks"
                }
            };
            var getPromise = createTask(taskMock);
            getPromise.fail(function (response) {
                equal(200, response.code);
                start();
            });
            getPromise.done(function (response) {
                equal(response.title, taskMock.attributes.title);
                start();
            });
        });
    });

amdTest("insertRoot | root does not exist | gApiId assigned",
    1,
    ['app/googleSync/deleteTask', 'app/googleSync/createTask'],
    function (deleteTask, createTask) {
        stop(5000);
        var deletePromise = deleteTask(AppConstants.RootId);
        deletePromise.always(function () {
            var taskMock = {
                id: AppConstants.RootId,
                attributes: {
                    id: AppConstants.RootId,
                    title: "Tasks",
                    description: "Root node for all tasks"
                }
            };
            var getPromise = createTask(taskMock);
            getPromise.fail(function (response) {
                equal(200, response.code);
                start();
            });
            getPromise.done(function (response, task) {
                if (!$.isEmptyObject(task.attributes.alternateIds)) {
                    notEqual(typeof task.attributes.alternateIds.gApiId, "undefined");
                } else {
                    ok(false, "alternateIds property is undefined");
                }
                start();
            });
        });
    });
//amdTest("sync | given valid task saved | returns task in new collection",
//	1,
//	["app/collections/tasks", "app/utilities", "app/googleSync/googleSync", 'app/models/task'],
//	function (TasksType, utilities, googleSync, TaskType) {
//	    stop(2000);
//	    TaskType.prototype.sync = googleSync;
//	    TasksType.prototype.sync = googleSync;
//	    TasksType.prototype.model = TaskType;
//	    var tasks = new TasksType();
//	    var uniqueId = utilities.CreateGuid();

//	    tasks.on('sync', function (model, resp, options) {
//	        var result = new TasksType();
//	        result.fetch({
//	            success: function (collection, response, options1) {
//	                var task = result.get(uniqueId);
//	                equal(task.id, uniqueId);
//	                start();
//	            },
//	            error: function (collection, response, options2) {
//	                start();
//	            }
//	        });
//	    });
	    
//	    tasks.create({ id: uniqueId, title: "sync | given valid task saved | returns task in new collection" });
//	}
//);