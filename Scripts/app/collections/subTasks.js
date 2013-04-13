/// <reference path="../../backbone.min.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
define(['underscore', 'backbone', 'app/models/task']
	, function (_, backbone, taskType) {
		var taskMatchesFilter = function (task, filter) {
			for (var propertyName in filter) {
				if (filter.hasOwnProperty(propertyName)) {
					if (!_.contains(filter[propertyName], task.attributes[propertyName])) {
						return false;
					}
				}
			}
			return true;
		};
		var handleTaskChange = function(model) {
			var collection = this;
			if (collection.contains(model)) {
				if (!taskMatchesFilter(model, collection.filter)) {
					this.remove(model);
				}
			} else {
				if (taskMatchesFilter(model, collection.filter)) {
					this.add(model);
				}
			}
		};
		var handleAdd = function (newModel) {
			var collection = this;
			collection.unfilteredTasks.push(newModel);
			newModel.on("change", handleTaskChange, this);
			if (taskMatchesFilter(newModel, collection.filter)) {
				
			}
		};
		
		var taskChildrenChanged = function(eventArgs) {
			var newTaskIds = _.difference(eventArgs.attributes.children, eventArgs._previousAttributes.children);
			_.each(newTaskIds, function(newTaskId) {
				var newTask = this.rootCollection.get(newTaskId);
				this.collection.add(newTask);
				this.render();
			}, this);
		};
		
		// exported object
		var subTasks = backbone.Collection.extend({
			// Reference to this collection's model.
			initialize: function (models, options) {
				if (typeof options != 'undefined') {
					this.unfilteredTasks = options.unfilteredChildren;
					this.filter = options.filter;
					_.each(this.unfilteredTasks.models, function(task) {
						task.on("change", handleTaskChange, this);
						if (taskMatchesFilter(task, this.filter)) {
							models.push(task);
						}
					}, this);
				}
				this.on("add", handleAdd, this);
			},
			model: taskType,
			create: function() {
				throw new Error("Create is not supported for the subTasks collection.");
			},
			unfilteredTasks: [],
			filter: {}
		});
		return subTasks;
	});