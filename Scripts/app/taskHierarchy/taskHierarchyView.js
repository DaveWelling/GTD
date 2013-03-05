define(['backbone', 'underscore', 'app/eventSink', 'app/viewUtilities', 'marionette', 'app/taskHierarchy/transformToTreeView'],
	function (backbone, _, sink, viewUtilities, marionette, transformToTreeView) {
		// The recursive tree view
		var TreeView = Backbone.Marionette.CompositeView.extend({
			template: "#node-template",
			tagName: "li",
			itemViewContainer: "ul",

			initialize: function () {
				// grab the child collection from the parent model
				// so that we can render the collection as children
				// of this parent node
				var task = this.model;
				var tasks = this.model.collection;
				this.collection = tasks.getSubcollection(task.get("children"));
			},

			onRender: function () {
				if (_.isUndefined(this.collection)) {
					this.$("ul:first").remove();
				}
				transformToTreeView(this.$el);
				$("#hierarchy").html(this.$el);
			},
			events: {
				"click .taskAdd": "addTaskToParentRequest"
			},
			addTaskToParentRequest: function (args) {
				var parentNode = args.target.parentNode;
				var parentTaskId = parentNode.getAttribute('data-taskId');
				sink.trigger("task:addToParent", parentTaskId);
			},
			getSelectedTaskElement: function () {
				var foundTask;
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
				//var parentNode = findParentNode(this, parentTask.id);
				//var listElement = viewUtilities.getOrCreateListInElement(parentNode);
				//var childNode = $(taskNodeTemplate(newTask.toJSON()));
				//$(listElement).append(childNode);
			},
			taskTitleChanged: function (task) {

			}
		});


		return TreeView;
	});