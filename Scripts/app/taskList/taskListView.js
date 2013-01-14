/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
define(['backbone', 'hbs!app/taskList/taskListTemplate', 'underscore'], function (backbone, taskListTemplate, _) {
	var taskList = null;
	var selectedItem = null;
	
	var findElementWithTaskId = function($unorderedList, taskId) {
		var $listElements = $unorderedList.children;
		var found = _.filter($listElements, function (listElement) { return listElement.attributes['data-taskid'].value == taskId; });
		if (found.length == 0) {
			throw { error: "No tasks found", message: "No tasks were found with ID = " + taskId };
		}
		return found[0];
	};
	
	taskList = backbone.View.extend({
		el: "#hierarchy",
		render: function() {
			var js = this.collection.toJSON();
			// create view using handlebars template
			var list = taskListTemplate({ tasks: js });
			// add to hierarchy element
			this.$el.html(list);
		},
		taskSelected: function (task) {
			var $unorderedList = this.$el.children('ul')[0];
			var item  = findElementWithTaskId($unorderedList, task.id);
			if (selectedItem != null) {
				$(selectedItem).removeClass("selectedTask");
			}
			$(item).addClass("selectedTask");
			selectedItem = item;
		}
	});

	return taskList;
});