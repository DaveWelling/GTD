/// <reference path="../../backbone.min.js"/>
/// <reference path="../../require.js"/>

define(['app/collections/tasks', 'app/taskHierarchy/taskHierarchyView', 'app/eventSink']
	, function (tasksType, taskHierarchyViewType, sink) {
		this.controller = function (model) {
			var view;
			this.start = function () {
				view = new taskHierarchyViewType({ model: model });
				view.render();
				sink.on('task:selected', view.taskSelected, view);
				sink.on('tasks:taskAddedToParent', view.taskAddedToParent, view);
			};
			this.destroy = function () {
				sink.off('task:selected');
				sink.off('tasks:taskAddedToParent', view.taskAddedToParent);
			};
		};
		return controller;
	});