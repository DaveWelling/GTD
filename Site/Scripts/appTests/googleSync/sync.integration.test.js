
// TODO: Sync Integration Tests
module("Sync integration tests");

amdTest("sync | new local task A | task A added to server",
	1,
	['app/replication',
		'app/taskHierarchy/taskHierarchyController',
		'app/googleSync/listTasks',
		'app/collections/tasks'],
	function (replication, taskHierarchyControllerType, listTaskType, tasksType) {
		stop();
		// add a new local task
		var tasks = new tasksType();
		var rootTask = tasks.get(AppConstants.RootId);
		if (typeof rootTask === 'undefined') {
			rootTask = tasks.create({ id: AppConstants.RootId, title: 'Tasks', description: 'Tasks', children: [] });
		}

		var taskHierarchyController = new taskHierarchyControllerType(rootTask);
		taskHierarchyController.start();
		var newTask = taskHierarchyController.addNewTaskToParent(AppConstants.RootId);
		var expectedTitle = "some expected title for a task";
		newTask.set("title", expectedTitle);
		newTask.save();
		
		// trigger sync
		replication.sync();

		// verify new task is on server
		var listTask = new listTaskType();
		var deferred = listTask.listWithTitle(expectedTitle);
		deferred.done(function (tasks) {
			equal(tasks.length, 1);
			equal(tasks[0].title, expectedTitle);
			start();
		});
		deferred.fail(function() {
			ok(false, "listTask.listWithTitle failed");
			start();
		});
	}
);

amdTest("sync | update local task A | task A updated on server");

amdTest("sync | delete local task A which exists on server | task A deleted on server");

amdTest("Verify ability to get all changes since a UTC time");

amdTest("Build chronological queue of transactions since a given UTC time");

amdTest("For each transaction in queue determine if each property value has changed since previous transaction and apply change to all future transaction property values until the property changes again.")
