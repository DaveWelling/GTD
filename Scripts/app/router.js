/// <reference path="../require.js"/>
/// <reference path="../backbone.min.js"/>
/// <reference path="../jquery-1.8.2.js"/>
/// <reference path="../underscore.js"/>
define(['app/eventSink'], function (sink) {
	var workspace = Backbone.Router.extend({
		routes: {
			"task/:taskId": "gotoTask"
		},


		gotoTask: function (taskId) {
			console.log("gotoTask :in " + taskId);
			sink.trigger("task:idSelected", taskId);
		}
	});
	return workspace;
});