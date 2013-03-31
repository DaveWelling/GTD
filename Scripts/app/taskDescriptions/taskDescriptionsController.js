﻿/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskDescriptions/taskDescriptionsView', 'app/eventSink']
	, function (tasksType, taskDescriptionsViewType, sink) {
		this.controller = function (tasks) {
			var taskDescriptionsView;
			var currentTask = null;
			var that = this;
			this.start = function () {
				taskDescriptionsView = new taskDescriptionsViewType();
				sink.on('router:taskIdSelected', this.setCurrentTaskForTaskId, this);
				taskDescriptionsView.on("StateChanged", handleStateChange, this);
			};
			this.destroy = function () {
				sink.off('router:taskIdSelected', this.setCurrentTaskForTaskId);
			};
			this.setCurrentTaskForTaskId = function(id) {
				var task = tasks.get(id);
				that.setCurrentTask(task);
			};
			var handleStateChange = function(newState) {
				currentTask.set("State", newState);
			};
			
			this.setCurrentTask = function(task) {
				currentTask = task;
				taskDescriptionsView.taskSelected(task);
			};
			this.getCurrentTask = function() {
				return currentTask;
			};

		};
		return controller;
	});