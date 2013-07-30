/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Tasks Collection Integration Tests");

amdTest("sync | given valid task saved | returns task in new collection",
	1,
	["syncObject", "app/collections/tasks", "app/utilities", "app/models/task"],
	function (localDal, tasksType, utilities, taskType) {
		stop(2000);
		localDal.registerModelTypeForReplication(tasksType, "task");
	    var tasks = new tasksType();
	    var uniqueId = utilities.CreateGuid();
	    tasks.on('sync', function (model, resp, options) {
	        var result = new tasksType();
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

amdTest("create | given valid task | transaction saved to local storage",
	3,
	["syncObject", "app/collections/tasks", "app/utilities", "app/models/task"],
	function (localDal, tasksType, utilities, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var tasks = new tasksType();
		var uniqueId = utilities.CreateGuid();
		tasks.create({ id: uniqueId, title: "test create | given valid task | transaction saved to local storage" })
		var transactionIndex = localStorage.getItem("transactionIndex");
		var transactions = transactionIndex.split(",") || [];

		equal(1, transactions.length);

		var change = JSON.parse(localStorage.getItem(transactions[0]));

		equal(change.transactionType, "insert");
		equal(change.changes.id, uniqueId);
		
	}
);

amdTest("save | change task title | transaction saved to local storage",
	3,
	["syncObject", "app/collections/tasks", "app/utilities", "app/models/task"],
	function (localDal, tasksType, utilities, taskType) {
		localStorage.clear();
		localDal.registerModelTypeForReplication(taskType, "task");
		var tasks = new tasksType();
		var uniqueId = utilities.CreateGuid();
		var task = tasks.create({ id: uniqueId, title: "save | change task title | transaction saved to local storage" })
		var expectedTitle = "X" + task.get("title");
		
		task.set("title", expectedTitle);
		task.save();
		
		var transactionIndex = localStorage.getItem("transactionIndex");
		var transactions = transactionIndex.split(",") || [];

		equal(2, transactions.length);

		var change = JSON.parse(localStorage.getItem(transactions[1]));

		equal(change.transactionType, "update");
		equal(change.changes.title, expectedTitle);

	}
);
