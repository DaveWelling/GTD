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
		},
		events: {
			"change #taskTitleInput": "taskTitleChanged",
			"change input[type='radio']": "tagOrStateChange"
		},
		editor: null,
		render: function () {
			if (this.editor === null) {
				tinyMCE.onAddEditor.add(function(mgr, ed) {
					this.editor = ed;
					this.editor.onChange.add(this.taskDescriptionChanged, this);
					this.editor.onInit.add(function() {
						ed.setContent(this.model.get("description"));
					}, this);
				}, this);
				tinyMCE.init({
					mode: "textareas",
					theme: "simple",
				});
			} else {
				this.editor.setContent(this.model.get("description"));
			}
			
			var $taskInput = this.$el.find("#taskTitleInput");
			$taskInput.val(this.model.get("title"));
			$taskInput[0].select();
		},
		tagOrStateChange: function() {
			
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