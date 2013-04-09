/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../../tinyMce/tiny_mce.js"/>

define(['jquery', 'backbone', 'underscore', 'app/eventSink', 'hbs!app/taskFilters/taskFiltersTemplate', 'tinyMCE']
	, function ($, backbone, _, sink, template) {
		var loadTemplate = function ($el, view) {
			var content = template();
			$el.html(content);
			$el.trigger("create");
			var applyButton = $el.find("#filtersApply").first();
			//applyButton.on("click", view.applyFilters, view);
			applyButton.click(function() {
				_.bind(view.applyFilters, view);
				view.applyFilters();
			});
		};
		var taskFilters = backbone.View.extend({
			el: "#taskFilters",
			//events: {
			//	"click #filtersApply": "applyFilters"
			//},
			render: function () {
				loadTemplate(this.$el, this);
			},
			applyFilters: function() {
				this.trigger("applyFilters");
			},
			getFilters: function () {
				// Get checked input checkboxes for each filter category
				var $whenInputs = this.$el.find("#checkWhen input[type='checkbox'][checked='checked']");
				var $stateInputs = this.$el.find("#checkState input[type='checkbox'][checked='checked']");
				var $whereInputs = this.$el.find("#checkWhere input[type='checkbox'][checked='checked']");
				// pluck out the value attributes from the input checkboxes
				return {
					status: _.pluck($stateInputs, "value"),
					when: _.pluck($whenInputs, "value"),
					where: _.pluck($whereInputs, "value")
				};
			}
		});

		return taskFilters;
	});