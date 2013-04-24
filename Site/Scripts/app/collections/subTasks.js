/// <reference path="../../backbone.min.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
/// <reference path="../../underscore.js"/>
/// 
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
			var subTasks = this;
			if (subTasks.contains(model)) {
				if (!taskMatchesFilter(model, subTasks.filter)) {
					subTasks.remove(model);
				}
			} else {
				if (taskMatchesFilter(model, subTasks.filter)) {
					subTasks.add(model);
				}
			}
		};
		
		var getParentTaskChildren = function(recipientSubTasks) {
			var taskIds = recipientSubTasks.parentTask.get("children");
			var toAdd = [];
			_.each(taskIds, function (taskId) {
				var task = this.parentTask.collection.get(taskId);
				toAdd.push(task);
			}, recipientSubTasks);
			return toAdd;
		};
		
		var parentTaskChildrenChanged = function(eventArgs) {
			var newTaskIds = _.difference(eventArgs.attributes.children, eventArgs._previousAttributes.children);
			_.each(newTaskIds, function(newTaskId) {
				var newTask = this.parentTask.collection.get(newTaskId);
				if (taskMatchesFilter(newTask, this.filter)) {
					this.add(newTask);
				};
				newTask.on("change", handleTaskChange, this);
			}, this);
			var removedTaskIds = _.difference(eventArgs._previousAttributes.children, eventArgs.attributes.children);
			_.each(removedTaskIds, function (removedTaskId) {
				var taskToRemove = this.parentTask.collection.get(removedTaskId);
				if (typeof taskToRemove === 'undefined') {
					throw new Error("Remove a task from the parentTask children before removing from the rootcollection.");
				};
				this.remove(taskToRemove);
				taskToRemove.off("change", handleTaskChange, this);
			}, this);
		};
		
		// exported object
		var SubTasks = backbone.Collection.extend({
			// Reference to this collection's model.
			initialize: function (newModels, options) {
				if (typeof newModels != 'undefined' && newModels.length > 0) {
					throw new Error("subTask type does not support passing in models to constructor.");
				}
				if (typeof options === 'undefined' || typeof options.parentTask === 'undefined') {
					throw new Error("A parentTask must be passed into the subTasks type constructor options.");
				};
				
				this.parentTask = options.parentTask;
				this.filter = options.filter;

				var toAdd = getParentTaskChildren(this);
				_.each(toAdd, function (addTask) {
					if (taskMatchesFilter(addTask, this.filter)) {
						newModels.push(addTask);
					}
					addTask.on("change", handleTaskChange, this);
				}, this);
				
				this.parentTask.on("change:children", parentTaskChildrenChanged, this);
			},
			parentTask: {},
			model: taskType,
			create: function() {
				throw new Error("Create is not supported for the subTasks collection.");
			},
			filter: {},
			add: function (newTask, options) {
				if (newTask.length === 0) return null;
				if ($.isArray(newTask)) {
					var idsOfNew = _.pluck(newTask, "id");
					if (_.difference(idsOfNew, this.parentTask.get('children')).length > 0){
						throw new Error("An added task must exist in the parentTask children.");
					}
				}
				else if (!_.contains(this.parentTask.get("children"), newTask.id)) {
					throw new Error("An added task must exist in the parentTask children.");
				};
				return backbone.Collection.prototype.add.call(this, newTask, options);
			}
		});
		return SubTasks;
	});