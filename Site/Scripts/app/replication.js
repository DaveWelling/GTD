/// <reference path="../require.js"/>
/// <reference path="../app/constants.js"/>
/// <reference path="../gapiDriveClient.js"/>
/// <reference path="../jquery-1.8.2.js"/>
/// <reference path="../underscore.js"/>
/// <reference path="../backbone.js"/>

define(["replicationDal", "localDal"], function (replicationDal, localDal) {
	var that = this;
	this.mergeTransactionsSinceLastSync = function (lastSyncTime) {
		//var serverTransactionsToMerge = replicationDal.getTransactionsSinceLastSync(lastSyncTime);
		//var 
	};

	this.replayTransactions = function(transactions) {
		transactions.forEach(function(transaction) {
			switch (transaction.transactionType) {
				case "update":
					localDal.update(transaction);
					break;
				case "insert":
					localDal.insert(transaction);
					break;
				case "delete":
					localDal.delete(transaction);
					break;
				default:
					throw new Error("unexpected transaction type: " + transaction.transactionType);
			}
		});
	};
	
	this.insertAllCurrentServerDataToLocalStorage = function() {
		var allData = replicationDal.fetchAllCurrentData();
		_.each(allData, function(serverRecord) {
			localDal.insertRecord(serverRecord);
		}, that);
	};
	
	this.sync = function () {
		var lastSyncTime = localDal.getLastSyncTime();
		var newSyncTime = new Date().getTime();
		
		if (!localDal.clientHasData()) {
			// Client has no data - just get all current records
			that.insertAllCurrentServerDataToLocalStorage();
		} else if (!localDal.clientHasUnsyncedTransactions()) {
			// Client has data, but no unsyncedTransactions
			// - get all transactions from server
			var recordsChanged = replicationDal.getTransactionsSinceLastSync(lastSyncTime);
			that.replayTransactions(recordsChanged);

		} else {
			// TODO: Change this to do the merging in this module
			that.mergeTransactionsSinceLastSync(lastSyncTime);
			
			// TODO: Does this also needs to send transactions changed as a result
			// of receiving new historical transactions???
			replicationDal.sendNewLocalTransactionsToServer();
			replicationDal.sendLocalChangedRecordsToServer();
		};
		localDal.setLastSyncTime(newSyncTime);
	};
	return this;
});