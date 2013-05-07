/// <reference path="../../backbone.js"/>
/// <reference path="../models/task.js"/>
/// <reference path="../collections/tasks.js"/>
define(['app/collections/tasks', 'app/taskFilters/taskFiltersView', 'app/eventSink']
	, function (tasksType, taskFiltersViewType, sink) {
		this.controller = function () {
			var taskFiltersView;
			this.start = function () {
				taskFiltersView = new taskFiltersViewType();
				taskFiltersView.render();
				taskFiltersView.on("applyFilters", handleApplyFiltersRequest, this);
			};
			var handleApplyFiltersRequest = function() {
				var filters = taskFiltersView.getFilters();
				sink.trigger("taskFiltersController:FilterChange", filters);
			};
		};
		return controller;
	});