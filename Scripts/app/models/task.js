/// <reference path="../Utilities.js"/>
define(['backbone', 'app/Utilities'], function (backbone, utilities) {
	var task = backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			description: '',
			children: []
		},
		initialize: function() {
			this.set("id", utilities.CreateGuid());
			// Couldn't figure out why, but previous children where being
			// cloned into attribute.
			this.set("children", []); 
		}
	});
	return task;
});