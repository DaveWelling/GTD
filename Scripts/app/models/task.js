/// <reference path="../utilities.js"/>
define(['backbone', 'app/utilities'], function (backbone, appUtilities) {
	var task = backbone.Model.extend({
		idAttribute: "Id",
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: 'new task',
			description: '',
			children: []
		},
		initialize: function () {
			if (this.get("Id") == null) {
				this.set("Id", appUtilities.CreateGuid());
			}
			if (this.get("children") == null) {
				this.set("children", []);
			}
		},
		url: "http://localhost/IntegrityGtdData/api/Taskapi"
	});
	return task;
});