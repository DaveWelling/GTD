/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskDescriptions/taskDescriptionsView'], function (tasksType, taskDescriptionsViewType) {
	this.controller = function (vent, tasks) {
		this.start = function () {
			var taskDescriptionsView = new taskDescriptionsViewType({vent: vent });
			vent.bindTo(vent, 'task:selected', taskDescriptionsView.taskSelected, taskDescriptionsView);
		};
	};
	return controller;
});