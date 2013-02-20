/// <reference path="app/constants.js"/>

require(['app/taskList/taskListController'
		, 'app/collections/tasks'
		, 'app/models/task'
		, 'app/taskDescriptions/taskDescriptionsController'
		, 'app/router']
, function (taskListControllerType, tasksType, task, taskDescriptionsControllerType, router) {
	"use strict";
	var rootTask = new task({ id: AppConstants.RootId, title: 'Tasks', description: 'Tasks' });
	var tasks = new tasksType([rootTask]);
	var taskListController = new taskListControllerType(tasks);
	taskListController.start();
	var taskDescriptionsController = new taskDescriptionsControllerType();
	taskDescriptionsController.start();
	var workspace = new router();
	Backbone.history.start();
});