/// <reference path="app/constants.js"/>
/// <reference path="backbone.min.js"/>

require(['jquery'
		, 'app/taskHierarchy/taskHierarchyController'
		, 'app/collections/tasks'
		, 'app/models/task'
		, 'app/taskDescriptions/taskDescriptionsController'
		, 'app/router'
		, 'app/taskFilters/taskFiltersController'
		, 'app/taskHierarchy/taskHierarchyView'
		, 'jquery.mobile'
		, 'bootstrap'
		, 'tinyMCE']
, function ($
	, taskHierarchyControllerType
	, tasksType
	, taskType
	, taskDescriptionsControllerType
	, router
	, taskFiltersControllerType
	, TaskHierarchyView) {
	"use strict";
	

	var tasks = new tasksType();
	tasks.fetch({
		success: function() {

			var rootTask = tasks.get(AppConstants.RootId);
			if (typeof rootTask === 'undefined') {
				rootTask = tasks.create({ Id: AppConstants.RootId, title: 'Tasks', description: 'Tasks', children: [] });
			}

			var taskHierarchyController = new taskHierarchyControllerType(rootTask);
			taskHierarchyController.start();

			var taskDescriptionsController = new taskDescriptionsControllerType(tasks);
			taskDescriptionsController.start();

			var taskFiltersController = new taskFiltersControllerType();
			taskFiltersController.start();

			var workspace = new router();
			Backbone.history.start();
		}
	});
});