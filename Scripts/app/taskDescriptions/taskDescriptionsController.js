﻿/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskDescriptions/taskDescriptionsView', 'app/eventSink']
	, function (tasksType, taskDescriptionsViewType, sink) {
		this.controller = function (tasks) {
			var taskDescriptionsView;
			this.start = function () {
				taskDescriptionsView = new taskDescriptionsViewType();
				sink.on('task:selected', taskDescriptionsView.taskSelected, taskDescriptionsView);
			};
			this.destroy = function () {
				sink.off('task:selected', taskDescriptionsView.taskSelected);
			};
		};
		return controller;
	});