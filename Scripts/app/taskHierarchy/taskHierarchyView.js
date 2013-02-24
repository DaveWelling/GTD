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
				this.collection = this.model.nodes;
			},

			onRender: function () {
				if (_.isUndefined(this.collection)) {
					this.$("ul:first").remove();
				}
				transformToTreeView(this.$el);
			}
		});

		// The tree's root: a simple collection view that renders 
		// a recursive tree structure for each item in the collection
		var TreeRoot = Backbone.Marionette.CollectionView.extend({
			tagName: "ul",
			itemView: TreeView
		});



		// ----------------------------------------------------------------
		// Below this line is normal stuff... models, templates, data, etc.
		// ----------------------------------------------------------------
		var treeData = [
		  {
		  	nodeName: "top level 1",
		  	nodes: [
			  {
			  	nodeName: "2nd level, item 1",
			  	nodes: [
				  { nodeName: "3rd level, item 1" },
				  { nodeName: "3rd level, item 2" },
				  { nodeName: "3rd level, item 3" }
			  	]
			  },
			  {
			  	nodeName: "2nd level, item 2",
			  	nodes: [
				  { nodeName: "3rd level, item 4" },
				  {
				  	nodeName: "3rd level, item 5",
				  	nodes: [
						{ nodeName: "4th level, item 1" },
						{ nodeName: "4th level, item 2" },
						{ nodeName: "4th level, item 3" }
				  	]
				  },
				  { nodeName: "3rd level, item 6" }
			  	]
			  }
		  	]
		  },
		  {
		  	nodeName: "top level 2",
		  	nodes: [
			  {
			  	nodeName: "2nd level, item 3",
			  	nodes: [
				  { nodeName: "3rd level, item 7" },
				  { nodeName: "3rd level, item 8" },
				  { nodeName: "3rd level, item 9" }
			  	]
			  },
			  {
			  	nodeName: "2nd level, item 4",
			  	nodes: [
				  { nodeName: "3rd level, item 10" },
				  { nodeName: "3rd level, item 11" },
				  { nodeName: "3rd level, item 12" }
			  	]
			  }
		  	]
		  }

		];


		var TreeNode = Backbone.Model.extend({
			initialize: function () {
				var nodes = this.get("nodes");
				if (nodes) {
					this.nodes = new TreeNodeCollection(nodes);
					this.unset("nodes");
				}
			}
		});

		var TreeNodeCollection = Backbone.Collection.extend({
			model: TreeNode
		});

		var tree = new TreeNodeCollection(treeData);
		var treeView = new TreeRoot({
			collection: tree
		});

		return treeView;
	});