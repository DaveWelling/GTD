/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskList/taskListView', 'app/vent'], function(tasksType, taskListViewType, vent) {
	this.controller = function (tasks) {
		this.start = function() {
			var taskList = new taskListViewType({ collection: tasks});
			taskList.render();
			vent.bindTo(vent, 'task:selected', taskList.taskSelected, taskList);
		};
	};
	return controller;
});