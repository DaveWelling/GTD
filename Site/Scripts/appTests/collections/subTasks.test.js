/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("subTasks Collection Tests", {
	setup: function() {
		this.setUpStandardTestData = function (subTasksType, tasksType, taskType) {
			this.tasks = new tasksType();
			// 2 of 3 will pass filter
			this.task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
			this.task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
			this.task3 = new taskType({ title: "t3", status: "Complete", when: "Now", where: "Work" });
			this.parentTask = new taskType({ children: [this.task1.id, this.task2.id, this.task3.id] });
			this.tasks.add(this.task1);
			this.tasks.add(this.task2);
			this.tasks.add(this.task3);
			this.tasks.add(this.parentTask);

			var testFilter = {
				status: ["Action Pending"],
				when: ["Now"],
				where: ["Work"]
			};

			return new subTasksType([], { parentTask: this.parentTask, filter: testFilter });
		};
	}
});


amdTest("create | valid inputs | throws exception",
	1,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);
		testUtilities.expectException(function() {
			subTasks.create({ title: "this should throw an error" });
		}, "Create is not supported");
	}
);


amdTest("parentTask non-filter matching child changes | filtered model changes to match filter | model added to subTasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);
		
		// set to status not in filter
		this.task3.set("status", "Action Pending");
		
		ok(subTasks.get(this.task1.id) != null);
		ok(subTasks.get(this.task2.id) != null);
		ok(subTasks.get(this.task3.id) != null);
	}
);

amdTest("parentTask filter matching child changes | matching model changes to fail filter | model removed from subtasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);

		// set to status not in filter
		this.task2.set("status", "Complete");
		
		ok(subTasks.get(this.task1.id) != null);
		ok(typeof subTasks.get(this.task2.id) === 'undefined');
		ok(typeof subTasks.get(this.task3.id) === 'undefined');
	}
);


amdTest("parentTask children change event | child id removed from parentTask children | child removed",
	1,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);

		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.splice(_.indexOf(copy, this.task2.id), 1);

		this.parentTask.set("children", copy);
		ok(typeof subTasks.get(this.task2.id) === 'undefined');
	}
);

amdTest("parentTask children change event | new child passes filter | child added",
	1,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);
		
		var newTask = new taskType({ title: "t4", status: "Action Pending", when: "Now", where: "Work" });
		this.tasks.add(newTask);
		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.push(newTask.id);
		this.parentTask.set("children", copy);
		ok(subTasks.get(newTask.id) != null);
	}
);

amdTest("parentTask children change event | new child fails filter | child not added",
	1,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);

		var newTask = new taskType({ title: "t4", status: "Complete", when: "Now", where: "Work" });
		this.tasks.add(newTask);
		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.push(newTask.id);
		this.parentTask.set("children", copy);
		
		ok(typeof subTasks.get(newTask.id) === 'undefined');
	}
);


amdTest("constructor | 2 of 3 children pass filter | 2 children added",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);
		ok(subTasks.get(this.task1.id) != null);
		ok(subTasks.get(this.task2.id) != null);
		ok(typeof subTasks.get(this.task3.id) === 'undefined');
	}
);


amdTest("Constructor | pass in models | throw exception",
	1,
	["app/collections/subTasks"],
	function (subTasksType) {
		testUtilities.expectException(function () {
			var subTasks = new subTasksType([{}]);
		}, "subTask type does not support passing in models to constructor.");
	});


amdTest("Constructor | no parent task passed | throw exception",
	1,
	["app/collections/subTasks"],
	function (subTasksType) {
		testUtilities.expectException(function () {
			var subTasks = new subTasksType([]);
		}, "A parentTask must be passed into the subTasks type constructor options.");

	});

amdTest("Add | new model id not in parentTask children | exception",
	1,
	["app/collections/subTasks", "app/models/task"],
	function (subTasksType, taskType) {
		var parentTask = new taskType();
		var subTasks = new subTasksType([], { parentTask: parentTask });
		testUtilities.expectException(function() {
			subTasks.add(new taskType());
		}, "An added task must exist in the parentTask children.");
	});

amdTest("filter matching child task change | task added after initialization and changed to non-filter mailing status | task removed",
	2,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function(subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);

		var newTask = new taskType({ title: "t4", status: "Action Pending", when: "Now", where: "Work" });
		this.tasks.add(newTask);
		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.push(newTask.id);
		this.parentTask.set("children", copy);


		ok(subTasks.get(newTask.id) != null);
		newTask.set("status", "Complete");
		ok(typeof subTasks.get(newTask.id) === 'undefined');
	}
);


amdTest("non-filter matching child task change | task added after initialization and changed to filter matching status | task added",
	2,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function(subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);

		var newTask = new taskType({ title: "t4", status: "Complete", when: "Now", where: "Work" });
		this.tasks.add(newTask);
		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.push(newTask.id);
		this.parentTask.set("children", copy);

		ok(typeof subTasks.get(newTask.id) === 'undefined');
		newTask.set("status", "Action Pending");
		ok(subTasks.get(newTask.id) != null);
	}
);


amdTest("non-filter matching child task change | task removed after initialization and changed to filter mailing status | task is not added",
	2,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);

		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.splice(_.indexOf(copy, this.task3.id), 1);
		this.parentTask.set("children", copy);

		ok(typeof subTasks.get(this.task3.id) === 'undefined');
		this.task3.set("status", "Action Pending");
		ok(typeof subTasks.get(this.task3.id) === 'undefined');
		
	}
);

amdTest("remove task id from parent task children | task removed from rootcollection first | exception",
	1,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function(subTasksType, tasksType, taskType) {
		var subTasks = this.setUpStandardTestData(subTasksType, tasksType, taskType);
		this.tasks.remove(this.task2);

		var newChildren = this.parentTask.get("children");
		// change event won't fire unless a copy of the original
		// is put into the children property/attribute (because
		// array is a reference type).
		var copy = newChildren.slice(0);
		copy.splice(_.indexOf(copy, this.task2.id), 1);
		var that = this;
		testUtilities.expectException(function() {
			that.parentTask.set("children", copy);
		}, "Remove a task from the parentTask children before removing from the rootcollection.");
	}
);