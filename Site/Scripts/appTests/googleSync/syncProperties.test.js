/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../app/Utilities.js"/>

module("Google Sync Properties Tests", {
	setup: function () {
		this.createTaskStub = function(id) {
			return {
				id: id,
				attributes: {
					id: id,
					title: "Task title " + id,
					description: "Task description " + id
				}
			};
		};
		this.getSavedTestTask = function(taskId, createTask) {
			var taskStub = this.createTaskStub(taskId);
			var createTaskPromise = createTask(taskStub);
			createTaskPromise.fail(function(gApiResponse) {
				throw new Error("The task creation failed for some reason. " + gApiResponse.status);
			});
			return createTaskPromise;
		};
	}
});



amdTest("list | properties do not exist | returns undefined property item list",
    1,
    ['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
    function (createTask, utilities, syncProperties) {
    	stop(5000);
    	var taskId = utilities.CreateGuid();
    	var taskCreatePromise = this.getSavedTestTask(taskId, createTask);
	    taskCreatePromise.done(function(gApiResponse) {
	    	var properties = new syncProperties();
	    	var promise = properties.list(gApiResponse.id);
	    	promise.fail(function (response) {
	    		equal(typeof response.code, 'undefined');
	    		start();
	    	});
	    	promise.done(function () {
	    		ok(false, "expecting failure");
	    		start();
	    	});
	    });
    });

amdTest("insert | new property | returns property with key ",
    2,
    ['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
    function (createTask, utilities, syncProperties) {
    	stop(5000);
    	var taskId = utilities.CreateGuid();
    	var taskCreatePromise = this.getSavedTestTask(taskId, createTask);
    	taskCreatePromise.done(function (gApiResponse) {
    		var properties = new syncProperties();
    		var promise = properties.insert(gApiResponse.id, "testKey", "testValue");
    		promise.fail(function () {
    			ok(false, "Insert should not fail");
    			start();
    		});
    		promise.done(function (newPropertyResource) {
    			equal(newPropertyResource.key, "testKey");
    			equal(newPropertyResource.value, "testValue");
    			start();
    		});
    	});
    });

amdTest("get | property exists | returns property with key ",
    2,
    ['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
    function (createTask, utilities, syncProperties) {
    	stop(5000);
    	var taskId = utilities.CreateGuid();
    	var properties = new syncProperties();
	    var fileId;
    	var taskCreatePromise = this.getSavedTestTask(taskId, createTask);
    	var propertyInsertPromise = taskCreatePromise.then(
    		function (insertResponse) {
    			fileId = insertResponse.id;
    			return properties.insert(insertResponse.id, "testKey", "testValue")
    		});
	    propertyInsertPromise.done(function (gApiResponse) {
    		var promise = properties.get(fileId, "testKey");
    		promise.fail(function () {
    			ok(false, "get should not fail");
    			start();
    		});
    		promise.done(function (newPropertyResource) {
    			equal(newPropertyResource.key, "testKey");
    			equal(newPropertyResource.value, "testValue");
    			start();
    		});
    	});
    });



amdTest("delete | property exists | returns empty body",
    1,
    ['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
    function (createTask, utilities, syncProperties) {
    	stop(5000);
    	var taskId = utilities.CreateGuid();
    	var properties = new syncProperties();
    	var fileId;
    	var taskCreatePromise = this.getSavedTestTask(taskId, createTask);
    	var propertyInsertPromise = taskCreatePromise.then(
    		function (insertResponse) {
    			fileId = insertResponse.id;
    			return properties.insert(insertResponse.id, "testKey", "testValue")
    		});
    	propertyInsertPromise.done(function (gApiResponse) {
    		var promise = properties.delete(fileId, "testKey");
    		promise.fail(function () {
    			ok(false, "delete should not fail");
    			start();
    		});
    		promise.done(function (gApiResponse) {
    			ok($.isEmptyObject(gApiResponse.result));
    			start();
    		});
    	});
    });


amdTest("update | property exists | updated property returned",
    2,
    ['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
    function (createTask, utilities, syncProperties) {
    	stop(5000);
    	var taskId = utilities.CreateGuid();
    	var properties = new syncProperties();
    	var fileId;
    	var taskCreatePromise = this.getSavedTestTask(taskId, createTask);
    	var propertyInsertPromise = taskCreatePromise.then(
    		function (insertResponse) {
    			fileId = insertResponse.id;
    			return properties.insert(insertResponse.id, "testKey", "testValue")
    		});
    	propertyInsertPromise.done(function (gApiResponse) {
    		var promise = properties.update(fileId, "testKey", 'updated value');
    		promise.fail(function () {
    			ok(false, "update should not fail");
    			start();
    		});
    		promise.done(function (newPropertyResource) {
    			equal(newPropertyResource.key, "testKey");
    			equal(newPropertyResource.value, "updated value");
    			start();
    		});
    	});
    });

amdTest("list | property exists | property returned",
    2,
    ['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
    function (createTask, utilities, syncProperties) {
    	stop(5000);
    	var taskId = utilities.CreateGuid();
    	var properties = new syncProperties();
    	var fileId;
    	var taskCreatePromise = this.getSavedTestTask(taskId, createTask);
    	var propertyInsertPromise = taskCreatePromise.then(
    		function (insertResponse) {
    			fileId = insertResponse.id;
    			return properties.insert(insertResponse.id, "testKey", "testValue")
    		});
    	propertyInsertPromise.done(function (gApiResponse) {
    		var promise = properties.list(fileId);
    		promise.fail(function () {
    			ok(false, "list should not fail");
    			start();
    		});
    		promise.done(function (listResponse) {
    			ok(!$.isEmptyObject(listResponse.items), "Items exist");
    			equal(listResponse.items[0].value, "testValue");
    			start();
    		});
    	});
    });

amdTest("syncProperties | new property | new property added",	
	1,
	['app/googleSync/createTask', 'app/utilities', 'app/googleSync/syncProperties'],
	function(createTask, utilities, syncProperties) {
		stop(5000);
		// Arrange
		var expectedNewValue = "someNewValue";
		var taskId = utilities.CreateGuid();
		var properties = new syncProperties();
		var fileId;
		var taskCreateDeferred = this.getSavedTestTask(taskId, createTask);
		
		// Act
		var syncDeferred = taskCreateDeferred.then(function(gApiResponse, task) {
			fileId = gApiResponse.id;
			task.attributes.someNewProperty = expectedNewValue;
			return syncProperties(task);
		});
		
		// Assert (get changed property)
		var getDeferred = syncDeferred.then(function(syncResponse, syncedTask) {
				return properties.get(fileId, "someNewProperty");
		});
		getDeferred.done(function (propertyResource) {
			equal(propertyResource.value, expectedNewValue);
			start();
		});
		getDeferred.fail(function(jsonResponse, rawResponse) {
			ok(false, "failure: " + rawResponse);
		});


	}
);