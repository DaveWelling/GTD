/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
define(['underscore', 'backbone', 'app/eventSink', 'app/models/task', 'app/collections/subTasks']
	, function (_, backbone, sink, taskType, subTasksType) {
		var taskMatchesFilter = function(task, filter) {
			for (var propertyName in filter) {
				if (filter.hasOwnProperty(propertyName)) {
					if (!_.contains(filter[propertyName],task.attributes[propertyName])) {
						return false;
					}	                                                       
				}
			}
			return true;
		};
		var tasks = backbone.Collection.extend({
			// Reference to this collection's model.
			model: taskType,
			initialize: function (models) {
				sink.on('task:addToParent', this.addToParent, this);
				sink.on("taskFiltersController:FilterChange", this.handleFilterChange, this);
			},
			destroy: function () {
				sink.off("task:addToParent", this.addToParent);
				this.root = null;
			},
			handleFilterChange: function(newFilter) {
				this.filter = newFilter;
				this.trigger("tasks:FilterChange");
			},
			addToParent: function (parentTaskId) {
				var newTask = this.create({ title: 'new task' });
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
			getSubcollection: function (parentTask) {
				return new subTasksType([], {parentTask: parentTask, filter: this.filter});
			},
			url: "http://molly/IntegrityGtdData/api/Taskapi",
			//localStorage: new backbone.LocalStorage('integrity-tasks')
			filter: {
				status: ["Action Pending"],
				when: ["Now", "Next", "Soon", "Later"],
				where: ["Work"]
			},

		});
		return tasks;
	});