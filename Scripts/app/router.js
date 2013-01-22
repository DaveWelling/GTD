/// <reference path="../require.js"/>
/// <reference path="../backbone.min.js"/>
/// <reference path="../jquery-1.8.2.js"/>
/// <reference path="../underscore.js"/>
define(['app/eventSink'], function (sink) {
	var workspace = Backbone.Router.extend({
		routes: {
			"task/:taskId": "gotoTask",    
			"addTo/:parentTaskId": "addToTask"
		},


		gotoTask: function (taskId) {
			console.log("gotoTask :in " + taskId);
			sink.trigger("task:idSelected", taskId);
		},
		addToTask: function (parentTaskId) {
			console.log("addToTask :in " + parentTaskId);
			sink.trigger("task:addToParent", parentTaskId);
		}
	});
	return workspace;
});