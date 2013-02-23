/// <reference path="../../backbone.min.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
define(['underscore','backbone', 'app/eventSink', 'app/models/task', 'backbone-localStorage']
	, function (_, backbone, sink, taskType) {
		
	var tasks = backbone.Collection.extend({
		// Reference to this collection's model.
		model: taskType,
		initialize: function (models) {
			sink.on('task:idSelected', this.idSelected, this);
			sink.on('task:addToParent', this.addToParent, this);
		},
		destroy: function() {
			sink.off("task:idSelected", this.idSelected);
			sink.off("task:addToParent", this.addToParent);
			this.root = null;
		},
		idSelected:function (taskId) {
			var task = this.get(taskId);
			if (typeof task != 'undefined') {
				sink.trigger("task:selected", task);
			}
		},
		addToParent: function(parentTaskId) {
			var newTask = this.create({title: 'new task'});
			var parentTask;
			parentTask = this.get(parentTaskId);
			if ($.isEmptyObject(parentTask)){
				throw {
					error: "No parent task",
					message: "No task for parent ID " + parentTaskId
				};
			};
			parentTask.get("children").push(newTask.id);
			sink.trigger("tasks:taskAddedToParent", newTask, parentTask);
			sink.trigger("task:selected", newTask);
		},
		localStorage: new backbone.LocalStorage('integrity-tasks')
	});
	return tasks;
});