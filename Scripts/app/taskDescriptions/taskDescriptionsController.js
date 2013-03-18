/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskDescriptions/taskDescriptionsView', 'app/eventSink']
	, function (tasksType, taskDescriptionsViewType, sink) {
		this.controller = function (tasks) {
			var taskDescriptionsView;
			this.start = function () {
				taskDescriptionsView = new taskDescriptionsViewType();
				sink.on('router:taskIdSelected', this.setCurrentTaskForTaskId, this);
			};
			this.destroy = function () {
				sink.off('router:taskIdSelected', this.setCurrentTaskForTaskId);
			};
			this.setCurrentTaskForTaskId = function(id) {
				var task = tasks.get(id);
				taskDescriptionsView.taskSelected(task);
			};
		};
		return controller;
	});