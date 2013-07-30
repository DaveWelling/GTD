define(['backbone', 'underscore', 'app/eventSink', 'app/viewUtilities', 'marionette', 'app/taskHierarchy/transformToTreeView', 'hbs!app/taskHierarchy/taskHierarchyTemplate'],
	function (backbone, _, sink, viewUtilities, marionette, transformToTreeView, template) {
		// The recursive tree view
		var TreeView = Backbone.Marionette.CompositeView.extend({
			template: function(task) {
				return template(task);
			},
			tagName: "li",
			itemViewContainer: "ul",

			initialize: function(controller) {
				if (typeof this.model != 'undefined') {
					var task = this.model;
					task.on("change:title", this.taskTitleChanged, this);
				};
				this.controller = controller;
			},
			onCompositeModelRendered: function() {
				this.collection = this.rootCollection.getSubcollection(this.model);
				this.collection.on("add", this.render, this);
				this.collection.on("remove", this.render, this);
			},
			onRender: function() {
				if (_.isUndefined(this.collection)) {
					this.$("ul:first").remove();
				}
				transformToTreeView(this.$el);
				var plusButton = this.$el[0].children[0].children[1];
				$(plusButton).on("click", this.addNewTaskToParentRequest);
			},
			addNewTaskToParentRequest: function(args) {
				var parentNode = args.target.parentNode;
				var parentTaskId = parentNode.getAttribute('data-taskId');
				this.controller.addNewTaskToParent(parentTaskId);
			},
			getSelectedTaskElement: function() {
				var foundTask;
				if (typeof this.$el != 'undefined') {
					foundTask = this.$el.find(".selectedTask");
					if (foundTask.length > 0) {
						return _.first(foundTask);
					}
				}
				return null;
			},
			taskSelected: function(task) {
				var findString = "[data-taskId='" + task.id + "']";
				var item = this.$el.find(findString);
				var selectedItem = this.getSelectedTaskElement();
				if (selectedItem != null) {
					$(selectedItem).removeClass("selectedTask");
				}
				$(item).addClass("selectedTask");
			},
			taskTitleChanged: function(task) {
				var findString = "[data-taskId='" + task.id + "']";
				var $item = this.$el.find(findString);
				$item[0].children[0].textContent = task.get("title");
			}
		});
		TreeView.prototype.rootCollection = null;

		return TreeView;
	});