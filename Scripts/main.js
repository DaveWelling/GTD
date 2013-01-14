/// <reference path="backbone.marionette.js"/>
require.config({
	paths: {
		jquery: 'jquery-1.8.2.min',
		handlebars: 'Handlebars',
		underscore : 'underscore',
		backbone: 'backbone',
		controller: 'app/taskList/taskListController',
		marionette: 'backbone.marionette',
		kendo: 'kendo/2012.3.1114/kendo.web.min'
	},
	shim: {
		'backbone-localStorage': ['backbone'],
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['underscore']
		},
		hbs: {
			exports: 'hbs',
			deps: ['handlebars', 'hbs/underscore']
		},
		marionette: {
			exports: 'marionette',
			marionette: ['underscore', 'backbone']
		},
		kendo: {
			exports: 'kendo',
			deps: ['jquery']
		}
	},
	deps: ['jquery'],
	hbs: {
		disableI18n: true,        // This disables the i18n helper and
		// doesn't require the json i18n files (e.g. en_us.json)
		// (false by default)

		disableHelpers: true,     // When true, won't look for and try to automatically load
		// helpers (false by default)

		helperPathCallback:       // Callback to determine the path to look for helpers
			function (name) {       // ('/template/helpers/'+name by default)
				return 'cs!' + name;
			},

		templateExtension: "html" // Set the extension automatically appended to templates
		// ('hbs' by default)
	}
});
	
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