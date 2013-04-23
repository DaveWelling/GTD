/// <reference path="../utilities.js"/>
define(['backbone', 'app/utilities'], function (backbone, appUtilities) {
	var task = backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: 'new task',
			description: '',
			children: [],
			status: "Action Pending",
			when: "Soon",
			where: "Work"
		},
		initialize: function () {
			if (this.get("id") == null) {
				this.set("id", appUtilities.CreateGuid());
			}
			if (this.get("children") == null) {
				this.set("children", []);
			}
		},
		url: "http://molly/IntegrityGtdData/api/Taskapi"
	});
	return task;
});