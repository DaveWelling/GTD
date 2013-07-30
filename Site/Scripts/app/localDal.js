/// <reference path="../../require.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../../backbone.js"/>

// pass in task to DAL methods instead of FileId
define(['backbone', 'backboneLocalStorage'], function (backbone) {
	return (new function () {
		this.getLastSyncTime = function() {
			return localStorage.getItem("lastSyncTime");
		};

		this.setLastSyncTime = function (newLastSyncTime) {
			if (typeof newLastSyncTime != "number") {
				throw new Error("localDal.setLastSyncTime must receive a number representing a date in UTC");
			}
			localStorage.setItem("lastSyncTime", newLastSyncTime);
		};
		
		this.clientHasData = function (dataTypeName) {
			var data = localStorage.getItem(dataTypeName);
			
			return !$.isEmptyObject(data) && data.length > 0;
		};
		
		this.clientHasUnsyncedTransactions = function () {
			var transactionIndex = localStorage.getItem("transactionIndex");
			return !$.isEmptyObject(transactionIndex) && transactionIndex.length > 0;
		};

		this.registerModelTypeForReplication = function(modelType, modelTypeName) {
			modelType.prototype.localStorage = new backbone.LocalStorage(modelTypeName);
			var holdInitialize = modelType.prototype.initialize;
			modelType.prototype.initialize = function() {
				holdInitialize.call(this, this.arguments);
				this.changeCache = {};
				this.on("change", function(changedModel) {
					for (var changedPropertyName in changedModel.changed) {
						if (changedModel.changed.hasOwnProperty(changedPropertyName) && changedPropertyName != "lastPersisted") {
							changedModel.changeCache[changedPropertyName] = changedModel.changed[changedPropertyName];
						}
					}
				});
				this.on("sync", function(model, resp, options) {
					model.changeCache = {};
				});
			};

		};

		this.sync = function (method, model, options) {
			if (method != "read") {
				model.set("lastPersisted", new Date().getTime());
			}
			return backbone.sync(method, model, options);
		};

		this.insert = function(transaction) {
			localStorage.setItem(transaction.modelType + "-" + transaction.id, JSON.stringify(transaction.changes));
			var currentRecordIndex = localStorage.getItem(transaction.modelType);
			currentRecordIndex = $.isEmptyObject(currentRecordIndex) ? transaction.id : currentRecordIndex + "," + transaction.id;
			localStorage.setItem(transaction.modelType, currentRecordIndex);
		};

		this.update = function (transaction) {
			// retrieve 
			var key = transaction.modelType + "-" + transaction.id;
			var currentRecord = JSON.parse(localStorage.getItem(key));
			// update
			for (var propertyName in transaction.changes) {
				if (propertyName != 'id' && transaction.changes.hasOwnProperty(propertyName)) {
					currentRecord[propertyName] = transaction.changes[propertyName];
				}
			}
			// save
			localStorage.setItem(key, JSON.stringify(currentRecord));
		};

		this.delete = function (transaction) {
			var key = transaction.modelType + "-" + transaction.id;
			localStorage.removeItem(key);
			var recordsString = localStorage.getItem(transaction.modelType);
			var records = (recordsString && recordsString.split(",")) || [];
			records = _.reject(records, function (recordId) { return recordId == transaction.id; });
			localStorage.setItem(transaction.modelType, records.join(","));
		};
		
		this.insertRecord = function (record) {
			localStorage.setItem(record.modelType + "-" + record.data.id, JSON.stringify(record.data));
			var currentRecordIndex = localStorage.getItem(record.modelType);
			currentRecordIndex = $.isEmptyObject(currentRecordIndex) ? record.data.id : currentRecordIndex + "," + record.data.id;
			localStorage.setItem(record.modelType, currentRecordIndex);
		};

		return this;
	}());
});