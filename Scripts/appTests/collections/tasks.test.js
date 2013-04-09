/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Tasks Collection Tests", {
	setup: function () {
		var that = this;
		this.getTestTasks = function(tasksType) {
			var tasks = new tasksType();
			tasks.add(new tasks.model({ Id: AppConstants.RootId, title: 'Tasks', description: 'Tasks', children: [1, 2, 3] }));
			tasks.add(new tasks.model({ Id: 1, title: 't_1_1', description: 't_1_1 description', children: [4, 5, 6] }));
			tasks.add(new tasks.model({ Id: 2, title: 't_1_2', description: 't_1_2 description' }));
			tasks.add(new tasks.model({ Id: 3, title: 't_1_3', description: 't_1_3 description' }));
			tasks.add(new tasks.model({ Id: 4, title: 't_2_1', description: 't_2_1 description', children: [7, 8, 9] }));
			tasks.add(new tasks.model({ Id: 5, title: 't_2_2', description: 't_2_2 description' }));
			tasks.add(new tasks.model({ Id: 6, title: 't_2_3', description: 't_2_3 description' }));
			tasks.add(new tasks.model({ Id: 7, title: 't_3_1', description: 't_3_1 description' }));
			tasks.add(new tasks.model({ Id: 8, title: 't_3_2', description: 't_3_2 description' }));
			tasks.add(new tasks.model({ Id: 9, title: 't_3_3', description: 't_3_3 description' }));
			return tasks;
		};
		this.ctxt = new CreateContext({});
		this.asyncShell = function (numberAssertionsExpected, testFunction) {
			expect(numberAssertionsExpected);
			stop(2000);
			this.ctxt(['app/collections/tasks', 'app/eventSink', 'app/models/task'], function (tasksType, sink, taskType) {
				var tasks = new tasksType();
				try {
					testFunction = _.bind(testFunction, that);
					testFunction(tasks, sink, taskType, tasksType);
					tasks.destroy();
				} catch (e) {
					tasks.destroy();
					throw e;
				}
				start();
			});
		};
	}
});
var tasksTest = (function() {
	var outputModule = {};
	outputModule.defaultFilter = {
		state: ["Action Pending"],
		when: ["Now", "Next", "Soon", "Later"],
		where: ["Work"]
	};
	return outputModule;
}());
test("on task:addToParent event - where parent does not exist - exception", function () {
	this.asyncShell(1, function(tasks, sink, taskType, tasksType) {
		testUtilities.expectException(function() {
			sink.trigger("task:addToParent", 'does not exist');
		}, "No task for parent ID");
	});
});

test("on destruction - removes event bindings", function () {
	this.asyncShell(2, function (tasks, sink, taskType, tasksType) {
		equal(tasks.length, 0);
		tasks.destroy();
		sink.trigger("task:addToParent", "root");
		equal(tasks.length, 0);	
	});
});


amdTest("getSubcollection | given valid ids | returns collection with tasks for ids",
	4,
	["app/collections/tasks"],
	function(TasksType) {
		var tasks = this.getTestTasks(TasksType);
		var subCollection = tasks.getSubcollection([4, 5, 9]);
		ok(subCollection.length === 3, "Subcollection should have three items");
		ok(subCollection.some(function (task) { return task.id === 4; }), "should have id 4");
		ok(subCollection.some(function (task) { return task.id === 5; }), "should have id 5");
		ok(subCollection.some(function (task) { return task.id === 9; }), "should have id 9");
	},
	['app/view/myView'],
	function(view) {
		return "fake";
	}
);

amdTest({
	testDescription: "getSubcollection | children of original collection task changes | child of subCollection gets event",
	numberExpectedAssertions: 2,
	amdDependencies: ["app/collections/tasks"],
	testFunction: function (tasksType) {
		stop(1000);
		var tasks = this.getTestTasks(tasksType);
		var originalTask = tasks.get(4);
		
		var subCollection = tasks.getSubcollection([4, 5, 9]);
		var copiedTask = subCollection.get(4);
		copiedTask.on("change:children", function(args) {
			ok(true, "Change event of copied task should fire when original task changes.in ");
			start();
		});
		
		var children = originalTask.get("children");
		var copy = children.slice(0);
		copy.push(99);
		notEqual(copy, children);
		originalTask.set("children", copy);
	}
});

amdTest("taskFiltersController:FilterChange | Default filter | 'filter' returns default filter",
	1,
	["app/collections/tasks", "app/eventSink"],
	function(tasksType, sink) {
		var tasks = new tasksType();
		sink.trigger("taskFiltersController:FilterChange", tasksTest.defaultFilter);
		deepEqual(tasks.filter, tasksTest.defaultFilter);
	}
);

amdTest("taskFiltersController:FilterChange | Default filter | 'filter' returns default filter",
	1,
	["app/collections/tasks", "app/eventSink"],
	function (tasksType, sink) {
		var tasks = new tasksType();
		sink.trigger("taskFiltersController:FilterChange", tasksTest.defaultFilter);
		deepEqual(tasks.filter, tasksTest.defaultFilter);
	}
);

amdTest("taskFiltersController:FilterChange | | tasks:FilterChange raised",
	1,
	["app/collections/tasks", "app/eventSink"],
	function (tasksType, sink) {
		var tasks = new tasksType();
		var assertion = function() { ok(true); };
		try {
			tasks.on("tasks:FilterChange", assertion);
			sink.trigger("taskFiltersController:FilterChange", tasksTest.defaultFilter);
		} finally {
			tasks.off("tasks:FilterChange", assertion);
		} 
	}
);

amdTest("getSubCollection | filter 'when' == 'Now' | returns matching values",
	1,
	["app/collections/tasks", "app/models/task"],
	function(tasksType, taskType) {
		var tasks = new tasksType();
		var matchingTask = new taskType({ when: "Now" });
		var nonmatchingTask = new taskType({ when: "Waiting" });
		tasks.filter = {
			when: ["Now"]
		};
		tasks.add(matchingTask);
		tasks.add(nonmatchingTask);
		var results = tasks.getSubcollection([matchingTask.id, nonmatchingTask.id]);
		var firstResult = results.first();
		equal(firstResult.id, matchingTask.id);
	}
);
amdTest("getSubCollection | filter 'when' == 'Now', 'where' == 'Work' | returns matching values",
	1,
	["app/collections/tasks", "app/models/task"],
	function (tasksType, taskType) {
		var tasks = new tasksType();
		var matchingTask = new taskType({ when: "Now", where: "Work" });
		var nonmatchingTask1 = new taskType({ when: "Waiting", where: "Work" });
		var nonmatchingTask2 = new taskType({ when: "Now", where: "Home" });
		tasks.filter = {
			when: ["Now"],
			where: ["Work"]
		};
		tasks.add(matchingTask);
		tasks.add(nonmatchingTask1);
		tasks.add(nonmatchingTask2);
		var ids = tasks.pluck("Id");
		var results = tasks.getSubcollection(ids);
		var firstResult = results.first();
		equal(firstResult.id, matchingTask.id);
	}
);
