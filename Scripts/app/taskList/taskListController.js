/// <reference path="../../backbone.min.js"/>
/// <reference path="../../require.js"/>

define(['app/collections/tasks', 'app/taskList/taskListView', 'app/eventSink']
	, function (tasksType, taskListViewType, sink) {
	this.controller = function (tasks) {
		this.start = function() {
			var taskList = new taskListViewType({ collection: tasks});
			taskList.render();
			sink.on('task:selected', taskList.taskSelected, taskList);
			sink.on('task:addToParent', taskList.render, taskList);
		};
		this.destroy = function() {
			sink.off('task:selected');
		};
	};
	return controller;
});