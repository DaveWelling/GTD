/// <reference path="../require.js"/>
/// <reference path="../backbone.min.js"/>
/// <reference path="../jasmine/jasmine.js"/>
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define(['app/eventSink'], function () {
	describe("Event Sink Tests", function () {
		it("returns the same sink instance in multiple require calls", function () {
			var testobj = { someProperty: "someValue" };
			var sink1 = require('app/eventSink');
			var sink2 = require('app/eventSink');
			sink2.on('testEvent', function (arg) {
				expect(arg).toBe(testobj);
			});
			sink1.trigger("testEvent", testobj);
			sink2.off('testEvent');
		});
		it("does not fire when unbound", function () {
			var testobj = { someProperty: "someValue" };
			var sink = require('app/eventSink');
			var callCount = 0;
			sink.on('testEvent', function () {
				callCount++;
				expect(callCount).toEqual(1);

			});
			sink.trigger("testEvent");
			sink.off('testEvent');
			sink.trigger("testEvent");
		});
	});
});