/// <reference path="../../backbone.min.js"/>
/// <reference path="../../jquery-1.8.2.min.js"/>
define(['underscore', 'backbone', 'app/models/task']
	, function (_, backbone, taskType) {

		var subTasks = backbone.Collection.extend({
			// Reference to this collection's model.
			model: taskType,
			create: function() {
				throw new Error("Create is not supported for the subTasks collection.");
			}
		});
		return subTasks;
	});