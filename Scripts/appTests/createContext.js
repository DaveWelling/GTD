/// <reference path="../underscore.js"/>
/// <reference path="../require.js"/>


// http://stackoverflow.com/questions/11439540/how-can-i-mock-dependencies-for-unit-testing-in-requirejs
function createContext(stubs) {

	QUnit.config.autostart = false;
	var map = {};

	_.each(stubs, function (value, key) {
		var stubname = 'stub' + key;

		map[key] = stubname;
	});


	var context = require.config({
		baseUrl: 'Scripts',
		paths: {
			jquery: 'jquery-1.8.2.min',
			handlebars: 'Handlebars',
			underscore: 'underscore',
			backbone: 'backbone.min',
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
		context: Math.floor(Math.random() * 1000000),
		map: {
			"*": map
		}
	});

	_.each(stubs, function (value, key) {
		var stubname = 'stub' + key;

		define(stubname, function () {
			return value;
		});

	});

	return context;

}