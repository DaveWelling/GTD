/// <reference path="../../require.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../constants.js"/>
define(['backbone', 'hbs!app/taskList/taskListTemplate', 'underscore', 'app/eventSink', 'hbs!app/taskList/taskNodeTemplate', 'app/viewUtilities']
	, function (backbone, taskListTemplate, _, sink, taskNodeTemplate, viewUtilities) {
		var taskList = null;

		var findElementWithTaskId = function ($unorderedList, taskId) {
			var $listElements = $unorderedList.children;
			var found = _.filter($listElements, function (listElement) { return listElement.attributes['data-taskid'].value == taskId; });
			if (found.length == 0) {
				throw { error: "No tasks found", message: "No tasks were found with ID = " + taskId };
			}
			return found[0];
		};
		var findParentNode = function (view, parentTaskId) {
			var selector = "[data-taskId='" + parentTaskId + "']";
			var parentElements = view.$el.find(selector);
			if (parentElements.length == 0) {
				throw new Error("Parent task node with id " + parentTaskId + " could not be found");
			}
			return parentElements[0];
		};
		var getTasksForIds = function(ids, taskCollection) {
			var tasks = [];
			_.each(ids, function(id) {
				tasks.push(taskCollection.get(id));
			});
			return tasks;
		};

		taskList = backbone.View.extend({
			el: "#hierarchy",
			events: {
				"click .taskAdd" : "addTaskToParent"
			},
			render: function (parentTask) {
				var childrenIds;
				var children;
				var $parentNode;
				// if given a parent task, render its children
				if (typeof parentTask !== 'undefined') {
					$parentNode = $(findParentNode(this, parentTask.id));
					childrenIds = parentTask.get("children");
				}
				// otherwise render the root
				else {
					$parentNode = this.$el;
					childrenIds = [AppConstants.RootId];
				}
				
				// if no children then don't render
				if (childrenIds.length === 0) return;
				
				children = getTasksForIds(childrenIds, this.collection);
				// create view using handlebars template
				var childrenJson = _.map(children, function(childTask) {
					return childTask.toJSON();
				});
				var list = taskListTemplate({ tasks: childrenJson });
				// add to current parent element
				$parentNode.append(list);
				
				// recursive call to render children of children.
				_.each(children, function (nextParentTask) {
					this.render(nextParentTask);
				}, this);
			},
			addTaskToParentRequest: function (args) {
				var parentNode = args.target.parentNode;
				var parentTaskId = parentNode.getAttribute('data-taskId');
				console.log("addToTask :in " + parentTaskId);
				sink.trigger("task:addToParent", parentTaskId);
			},
			getSelectedTaskElement: function () {
				var foundTask = null;
				if (typeof this.$el != 'undefined') {
					foundTask = this.$el.find(".selectedTask");
					if (foundTask.length > 0) {
						return _.first(foundTask);
					}
				}
				return null;
			},
			taskSelected: function (task) {
				var findString = "[data-taskId='" + task.id + "']";
				var item = this.$el.find(findString);
				var selectedItem = this.getSelectedTaskElement();
				if (selectedItem != null) {
					$(selectedItem).removeClass("selectedTask");
				}
				$(item).addClass("selectedTask");
			},
			taskAddedToParent: function (newTask, parentTask) {
				var parentNode = findParentNode(this, parentTask.id);
				var listElement = viewUtilities.getOrCreateListInElement(parentNode);
				var childNode = $(taskNodeTemplate(newTask.toJSON()));
				$(listElement).append(childNode);
			},
			taskTitleChanged: function(task) {
				
			}
		});

		return taskList;
	});