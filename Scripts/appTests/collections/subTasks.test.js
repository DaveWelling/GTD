/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("subTasks Collection Tests");

var subTasksTest = (function() {
	this.createTestCollection = function(tasksType, taskType) {

	};
	return this;
}());

amdTest("create | valid inputs | throws exception",
	1,
	["app/collections/subTasks"],
	function (subTasksType) {
		var subTasks = new subTasksType();
		testUtilities.expectException(function() {
			subTasks.create({ title: "this should throw an error" });
		}, "Create is not supported");
	}
);

amdTest("constructor | passed tasks and a filter | populates with filtered tasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function(subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Complete", when: "Now", where: "Work" });
		tasks.add(task1);
		tasks.add(task2);
		tasks.add(task3);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		ok(subTasks.get(task1.id) != null);
		ok(subTasks.get(task2.id) != null);
		ok(typeof subTasks.get(task3.id) === 'undefined');
	}
);

amdTest("model change event | model no longer passes filter | model removed from subTasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Complete", when: "Now", where: "Work" });
		tasks.add(task1);
		tasks.add(task2);
		tasks.add(task3);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		// set to status not in filter
		task2.set("status", "Complete");
		ok(subTasks.get(task1.id) != null);
		ok(typeof subTasks.get(task2.id) === 'undefined');
		ok(typeof subTasks.get(task3.id) === 'undefined');
	}
);

amdTest("model change event | filtered model changes to pass filter | model added to subTasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Complete", when: "Now", where: "Work" });
		tasks.add(task1);
		tasks.add(task2);
		tasks.add(task3);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		// set to status not in filter
		task3.set("status", "Action Pending");
		ok(subTasks.get(task1.id) != null);
		ok(subTasks.get(task2.id) != null);
		ok(subTasks.get(task3.id) != null);
	}
);

amdTest("model added after initialization | new model values pass filter | model included in subtasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Action Pending", when: "Now", where: "Work" });
		tasks.add(task1);
		tasks.add(task2);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		// set to status not in filter
		tasks.add(task3);
		subTasks.add(task3);
		ok(subTasks.get(task1.id) != null);
		ok(subTasks.get(task2.id) != null);
		ok(subTasks.get(task3.id) != null);
	}
);


amdTest("model added after initialization | new model values fail filter | model not included in subtasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Action Pending", when: "Now", where: "Work" });
		tasks.add(task1);
		tasks.add(task2);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		// set to status not in filter
		tasks.add(task3);
		subTasks.add(task3);
		ok(subTasks.get(task1.id) != null);
		ok(subTasks.get(task2.id) != null);
		ok(typeof subTasks.get(task3.id) === 'undefined');
	}
);

amdTest("model added after initialization has change event | new model values fail filter | model removed from subtasks",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Action Pending", when: "Now", where: "Work" });
		tasks.add(task1);
		tasks.add(task2);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		// set to status not in filter
		tasks.add(task3);
		subTasks.add(task3);
		task3.set("status", "Complete");
		ok(subTasks.get(task1.id) != null);
		ok(subTasks.get(task2.id) != null);
		ok(typeof subTasks.get(task3.id) === 'undefined');
	}
);

amdTest("model children change event | new child passes filter | child added",
	3,
	["app/collections/subTasks", "app/collections/tasks", "app/models/task"],
	function (subTasksType, tasksType, taskType) {
		var tasks = new tasksType();
		// 2 of 3 will pass filter
		var task1 = new taskType({ title: "t1", status: "Action Pending", when: "Now", where: "Work" });
		var task2 = new taskType({ title: "t2", status: "Action Pending", when: "Now", where: "Work" });
		var task3 = new taskType({ title: "t3", status: "Action Pending", when: "Now", where: "Work" });
		var parentTask = new taskType({ children: [task1.id,task2.id]});
		tasks.add(task1);
		tasks.add(task2);
		tasks.add(parentTask);

		var testFilter = {
			status: ["Action Pending"],
			when: ["Now"],
			where: ["Work"]
		};
		var subTasks = new subTasksType([], { unfilteredChildren: tasks, filter: testFilter });
		var newChildren = parentTask.get("children");
		newChildren.push(task3.id);
		parentTask.set("children", newChildren);
		ok(subTasks.get(task1.id) != null);
		ok(subTasks.get(task2.id) != null);
		ok(subTasks.get(task3.id) != null);
	}
);
