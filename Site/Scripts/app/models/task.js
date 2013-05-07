/// <reference path="../utilities.js"/>
/// <reference path="../constants.js"/>
define(['backbone', 'app/utilities', 'syncMethod'], function (backbone, appUtilities, syncMethod) {
	var task = backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: 'new task',
			description: '',
			children: [],
			status: "Action Pending",
			when: "Soon",
			where: "Work",
			lastPersisted: AppConstants.EndOfTime
		},
		initialize: function () {
			if (this.get("id") == null) {
				this.set("id", appUtilities.CreateGuid());
			}
			if (this.get("children") == null) {
				this.set("children", []);
			}
		},
		sync: syncMethod,
		//url: AppConstants.Url,
		isNew: function() {
		    return this.get("lastPersisted") == AppConstants.EndOfTime;
		}
	});
	return task;
});