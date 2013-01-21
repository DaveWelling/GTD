/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskDescriptions/taskDescriptionsView', 'app/vent'], function (tasksType, taskDescriptionsViewType, vent) {
	this.controller = function (tasks) {
		this.start = function () {
			var taskDescriptionsView = new taskDescriptionsViewType();
			vent.bindTo(vent, 'task:selected', taskDescriptionsView.taskSelected, taskDescriptionsView);
		};
	};
	return controller;
});