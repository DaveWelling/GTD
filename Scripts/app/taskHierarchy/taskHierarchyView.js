define(['backbone', 'underscore', 'app/eventSink', 'app/viewUtilities', 'marionette', 'app/taskHierarchy/transformToTreeView'],
	function (backbone, _, sink, viewUtilities, marionette, transformToTreeView) {
		// The recursive tree view
		var TreeView = Backbone.Marionette.CompositeView.extend({
			template: "#node-template",
			tagName: "li",
			itemViewContainer: "ul",

			initialize: function() {
				// grab the child collection from the parent model
				// so that we can render the collection as children
				// of this parent node
				var task = this.model;
				//task.on("change:children", this.taskChildrenChanged, this);
				task.on("change:title", this.taskTitleChanged, this);

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
				$(plusButton).on("click", this.addTaskToParentRequest);
			},
			addTaskToParentRequest: function(args) {
				var parentNode = args.target.parentNode;
				var parentTaskId = parentNode.getAttribute('data-taskId');
				sink.trigger("task:addToParent", parentTaskId);
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