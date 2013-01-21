/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
define(['app/vent'], function(vent) {
	var workspace = Backbone.Router.extend({
		routes: {
			"task/:taskId": "gotoTask",    
			"addTo/:parentTaskId": "addToTask"
		},


		gotoTask: function (taskId) {
			console.log("gotoTask :in " + taskId);
			vent.trigger("task:idSelected", taskId);
		},
		addToTask: function (parentTaskId) {
			console.log("addToTask :in " + parentTaskId);
			vent.trigger("task:addToParent", parentTaskId);
		}
	});
	return workspace;
});