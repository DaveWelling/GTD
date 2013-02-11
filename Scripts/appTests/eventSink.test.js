module("Event Sink Tests", {
	setup: function() {
		QUnit.config.testTimeout = 3000;
	}
});

asyncTest("returns the same instance in multiple require calls", function () {
	require(['app/eventSink'], function() {
		var testobj = { someProperty: "someValue" };
		var sink1 = require('app/eventSink');
		var sink2 = require('app/eventSink');
		sink2.on('testEvent', function(arg) {
			same(arg, testobj);
		});
		sink1.trigger("testEvent", testobj);
		sink2.off('testEvent');
		start();
	});
});
 
asyncTest("does not fire when unbound", function() {
	require(['app/eventSink'], function() {
		var sink = require('app/eventSink');
		var callCount = 0;
		sink.on('testEvent', function () {
			callCount++;
			equal(callCount, 1);
		});
		sink.trigger("testEvent");
		sink.off('testEvent');
		sink.trigger("testEvent");
		start();
	});
});

