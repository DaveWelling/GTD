/// <reference path="../../backbone.min.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
define(['backbone', 'app/eventSink', 'app/models/task', 'backbone-localStorage']
	, function (backbone, sink, taskType) {
		
	var tasks = backbone.Collection.extend({
		// Reference to this collection's model.
		model: taskType,
		initialize: function (models) {
			var that = this;
			that.root = that.create({ title: 'Tasks Root' });
			sink.on('task:idSelected', that.idSelected, that);
			sink.on('task:addToParent', that.addToParent, that);
		},
		destroy: function() {
			sink.off("task:idSelected", this.idSelected);
			sink.off("task:addToParent", this.addToParent);
			this.root = null;
		},
		idSelected:function (taskId) {
			var task = this.get(taskId);
			sink.trigger("task:selected", task);
		},
		addToParent: function(parentTaskId) {
			var newTask = this.create();
			var parentTask;
			if (parentTaskId === 'root') {
				parentTask = this.root;
			} else {
				parentTask = this.get(parentTaskId);
			}
			if ($.isEmptyObject(parentTask)){
				throw {
					error: "No parent task",
					message: "No task for parent ID " + parentTaskId
				};
			};
			parentTask.get("children").push(newTask.id);
		},
		localStorage: new Store('integrity-tasks')
	});
	return tasks;
});