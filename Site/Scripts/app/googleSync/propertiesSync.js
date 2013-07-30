/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../../backbone.js"/>

// TODO:  See about making this DAL agnostic
// pass in task to DAL methods instead of FileId
define(["app/googleSync/propertiesDal"], function (propertiesDal) {

	// ReSharper disable InconsistentNaming -- class field
	var _propertiesDal = new propertiesDal();
	var _listDeferred;
	// ReSharper restore InconsistentNaming
	
	// private sync methods
	function addNewPropertiesFromServerToTask(items, task) {
		var newProperties = [];
		_.each(items, function(item) {
			if (!task.attributes.hasOwnProperty(item.key)) {
				task.set(item.key, item.value);
			}
		}, this);
	}
	
	function getTaskPropertiesNotOnServer(items, task) {
		var newProperties = [];
		var itemKeys = _.pluck(items, "key");
		for (var name in task.attributes) {
			if (task.attributes.hasOwnProperty(name)) {
				if (!_.contains(itemKeys, name)) {
					newProperties.push(name);
				}
			}
		}
		return newProperties;
	}
	
	var determineChangedProperties = function (currentList, task) { throw new Error("Not implemented"); };
	var determineDeletedProperties = function (currentList, task) { throw new Error("Not implemented"); };

	function saveNewTaskPropertiesToServer(task, newProperties) {
		var insertDeferreds = [];
		_.each(newProperties, function(propertyName) {
			insertDeferreds.push(_propertiesDal.insert(task, propertyName, task.attributes[propertyName]));
		});
		return $.when(insertDeferreds);
	}
	
	var saveChangedProperties = function (changedProperties) { throw new Error("Not implemented"); };
	var saveDeletedProperties = function (deletedProperties) { throw new Error("Not implemented"); };

	function innerSyncProperties(task) {

		// TODO: Handle brand new task (or just no properties)
		_listDeferred = _propertiesDal.list(task);
		var currentList;
		
		// Chain the new, change and delete operations using "then"
		var syncDeferred = _listDeferred.then(function (listResponse) {
			currentList = listResponse.items;

			// New properties
			addNewPropertiesFromServerToTask(currentList, task);
			var newProperties = getTaskPropertiesNotOnServer(currentList, task);
			var saveNewDeferred = saveNewTaskPropertiesToServer(task, newProperties);
			
			// Changed properties
			var changedPropertiesDeferred = saveNewDeferred.then(function (gApiResponse) {
				var changedProperties = determineChangedProperties(currentList, task);
				return saveChangedProperties(changedProperties);
			});
		
			// Deleted properties
			var deletePropertiesDeferred = changedPropertiesDeferred.then(function (gApiResponse) {
				var deletedProperties = determineDeletedProperties(currentList, task);
				return saveDeletedProperties(deletedProperties);
			});

			return deletePropertiesDeferred;

		});
		return syncDeferred;
	};

	return function propertiesSync(task) {
		// create instance methods for testing
		// just construct (i.e. "new up") this function to use these:
		this.getTaskPropertiesNotOnServer = getTaskPropertiesNotOnServer;
		this.addNewPropertiesFromServerToTask = addNewPropertiesFromServerToTask;
		this.saveNewTaskPropertiesToServer = saveNewTaskPropertiesToServer;
		
		if (!$.isEmptyObject(task)) {
			return innerSyncProperties(task);
		}
	};
});