﻿/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../gapiDriveClient.js"/>
/// <reference path="../../jquery-1.8.2.js"/>

// TODO: Convert local time to UTC before saving
// TODO: Convert server time to local before passing to model
define(["app/googleSync/loadAndAuthorize"], function (requestDeferred) {
	// deferreds returned by asynchronous methods;
	var listDeferred;
	var getDeferred;
	var deleteDeferred;
	var insertDeferred;
	var updateDeferred;

	var getFileIdForTask = function(task) {
		if ($.isEmptyObject(task.attributes)) {
			throw new Error("No attributes defined for task");
		}
		if ($.isEmptyObject(task.attributes.alternateIds)) {
			throw new Error("No alternateIds defined for task");
		}
		if ($.isEmptyObject(task.attributes.alternateIds.gApiId)) {
			throw new Error("No google api id defined for task");
		}
		return task.attributes.alternateIds.gApiId;
	};

	// initiate asynchronous methods
	var beginList = function (task) {
		fileId = getFileIdForTask(task);
		listDeferred = $.Deferred();
		var request = gapi.client.drive.properties.list({
			'fileId': fileId
		});
		request.execute(function (gApiResponse) {
			endList(gApiResponse);
		});
		return listDeferred;
	};
	var beginGet = function (task, key) {
		fileId = getFileIdForTask(task);
		getDeferred = $.Deferred();
		var request = gapi.client.drive.properties.get({
			'fileId': fileId,
			'propertyKey': key,
			'visibility': 'PUBLIC'
		});
		request.execute(function (gApiResponse) {
			endGet(gApiResponse);
		});
		return getDeferred;
	};
	var beginDelete = function (task, key) {
		fileId = getFileIdForTask(task);
		deleteDeferred = $.Deferred();
		var request = gapi.client.drive.properties.delete({
			'fileId': fileId,
			'propertyKey': key,
			'visibility': 'PUBLIC'
		});
		request.execute(function (gApiResponse) {
			endDelete(gApiResponse);
		});
		return deleteDeferred;
	};
	var beginInsert = function (task, key, value) {
		fileId = getFileIdForTask(task);
		insertDeferred = $.Deferred();
		var body = {
			'key': key,
			'value': value,
			'visibility': 'PUBLIC'
		};
		var request = gapi.client.drive.properties.insert({
			'fileId': fileId,
			'resource': body
		});
		request.execute(endInsert);
		return insertDeferred;
	};
	var beginUpdate = function (task, key, newValue) {
		fileId = getFileIdForTask(task);
		updateDeferred = $.Deferred();
		var body = { 'value': newValue };
		var request = gapi.client.drive.properties.patch({
			'fileId': fileId,
			'propertyKey': key,
			'visibility': 'PUBLIC',
			'resource': body
		});
		
		request.execute(endUpdate);
		return updateDeferred;
	};

	// callbacks for asynchronous methods

	function endList(gApiResponse) {
		if (typeof gApiResponse.items === 'undefined') {
			listDeferred.reject(gApiResponse);
		} else {
			listDeferred.resolve(gApiResponse);
		}
	};
	function endGet(gApiResponse) {
		if (typeof gApiResponse === 'undefined') {
			getDeferred.reject(gApiResponse);
		} else {
			getDeferred.resolve(gApiResponse);
		};
	};
	function endDelete(gApiResponse) {
		if ($.isEmptyObject(gApiResponse.result)) {
			deleteDeferred.resolve(gApiResponse);
		} else {
			deleteDeferred.reject(gApiResponse);
		}
	};
	function endInsert(gApiResponse) {
		if (typeof gApiResponse === 'undefined') {
			insertDeferred.reject(gApiResponse);
		} else {
			insertDeferred.resolve(gApiResponse);
		}
	};
	function endUpdate(gApiResponse) {
		if (!gApiResponse.error) {
			updateDeferred.resolve(gApiResponse);
		} else {
			updateDeferred.reject(gApiResponse);
		}
	};

	
	function innerSyncProperties(task) {
		// private sync methods
		function determineNewProperties(items, task) {
			var newProperties = [];

			return newProperties;
		}
		var determineChangedProperties = function (currentList, task) { throw new Error("Not implemented"); };
		var determineDeletedProperties = function (currentList, task) { throw new Error("Not implemented"); };

		function saveNewProperties(newProperties) {
			throw new Error("Not implemented");
		}
		var saveChangedProperties = function (changedProperties) { throw new Error("Not implemented"); };
		var saveDeletedProperties = function (deletedProperties) { throw new Error("Not implemented"); };

		// TODO: Handle brand new task (or just no properties)
		listDeferred = beginList(task.attributes.alternateIds.gApiId);
		var currentList;
		var newPropertiesDeferred = listDeferred.then(function (gApiResponse) {
			currentList = gApiResponse.items;
			var newProperties = determineNewProperties(currentList, task);
			return saveNewProperties(newProperties);
		});
		var changedPropertiesDeferred = newPropertiesDeferred.then(function(gApiResponse) {
			var changedProperties = determineChangedProperties(currentList, task);
			return saveChangedProperties(changedProperties);
		});
		var deletePropertiesDeferred = changedPropertiesDeferred.then(function(gApiResponse) {
			var deletedProperties = determineDeletedProperties(currentList, task);
			return saveDeletedProperties(deletedProperties);
		});
	};

	return function propertiesDal(task) {
		// create instance methods for testing
		// just construct (i.e. "new up") this function to use these:
		this.list = beginList;
		this.get = beginGet;
		this.delete = beginDelete;
		this.insert = beginInsert;
		this.update = beginUpdate;

		if (!$.isEmptyObject(task)) {
			return innerSyncProperties(task);
		}
	};
});