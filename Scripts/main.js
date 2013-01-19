/// <reference path="backbone.marionette.js"/>

	
require(['controller'
		, 'marionette'
		, 'app/collections/tasks'
		, 'app/models/task'
		, 'app/taskDescriptions/taskDescriptionsController'
		, 'app/router']
, function (taskListControllerType, marionette, tasksType, task, taskDescriptionsControllerType, router) {
	"use strict";
	var vent = new marionette.EventAggregator();
	var task1 = new task({ title: 'test task 1', description: 'description for task 1' });
	var task2 = new task({ title: 'test task 2', description: 'description for task 2' });
	var tasks = new tasksType([task1,task2], {vent:vent});
	//tasks.add(task1);
	//tasks.add(task2);
	var taskListController = new taskListControllerType(vent, tasks);
	taskListController.start();
	var taskDescriptionsController = new taskDescriptionsControllerType(vent);
	taskDescriptionsController.start();
	var workspace = new router({ vent: vent });
	Backbone.history.start();
});