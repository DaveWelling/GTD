/// <reference path="../../backbone.min.js"/>
/// <reference path="../../require.js"/>

define(['app/collections/tasks', 'app/taskList/taskListView', 'app/eventSink']
	, function (tasksType, taskListViewType, sink) {
		this.controller = function (tasks) {
			var taskList;
			this.start = function () {
				taskList = new taskListViewType({ collection: tasks });
				taskList.render();
				sink.on('task:selected', taskList.taskSelected, taskList);
				sink.on('tasks:taskAddedToParent', taskList.taskAddedToParent, this);
			};
			this.destroy = function () {
				sink.off('task:selected');
				sink.off('tasks:taskAddedToParent', taskList.taskAddedToParent);
			};
		};
		return controller;
	});