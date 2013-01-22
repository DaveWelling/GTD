var require = {
	baseUrl: 'Scripts',
	paths: {
		jquery: 'jquery-1.8.2.min',
		handlebars: 'Handlebars',
		underscore: 'underscore',
		backbone: 'backbone.min',
		controller: 'app/taskList/taskListController',
		kendo: 'kendo/2012.3.1114/kendo.web.min'
	},
	shim: {
		'backbone-localStorage': ['backbone'],
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['underscore']
		},
		hbs: {
			exports: 'hbs',
			deps: ['handlebars', 'hbs/underscore']
		},
		kendo: {
			exports: 'kendo',
			deps: ['jquery']
		}
	},
	deps: ['jquery'],
	hbs: {
		disableI18n: true,        // This disables the i18n helper and
		// doesn't require the json i18n files (e.g. en_us.json)
		// (false by default)

		disableHelpers: true,     // When true, won't look for and try to automatically load
		// helpers (false by default)

		helperPathCallback:       // Callback to determine the path to look for helpers
			function (name) {       // ('/template/helpers/'+name by default)
				return 'cs!' + name;
			},

		templateExtension: "html" // Set the extension automatically appended to templates
		// ('hbs' by default)
	}
};