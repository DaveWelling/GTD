/// <reference path="qunit.js"/>
/// <reference path="../require.js"/>
/// <reference path="../underscore.min.js"/>
/// <reference path="sinon-1.4.2.js"/>

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
amdTestTimeout = 5000;

// add sinon stuff for mocking, spies, etc.
sinon.assert.fail = function (msg) {
	QUnit.ok(false, msg);
};

sinon.assert.pass = function (assertion) {
	QUnit.ok(true, assertion);
};

sinon.config = {
	injectIntoThis: false,
	injectInto: null,
	properties: ["spy", "stub", "mock", "sandbox", "assert"],
	useFakeTimers: false,
	useFakeServer: false
};

(function (global) {
	QUnit.amdTestWithObject = function(config) {
		
	};
	QUnit.amdTest = QUnit.amdTestWithObject = function(testDescription, numberExpectedAssertions, amdDependencies, testFunction, dependencyStubs) {


		if (typeof testDescription !== 'string') {
			var testConfig = testDescription;
			testDescription = testConfig.testDescription;
			numberExpectedAssertions = testConfig.numberExpectedAssertions;
			amdDependencies = testConfig.amdDependencies;
			testFunction = testConfig.testFunction;
			dependencyStubs = testConfig.dependencyStubs;
		}

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
			var testRequireContext = require.config(contextConfig);

			_.each(stubs, function(value, key) {
				var stubname = 'stub' + key;

				define(stubname, function () {
					return value;
				});

			},this);

			testRequireContext([],function () {
				// claim stubs defined above for this test context;
				// see https://github.com/jrburke/requirejs/issues/237 for more info.
			});
			
			return testRequireContext;
		}

		if (typeof dependencyStubs === 'undefined') {
			dependencyStubs = {};
		}

		var ctxt = createContext(dependencyStubs);

		test(testDescription, function() {
			expect(numberExpectedAssertions);
			stop(amdTestTimeout);
			var that = this;
			
			// sinon stuff
			var config = sinon.getConfig(sinon.config);
			config.injectInto = that;
			var sandbox = sinon.sandbox.create(config);
			
			ctxt(amdDependencies, function() {
				try {
					testFunction.apply(that, arguments);
				} catch(e) {
					throw e;
				} finally {
					start();
					sandbox.verifyAndRestore();
				}
			});
		});
	};
	global.amdTest = QUnit.amdTest;
}(this));