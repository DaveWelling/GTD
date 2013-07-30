/// <reference path="qunit.js"/>
/// <reference path="../require.js"/>
/// <reference path="../backbone.js"/>
/// <reference path="../app/constants.js"/>
/// <reference path="../jquery-1.8.2.js"/>
/// <reference path="sinon-1.4.2.js"/>
/// <reference path="testUtilities.js"/>
/// <reference path="../app/Utilities.js"/>


// Create a test namespace for this module
testUtilities.namespace("testUtilities.replication");
// Define mock objects here so they may be passed into the amdTest functions
testUtilities.replication.replicationDal = {};
testUtilities.replication.localDal = {
	getLastSyncTime: function () { return new Date(); },
	setLastSyncTime: sinon.spy(),
	insertRecord: sinon.spy()
};

module("Replication Tests", {
	setup: function () {
		this.createTaskStub = function (id, taskType) {
			return new taskType({ id: id, title: "Task title " + id, description: "Task description " + id });
		};
		testUtilities.replication.replicationDal.fetchAllCurrentData = sinon.spy();
		testUtilities.replication.replicationDal.getTransactionsSinceLastSync = sinon.spy();
		testUtilities.replication.replicationDal.mergeTransactionsSinceLastSync = sinon.spy();
		testUtilities.replication.replicationDal.sendNewLocalTransactionsToServer = sinon.spy();
		testUtilities.replication.replicationDal.sendLocalChangedRecordsToServer = sinon.spy();
	}
});

amdTest("sync | valid sync context | localDal.setLastSyncTime called",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.setLastSyncTime = sinon.spy();
		testUtilities.replication.localDal.clientHasData = function () { return false; };
		replication.sync();
		equal(testUtilities.replication.localDal.setLastSyncTime.callCount, 1);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("sync | client has no data | request all current values",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.clientHasData = function () { return false; };
		replication.sync();
		ok(testUtilities.replication.replicationDal.fetchAllCurrentData.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("sync | client has data, but no unsynced transactions | request server values changed since last sync",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.clientHasData = function () { return true; };
		testUtilities.replication.localDal.clientHasUnsyncedTransactions = function () { return false; };
		replication.replayTransactions = sinon.spy();
		replication.sync();
		ok(testUtilities.replication.replicationDal.getTransactionsSinceLastSync.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("sync | client has data, but no unsynced transactions | replays server transactions",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.clientHasData = function () { return true; };
		testUtilities.replication.localDal.clientHasUnsyncedTransactions = function () { return false; };
		replication.replayTransactions = sinon.spy();
		replication.sync();
		ok(replication.replayTransactions.calledOnce, "should replay transactions");
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("sync | client has data and unsynced transactions | replicationDal.getTransactionsSinceLastSync",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.clientHasData = function () { return true; };
		testUtilities.replication.localDal.clientHasUnsyncedTransactions = function () { return true; };
		replication.sync();
		ok(testUtilities.replication.replicationDal.getTransactionsSinceLastSync.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("sync | client has data and unsynced transactions | replicationDal.sendNewLocalTransactionsToServer",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.clientHasData = function () { return true; };
		testUtilities.replication.localDal.clientHasUnsyncedTransactions = function () { return true; };
		
		replication.sync();
		ok(testUtilities.replication.replicationDal.sendNewLocalTransactionsToServer.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);


amdTest("sync | client has data and unsynced transactions | replicationDal.sendLocalChangedRecordsToServer",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.clientHasData = function () { return true; };
		testUtilities.replication.localDal.clientHasUnsyncedTransactions = function () { return true; };

		replication.sync();
		ok(testUtilities.replication.replicationDal.sendLocalChangedRecordsToServer.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);


amdTest("replayTransactions | 1 task update transaction from server | task update locally ",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.update = sinon.spy();
		var changeTransaction = [{transactionType: "update"}];
		replication.replayTransactions(changeTransaction);
		ok(testUtilities.replication.localDal.update.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("replayTransactions | 1 task insert transaction from server | task created locally ",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.insert = sinon.spy();
		var changeTransaction = [{ transactionType: "insert" }];
		replication.replayTransactions(changeTransaction);
		ok(testUtilities.replication.localDal.insert.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("replayTransactions | 1 task delete transaction from server | task deleted locally ",
	1,
	['app/replication'],
	function (replication) {
		testUtilities.replication.localDal.delete = sinon.spy();
		var changeTransaction = [{ transactionType: "delete" }];
		replication.replayTransactions(changeTransaction);
		ok(testUtilities.replication.localDal.delete.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);

amdTest("insertAllCurrentServerDataToLocalStorage | 1 server task | 1 task inserted locally ",
	2,
	['app/replication', 'app/Utilities'],
	function (replication, utilities) {	
		var serverRecord = [{ typeName: "task", data: {
			id: utilities.CreateGuid(),
			title: 'Some test title'
		} }];
		var stub = sinon.stub();
		stub.returns(serverRecord);
		testUtilities.replication.replicationDal.fetchAllCurrentData = stub;
		testUtilities.replication.localDal.insertRecord = sinon.spy();
		
		replication.insertAllCurrentServerDataToLocalStorage();
		ok(testUtilities.replication.localDal.insertRecord.calledOnce);
		ok(testUtilities.replication.replicationDal.fetchAllCurrentData.calledOnce);
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);
amdTest("insertAllCurrentServerDataToLocalStorage | 2 server tasks | 2 tasks inserted locally ",
	2,
	['app/replication', 'app/Utilities'],
	function (replication, utilities) {
		var serverRecord = [{
			typeName: "task", data: {
				id: utilities.CreateGuid(),
				title: 'Some test title 1'
			}
		},
		{
			typeName: "task", data: {
				id: utilities.CreateGuid(),
				title: 'Some test title 2'
			}
		}];
		var stub = sinon.stub();
		stub.returns(serverRecord);
		testUtilities.replication.replicationDal.fetchAllCurrentData = stub;
		testUtilities.replication.localDal.insertRecord = sinon.spy();

		replication.insertAllCurrentServerDataToLocalStorage();
		equal(testUtilities.replication.localDal.insertRecord.callCount, 2, "Expected 2 localDal.insertRecord calls.");
		equal(testUtilities.replication.replicationDal.fetchAllCurrentData.callCount, 1, "Expected 1 replication dal call.");
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);


amdTest("mergeTransactionsSinceLastSync | 2 server transactions, 2 local transactions | 2 tasks inserted locally ",
	2,
	['app/replication', 'app/Utilities'],
	function (replication, utilities) {
		var serverRecord = [{
			typeName: "task", data: {
				id: utilities.CreateGuid(),
				title: 'Some test title 1'
			}
		},
		{
			typeName: "task", data: {
				id: utilities.CreateGuid(),
				title: 'Some test title 2'
			}
		}];
		var stub = sinon.stub();
		stub.returns(serverRecord);
		testUtilities.replication.replicationDal.fetchAllCurrentData = stub;
		testUtilities.replication.localDal.insertRecord = sinon.spy();

		replication.insertAllCurrentServerDataToLocalStorage();
		equal(testUtilities.replication.localDal.insertRecord.callCount, 2, "Expected 2 localDal.insertRecord calls.");
		equal(testUtilities.replication.replicationDal.fetchAllCurrentData.callCount, 1, "Expected 1 replication dal call.");
	},
	{
		'replicationDal': testUtilities.replication.replicationDal,
		'localDal': testUtilities.replication.localDal
	}
);