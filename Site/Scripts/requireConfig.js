var myAppHoldRequireConfig = require = {
	baseUrl: 'Scripts',
	paths: {
		jquery: 'jquery-1.8.2.min',
		'jquery.mobile-config': 'jquery.mobile-config',
		'jquery.mobile': 'jquery.mobile-1.3.0.min',
		handlebars: 'Handlebars',
		underscore: 'underscore',
		backbone: 'backbone',
		backboneLocalStorage: 'backbone-localStorage',
		marionette: 'backbone.marionette.min',
		bootstrap: 'bootstrap/js/bootstrap.min',
		tinyMCE: 'tinyMce/tiny_mce',
		syncObject: 'app/localDal',
		replicationDal: 'app/googleSync/googleSync',
		localDal: 'app/localDal'
	},
	shim: {
		//'backbone-localStorage': ['backbone'],
		underscore: {
			exports: '_'
		},
		jquery: {
			exports: '$'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['underscore']
		},
		backboneLocalStorage: {
			deps: ['backbone'],
			exports: 'Backbone'
		},
		'jquery.mobile-config': ['jquery'],
		'jquery.mobile': ['jquery', 'jquery.mobile-config'],
		hbs: {
			exports: 'hbs',
			deps: ['handlebars', 'hbs/underscore', 'require']
		},
		marionette: {
			deps: ['backbone','underscore', 'jquery']
		},
		bootstrap: ['jquery'],
		tinyMCE: ['jquery']
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