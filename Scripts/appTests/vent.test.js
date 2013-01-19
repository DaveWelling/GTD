/// <reference path="../require.js"/>
/// <reference path="../backbone.marionette.js"/>
/// <reference path="../jasmine/jasmine.js"/>
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define([], function () {
	describe("Event Aggregator Tests", function () {
		it("returns the same vent instance in multiple require calls", function () {
			var testobj = { someProperty: "someValue" };
			var vent1 = require('app/vent');
			var vent2 = require('app/vent');
			vent2.bindTo(vent2, 'testEvent', function(arg) {
				expect(arg).toBe(testobj);
			});
			vent1.trigger("testEvent", testobj);
		});
	});
});