/// <reference path="qunit.js"/>
/// <reference path="../require.js"/>
/// <reference path="../backbone.js"/>
/// <reference path="../app/constants.js"/>
/// <reference path="../jquery-1.8.2.js"/>
/// <reference path="sinon-1.4.2.js"/>
/// <reference path="testUtilities.js"/>


module("localDal (local data access layer) Tests");

amdTest("getLastSyncTime | last sync time = 1900-01-01 | returns 1900-01-01",
	1,
	['localDal'],
	function(localDal) {
		localStorage.setItem("lastSyncTime", new Date(1900, 1, 1).getTime());
		var lastSyncTime = localDal.getLastSyncTime();
		equal(lastSyncTime, new Date(1900, 1, 1).getTime());
	}
);

amdTest("setLastSyncTime | new sync time = UTC now | sets UTC now",
	1,
	['localDal'],
	function (localDal) {
		var newLastSyncTime = new Date().getTime();
		localDal.setLastSyncTime(newLastSyncTime);
		var storedLastSyncTime = localStorage.getItem("lastSyncTime");
		equal(storedLastSyncTime, newLastSyncTime);
	}
);

amdTest("setLastSyncTime | new sync time = 'Quack' | throws error",
	1,
	['localDal'],
	function (localDal) {
		var newLastSyncTime = 'Quack';
		testUtilities.expectException(function() {
			localDal.setLastSyncTime(newLastSyncTime);
		}, "localDal.setLastSyncTime must receive a number representing a date in UTC");
	}
);

amdTest("setLastSyncTime | new sync time = Date | throws error",
	1,
	['localDal'],
	function (localDal) {
		var newLastSyncTime = new Date();
		testUtilities.expectException(function () {
			localDal.setLastSyncTime(newLastSyncTime);
		}, "localDal.setLastSyncTime must receive a number representing a date in UTC");
	}
);

amdTest("clientHasData | client has no data | false",
	1,
	['localDal'],
	function (localDal) {
		localStorage.clear();
		equal(localDal.clientHasData("task"), false);
	}
);

amdTest("clientHasData | client has data | true",
	1,
	['localDal'],
	function (localDal) {
		localStorage.clear();
		localStorage.setItem("task", "some test value");
		equal(localDal.clientHasData("task"), true);
	}
);

amdTest("clientHasUnsyncedTransactions | client has unsynched transactions | true",
	1,
	['localDal'],
	function (localDal) {
		localStorage.clear();
		var transactionId = new Date().getTime();
		localStorage.setItem("transactionIndex", transactionId);
		
		equal(localDal.clientHasUnsyncedTransactions(), true);
	}
);

amdTest("clientHasUnsyncedTransactions | client has no data | false",
	1,
	['localDal'],
	function (localDal) {
		localStorage.clear();
		equal(localDal.clientHasUnsyncedTransactions(), false);
	}
);

amdTest("sync | given valid model | sets model 'lastPersisted' property",
	1,
	["localDal"],
	function (localDal) {
		var model = {
			set: sinon.spy(),
			localStorage: {},
			typeName: 'task'
		};
		localDal.sync("insert", model, { success: sinon.spy() });
		var spyCall = model.set.getCall(0);
		ok(spyCall.args[1] < AppConstants.EndOfTime);
	},
	{
		backbone: sinon.stub(Backbone),
		backboneLocalStorage: sinon.spy()
	}
);

amdTest("registerModelTypeForReplication | change existing model | change added to changeCache of model",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		model.set("title", "some new title");
		equal(model.changeCache.title, "some new title");
	}
);

amdTest("registerModelTypeForReplication | changes already synced | no change in changeCache of model",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localDal.registerModelTypeForReplication(taskType,"task");
		var model = new taskType();
		model.save();
		model.set("title", "some new title");
		model.save();
		equal(typeof model.changeCache.title, "undefined");
	}
);

amdTest("registerModelTypeForReplication | task creation saved | transaction entry has 'task' modelType",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[0]));
		equal(changeFromStorage.modelType, "task");
	}
);

amdTest("registerModelTypeForReplication | task update saved | transaction entry has 'task' modelType",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		model.set("title", "some new title");
		model.save();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[1]));
		equal(changeFromStorage.modelType, "task");
	}
);

amdTest("registerModelTypeForReplication | task creation saved | transaction entry has correct 'id' value",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[0]));
		equal(changeFromStorage.id, model.id);
	}
);

amdTest("registerModelTypeForReplication | task update saved | transaction entry has correct 'id' value",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		model.set("title", "some new title");
		model.save();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[1]));
		equal(changeFromStorage.id, model.id);
	}
);

amdTest("registerModelTypeForReplication | task delete saved | transaction entry has correct 'id' value",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		model.destroy();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[1]));
		equal(changeFromStorage.id, model.id);
	}
);

amdTest("registerModelTypeForReplication | task delete saved | transaction entry has 'task' modelType",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		model.destroy();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[1]));
		equal(changeFromStorage.modelType, "task");
	}
);

amdTest("registerModelTypeForReplication | task delete saved | transaction entry has 'delete' transactionType",
	1,
	["syncObject", "app/models/task"],
	function (localDal, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var model = new taskType();
		model.save();
		model.destroy();
		var transactions = model.localStorage.getTransactionsFromStorage();
		var changeFromStorage = JSON.parse(localStorage.getItem(transactions[1]));
		equal(changeFromStorage.transactionType, "delete");
	}
);

amdTest("insert | valid task transaction given | task transaction inserted in localStorage",
	1,
	["localDal", "app/Utilities"],
	function (localDal, utilities) {
		var expectedId = utilities.CreateGuid();
		localStorage.clear();
		var changeTransaction = {
			transactionType: "insert",
			modelType: "task",
			id: expectedId,
			changes: {
				id: expectedId,
				title: "some transaction to insert"
			}
		};
		localDal.insert(changeTransaction);

		var store = localStorage.getItem("task");
		var records = (store && store.split(",")) || [];
		
		var changeFromStorage = JSON.parse(localStorage.getItem("task-" + records[0]));
		equal(changeFromStorage.id, expectedId);
	}
);

amdTest("update | valid task transaction given | task transaction updated in localStorage",
	2,
	["localDal", "app/Utilities"],
	function (localDal, utilities) {
		var expectedId = utilities.CreateGuid();
		var expectedResultTitle = "new value after change";
		var startValue = {id: expectedId, title: "value before change"};
		var changeTransaction = {
			transactionType: "insert",
			modelType: "task",
			id: expectedId,
			changes: {id: expectedId, title: expectedResultTitle}
		};
		
		// Arrange
		localStorage.clear();
		localStorage.setItem("task-" + expectedId, JSON.stringify(startValue));
		localStorage.setItem("task", expectedId);
		
		// Act
		localDal.update(changeTransaction);

		// Assert (retrieve result of update)
		var store = localStorage.getItem("task");
		var records = (store && store.split(",")) || [];
		var changeFromStorage = JSON.parse(localStorage.getItem("task-" + records[0]));
		equal(changeFromStorage.id, expectedId);
		equal(changeFromStorage.title, expectedResultTitle);
	}
);

amdTest("delete | valid task transaction given | task deleted from localStorage",
	2,
	["localDal", "app/Utilities"],
	function (localDal, utilities) {
		var expectedId = utilities.CreateGuid();
		var startValue = { id: expectedId, title: "some title" };
		var deleteTransaction = {
			transactionType: "delete",
			modelType: "task",
			id: expectedId
		};

		// Arrange
		localStorage.clear();
		localStorage.setItem("task-" + expectedId, JSON.stringify(startValue));
		localStorage.setItem("task", expectedId);

		// Act
		localDal.delete(deleteTransaction);

		// Assert (retrieve result of update)
		var store = localStorage.getItem("task");
		var records = (store && store.split(",")) || [];
		var data = localStorage.getItem("task-" + expectedId);
		equal(data, null);
		equal(records.length, 0);
	}
);


amdTest("insertRecord | valid task record given | task record inserted in localStorage",
	1,
	["localDal", "app/Utilities"],
	function (localDal, utilities) {
		var expectedId = utilities.CreateGuid();
		localStorage.clear();
		var recordToInsert = {
			modelType: "task",
			data: {
				id: expectedId,
				title: "some transaction to insert"
			}
		};
		localDal.insertRecord(recordToInsert);

		var store = localStorage.getItem("task");
		var records = (store && store.split(",")) || [];

		var changeFromStorage = JSON.parse(localStorage.getItem("task-" + records[0]));
		equal(changeFromStorage.id, expectedId);
	}
);