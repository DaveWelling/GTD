/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
define(['jquery','backbone', 'underscore'], function ($, backbone, _) {
	var taskDescriptions = null;
	var editor;
	var taskInput;
	taskDescriptions = backbone.View.extend({
		el: "#descriptionsContainer",
		initialize: function () {
			var that = this;
			editor = this.$el.find("#taskLongDescription").first()[0].textEditor;
			taskInput = this.$el.find("#taskEntryInput")[0];
			$(editor).on("change", function(e) {
				that.model.set("description", editor.getValue());
			});
		},
		render: function() {
			taskInput.value = this.model.get("title");
			editor.setValue(this.model.get("description"));
		},
		//events: {
		//	'click li': 'raiseTaskSelected',
		//},
		taskSelected: function (task) {
			this.model = task;
			this.render();
		}
	});

	return taskDescriptions;
});