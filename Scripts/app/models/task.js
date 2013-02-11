/// <reference path="../utilities.js"/>
define(['backbone', 'app/utilities'], function (backbone, appUtilities) {
	var task = backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			description: '',
			children: []
		},
		initialize: function() {
			this.set("id", appUtilities.CreateGuid());
			// Couldn't figure out why, but previous children where being
			// cloned into attribute.
			this.set("children", []); 
		},
		destroy: function() {
			// No events to unhook yet.
		}
	});
	return task;
});