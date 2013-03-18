/// <reference path="../../backbone.min.js"/>
/// <reference path="../../require.js"/>

define(['app/collections/tasks', 'app/taskHierarchy/taskHierarchyView', 'app/eventSink']
	, function (tasksType, taskHierarchyViewType, sink) {
		this.controller = function (model) {
			var view;
			this.start = function () {
				taskHierarchyViewType.prototype.rootCollection = model.collection;
				view = new taskHierarchyViewType({ model: model });
				view.render();
				$("#hierarchy").html(view.$el);
				sink.on("router:taskIdSelected", this.selectTask, view);
			};
			this.destroy = function () {
				sink.off("router:taskIdSelected", this.selectTask);
			};
			this.selectTask = function(args) {
				var task = view.rootCollection.get(args);
				view.taskSelected(task);
			};

		};
		return controller;
	});