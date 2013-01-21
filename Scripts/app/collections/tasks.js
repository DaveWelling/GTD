define(['backbone', 'app/vent', 'app/models/task', 'backbone-localStorage'], function (backbone, vent, taskType) {
	var that = this;
	var tasks = backbone.Collection.extend({
		// Reference to this collection's model.
		model: taskType,
		initialize: function (models) {
			vent.bindTo(vent, 'task:idSelected', function (taskId) {
				var task = this.get(taskId);
				vent.trigger("task:selected", task);
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