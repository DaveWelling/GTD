/// <reference path="../qunit.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../app/Utilities.js"/>

// TODO: figure out how propertiesSync tests work with replicationUpdateQueue test
module("Google Sync Properties Tests", {
	setup: function () {
		this.createTaskStub = function (id, taskType) {
			return new taskType({ id: id, title: "Task title " + id, description: "Task description " + id });
		};
		this.getSavedTestTask = function (taskId, createTask, taskType) {
			var taskStub = this.createTaskStub(taskId, taskType);
			var createTaskPromise = createTask(taskStub);
			createTaskPromise.fail(function (gApiResponse) {
				throw new Error("The task creation failed for some reason. " + gApiResponse.status);
			});
			return createTaskPromise;
		};
	}
});

amdTest("getTaskPropertiesNotOnServer | one new task property | new task property returned",
	1,
	['app/googleSync/propertiesSync', 'app/models/task'],
	function (propertiesSync, taskType) {
		var properties = new propertiesSync();
		var task = this.createTaskStub("someId", taskType);
		task.attributes.someNewProperty = "someNewValue";
		var items = [
			{
				key: "id",
				value: "someId"
			},
			{
				key: "title",
				value: "Task title someId"
			},
			{
				key: "description",
				value: "Task description someId"
			},
			{
				key: "children",
				value: ["blah","blah1"]
			},
			{
				key: "status",
				value: "Complete"
			},
			{
				key: "when",
				value: "Soon"
			},
			{
				key: "where",
				value: "Work"
			},
			{
				key: "lastPersisted",
				value: AppConstants.EndOfTime
			}
		];
		var changes = properties.getTaskPropertiesNotOnServer(items, task);
		equal(changes[0], "someNewProperty");
	}
);

amdTest("addNewPropertiesFromServerToTask | one new saved property | new saved property added to task",
	1,
	['app/googleSync/propertiesSync', 'app/models/task'],
	function (propertiesSync, taskType) {
		var properties = new propertiesSync();
		var task = this.createTaskStub("someId", taskType);
		var items = [
			{
				key: "id",
				value: "someId"
			},
			{
				key: "title",
				value: "Task title someId"
			},
			{
				key: "description",
				value: "Task description someId"
			},
			{
				key: "new saved property",
				value: "new saved property value"
			}
		];
		properties.addNewPropertiesFromServerToTask(items, task);
		equal(task.attributes["new saved property"], "new saved property value");
	}
);

var propertiesSyncTestInserts = [];
amdTest("saveNewTaskPropertiesToServer | new property | DAL insert called",
	1,
	['app/googleSync/propertiesSync'],
	function (propertiesSync) {
		var properties = new propertiesSync();
		var mockTask = {
			attributes: {
				alternateIds: {
					gApiId: "whatever"
				},
				someNewProperty: "someNewValue"
			}
		};
		var newProperties = ["someNewProperty"];
		var saveDeferred = properties.saveNewTaskPropertiesToServer(mockTask, newProperties);
		saveDeferred.done(function () {
			equal(propertiesSyncTestInserts[0][1], "someNewProperty");
		});
	},
	{ // Mock out DAL
		"app/googleSync/propertiesDal": function () {
			this.insert = function(task, key, value) {
				propertiesSyncTestInserts.push([task, key, value]);
				var deferred = $.Deferred();
				deferred.resolve();
				return deferred;
			};
		}
	}
);

amdTest("propertiesSync | new property | new property added",
	1,
	['app/googleSync/createTask', 'app/utilities', 'app/googleSync/propertiesSync', 'app/googleSync/propertiesDal', 'app/models/task'],
	function (createTask, utilities, propertiesSync, propertiesDalType, taskType) {
		stop(5000);
		// Arrange
		var expectedNewValue = "someNewValue";
		var taskId = utilities.CreateGuid();
		var propertiesDal = new propertiesDalType();
		var fileId;
		var holdTask;
		var taskCreateDeferred = this.getSavedTestTask(taskId, createTask, taskType);

		// Act
		var syncDeferred = taskCreateDeferred.then(function (gApiResponse, task) {
			fileId = gApiResponse.id;
			task.set("someNewProperty", expectedNewValue);
			holdTask = task;
			return propertiesSync(task);
		});

		// Assert (get changed property)
		var getDeferred = syncDeferred.then(function (syncResponse, syncedTask) {
			return propertiesDal.get(holdTask, "someNewProperty");
		});
		
		getDeferred.done(function (propertyResource) {
			equal(propertyResource.value, expectedNewValue);
			start();
		});
		
		getDeferred.fail(function (jsonResponse, rawResponse) {
			ok(false, "failure: " + rawResponse);
		});

	}
);