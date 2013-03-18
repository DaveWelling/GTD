/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../../tinyMce/tiny_mce.js"/>

define(['jquery','backbone', 'underscore', 'app/eventSink'], function ($, backbone, _, sink) {
	var taskDescriptions = backbone.View.extend({
		el: "#descriptionsContainer",
		initialize: function () {
			this.editor = tinyMCE.get('taskLongDescription');
			this.editor.onChange.add(this.taskDescriptionChanged, this);
		},
		events: {
			"change #taskTitleInput": "taskTitleChanged"
		},
		editor: null,
		render: function () {
			
			this.editor.setContent(this.model.get("description"));
			
			var $taskInput = this.$el.find("#taskTitleInput");
			$taskInput.val(this.model.get("title"));
			$taskInput[0].select();
		},
		taskDescriptionChanged: function () {
			this.model.set("description", this.editor.getContent());
			this.model.save();
		},
		taskTitleChanged: function(args) {
			this.model.set("title", args.target.value);
			this.model.save();
		},
		taskSelected: function (task) {
			this.model = task;
			this.render();
		}
	});

	return taskDescriptions;
});