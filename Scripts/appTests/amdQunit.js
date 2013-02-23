/// <reference path="qunit.js"/>
/// <reference path="../require.js"/>
/// <reference path="../underscore.min.js"/>

// the following should be loaded before amdQunit.js:
// qunit
// underscore
// requireConfig < your default require configuration
// require
//
// Also, I couldn't figure out a way to extract the default context
// configuration from requirejs, so you'll need to put your 
// requireConfig in a global variable: myAppHoldRequireConfig 
// So do something like this:
// var myAppHoldRequireConfig = require = {
//    baseUrl: 'Scripts',
//	  ...
// };
// I hate this, so let me know if you can think of a better way.  
amdTestTimeout = 2000;
(function (global) {
	//QUnit.config.autostart = false;
	QUnit.amdTest = function(testDescription, numberExpectedAssertions, amdDependencies, testFunction, dependencyStubs) {
		

		function createContext(stubs) {
			var map = {};

			_.each(stubs, function(value, key) {
				var stubname = 'stub' + key;
				map[key] = stubname;
			});
			
			// deep clone the existing require config
			var contextConfig = JSON.parse(JSON.stringify(myAppHoldRequireConfig));
			contextConfig.context = Math.floor(Math.random() * 1000000);
			contextConfig.map = {
				"*": map
			};
			
			// create a new require context just for our test
			var context = require.config(contextConfig);

			_.each(stubs, function(value, key) {
				var stubname = 'stub' + key;

				define(stubname, function() {
					return value;
				});

			});

			return context;
		}

		if (typeof dependencyStubs === 'undefined') {
			dependencyStubs = {};
		}

		var ctxt = createContext(dependencyStubs);

		test(testDescription, function() {
			expect(numberExpectedAssertions);
			stop(amdTestTimeout);
			var that = this;
			ctxt(amdDependencies, function() {
				try {
					testFunction.apply(that, arguments);
					start();
				} catch(e) {
					start();
					throw e;
				}
			});
		});
	};
	global.amdTest = QUnit.amdTest;
}(this));