/// <reference path="../require.js"/>
/// <reference path="../backbone.min.js"/>
/// <reference path="../jquery-1.8.2.js"/>
/// <reference path="../underscore.js"/>
/// <reference path="../jquery.mobile-1.3.0.js"/>
define(['app/eventSink','jquery.mobile'], function (sink,jqm) {
	var workspace = Backbone.Router.extend({
		routes: {
			"task/:taskId": "gotoTask",
			"task": "showDetails",
			"hierarchyPage": "showHierarchyPage",
			"filters": "showFiltersPage"
		},


		gotoTask: function (taskId) {
			console.log("gotoTask :in " + taskId);
			jqm.changePage("#task");
			sink.trigger("router:taskIdSelected", taskId);
		},
		showDetails: function() {
			jqm.changePage("#task");
		},
		showHierarchyPage: function() {
			jqm.changePage("#hierarchyPage");
		},
		showFiltersPage: function() {
			jqm.changePage("#filters");
		}
			
	});
	return workspace;
});