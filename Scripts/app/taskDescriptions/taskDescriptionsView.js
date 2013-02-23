/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
define(['jquery','backbone', 'underscore', 'app/eventSink'], function ($, backbone, _, sink) {
	var taskDescriptions = backbone.View.extend({
		el: "#descriptionsContainer",
		initialize: function () {
			
		},
		events: {
			"change #taskInput":  "taskTitleChanged"
		},
		render: function () {
			var editor = this.$el.find("#taskLongDescription").first()[0].textEditor;
			editor.setValue(this.model.get("description"));
			// workaround since kendo does not allow overriding context
			// on event bindings.
			var handlerInstance = new this.LongDescriptionChanged(this);
			editor.bind("change", handlerInstance.proxy);
			var taskInput = this.$el.find("#taskTitleInput")[0];
			taskInput.value = this.model.get("title");
			taskInput.select();
		},
		taskSelected: function (task) {
			this.model = task;
			this.render();
		},
		taskTitleChanged: function() {
			sink.trigger("task:titleChanged", this.model);
		},
		LongDescriptionChanged: function (view) {
			// workaround since kendo does not allow overriding context
			// on event bindings (so this = kendo object instead of view).
			// LongDescriptionChanged must be constructed and proxy
			// should be used as the actual callback function.
			var editor = view.$el.find("#taskLongDescription").first()[0].textEditor;
			this.proxy = function() {
				view.model.set("description", editor.getValue());
			};
		}
	});

	return taskDescriptions;
});