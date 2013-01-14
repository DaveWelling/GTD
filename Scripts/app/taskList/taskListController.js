/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskList/taskListView'], function(tasksType, taskListViewType) {
	this.controller = function (vent, tasks) {
		this.start = function() {
			var taskList = new taskListViewType({ collection: tasks, vent: vent});
			taskList.render();
			vent.bindTo(vent, 'task:selected', taskList.taskSelected, taskList);
		};
	};
	return controller;
});