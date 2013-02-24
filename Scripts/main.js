/// <reference path="app/constants.js"/>

require(['app/taskList/taskListController'
		, 'app/collections/tasks'
		, 'app/models/task'
		, 'app/taskDescriptions/taskDescriptionsController'
		, 'app/router'
		, 'app/taskHierarchy/taskHierarchyView']
, function (taskListControllerType, tasksType, task, taskDescriptionsControllerType, router, taskHierarchyView) {
	"use strict";
	var rootTask = new task({ id: AppConstants.RootId, title: 'Tasks', description: 'Tasks' });
	var tasks = new tasksType([rootTask]);
	//var taskListController = new taskListControllerType(tasks);
	//taskListController.start();

	taskHierarchyView.render();
	$("#hierarchy").html(taskHierarchyView.el);
	
	//var taskDescriptionsController = new taskDescriptionsControllerType();
	//taskDescriptionsController.start();
	var workspace = new router();
	Backbone.history.start();
});