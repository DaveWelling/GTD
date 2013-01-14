/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
define(['backbone'], function() {
	var vent = null;
	var that = this;
	var workspace = Backbone.Router.extend({
		initialize: function(options) {
			that.vent = options.vent;
		},
		routes: {
			"task/:taskId": "gotoTask",    
			"addTo/:parentTaskId": "addToTask"
		},


		gotoTask: function (taskId) {
			console.log("gotoTask :in " + taskId);
			that.vent.trigger("task:idSelected", taskId);
		},
		addToTask: function (parentTaskId) {
			console.log("addToTask :in " + parentTaskId);
		}
	});
	return workspace;
});