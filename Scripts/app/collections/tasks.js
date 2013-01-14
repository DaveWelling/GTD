define(['backbone', 'app/models/task', 'backbone-localStorage'], function (backbone, taskType) {
	var vent = null;
	var that = this;
	var tasks = backbone.Collection.extend({
		// Reference to this collection's model.
		model: taskType,
		initialize: function (models, options) {
			that.vent = options.vent;
			that.vent.bindTo(that.vent, 'task:idSelected', function (taskId) {
				var task = this.get(taskId);
				that.vent.trigger("task:selected", task);
			}, this);
			//this.options.vent.on('task.selected', function (e) {
			//	alert(e);
			//});
			//this.options.vent.on('task.newRequested', function() {
			//	this.create({ title: 'New Task' });
			//});
		},
		localStorage: new Store('integrity-tasks')
	});
	return tasks;
});