/// <reference path="../../qunit.js"/>
/// <reference path="../../require.js"/>
module("proof of concept");

test("trivial test", function() {
	ok(true, "this test will always pass");
});

test("failing test", function() {
	ok(false, "this test will always fail");
});

test("whatever", function() {
	ok(true, "whatever");
});
require(["app/taskList/taskListView"], function(view) {
	module("inside require");
	test("require trivial test", function() {
		ok(true, "this will pass inside require");
	});
});