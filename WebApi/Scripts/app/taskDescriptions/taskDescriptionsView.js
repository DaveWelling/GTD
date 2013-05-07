/// <reference path="../../require.js"/>
/// <reference path="../../backbone.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../../tinyMce/tiny_mce.js"/>

define(['jquery', 'backbone', 'underscore', 'app/eventSink', 'hbs!app/taskDescriptions/taskDescriptionsTemplate', 'tinyMCE']
	, function ($, backbone, _, sink, template) {
		var loadTemplate = function ($el) {
			var content = template();
			$el.html(content);
			$el.trigger("create");
		};
		var loadTinyMce = function (view) {
			// notice the backbone view is passed in as context each time
			tinyMCE.onAddEditor.add(function (mgr, ed) {
				this.editor = ed;
				this.editor.onChange.add(this.taskDescriptionChanged, this);
				this.editor.onInit.add(function () {
					ed.setContent(this.model.get("description"));
				}, this); // <-- backbone view
			}, view); // <-- backbone view
			tinyMCE.init({
				mode: "textareas",
				theme: "simple",
			});
		};
		var setRadioValueChecked = function ($el, radioValue, radioName) {
			var $radios = $el.find('input:radio[name=' + radioName + ']');
			$radios.attr('checked', false);
			$radios.filter('[value="' + radioValue + '"]').attr('checked', true);
		};
		var taskDescriptions = backbone.View.extend({
			el: "#descriptionsContainer",
			initialize: function () {
			},
			events: {
				"change #taskTitleInput": "taskTitleChanged",
				"change input[type='radio']": "tagOrStateChange"
			},
			editor: null,
			render: function () {
				if (this.editor === null) {
					loadTemplate(this.$el);
					loadTinyMce(this);
				} else {
					this.editor.setContent(this.model.get("description"));
				}

				var $taskInput = this.$el.find("#taskTitleInput");
				$taskInput.val(this.model.get("title"));
				$taskInput[0].select();
				setRadioValueChecked(this.$el, this.model.get("status"), "state");
				setRadioValueChecked(this.$el, this.model.get("when"), "whenDetail");
				setRadioValueChecked(this.$el, this.model.get("where"), "whereDetail");
			},
			tagOrStateChange: function (event) {
				switch (event.target.name) {
					case "state":
						this.trigger("StateChanged", event.target.value);
						break;
					case "whenDetail":
						this.trigger("WhenChanged", event.target.value);
						break;
					case "whereDetail":
						this.trigger("WhereChanged", event.target.value);
						break;
					default:
						throw new Error("Unknown radio button");
				}
			},
			taskDescriptionChanged: function () {
				this.model.set("description", this.editor.getContent());
				this.model.save();
			},
			taskTitleChanged: function (args) {
				this.model.set("title", args.target.value);
				this.model.save();
			},
			taskSelected: function (task) {
				this.model = task;
				this.render();
			}
		});

		return taskDescriptions;
	});