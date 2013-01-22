/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskList/taskListView', 'app/eventSink']
	, function (tasksType, taskListViewType, sink) {
	this.controller = function (tasks) {
		this.start = function() {
			var taskList = new taskListViewType({ collection: tasks});
			taskList.render();
			sink.on('task:selected', taskList.taskSelected, taskList);
		};
	};
	return controller;
});