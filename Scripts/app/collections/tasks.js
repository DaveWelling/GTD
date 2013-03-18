/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
define(['underscore','backbone', 'app/eventSink', 'app/models/task', 'app/collections/subTasks']
	, function (_, backbone, sink, taskType, subTasksType) {
		
	var tasks = backbone.Collection.extend({
		// Reference to this collection's model.
		model: taskType,
		initialize: function (models) {
			sink.on('task:addToParent', this.addToParent, this);
		},
		destroy: function() {
			sink.off("task:addToParent", this.addToParent);
			this.root = null;
		},
		addToParent: function(parentTaskId) {
			var newTask = this.create({title: 'new task'});
			var parentTask;
			parentTask = this.get(parentTaskId);
			if ($.isEmptyObject(parentTask)) {
				throw new Error("No task for parent ID " + parentTaskId);
			}
			
			// trigger model change event by using set method (instead of just changing property/attribute)
			var children = parentTask.get("children");
			// change event won't fire unless a copy of the original
			// is put into the children property/attribute (because
			// array is a reference type).
			var copy = children.slice(0);
			copy.push(newTask.id);
			parentTask.set("children", copy);

			parentTask.save();
		},
		getSubcollection: function (ids) {
			var holdTasks = [];
			var that = this;
			_.each(ids, function (id) {
				holdTasks.push(that.get(id));
			});
			return new subTasksType(holdTasks);
		},
		url: "http://localhost/IntegrityGtdData/api/Taskapi"
		//localStorage: new backbone.LocalStorage('integrity-tasks')
	});
	return tasks;
});