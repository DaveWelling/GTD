/// <reference path="~/Scripts/require.js"/>
/// <reference path="../../backbone.marionette.js"/>
/// <reference path="../../jasmine/jasmine.js"/>
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define(['app/vent'], function (vent) {
	describe("Adding Tasks", function () {
		it("puts cursor in task description", function () {
			
		});
		it("empties task description", function () {
		});
		it("empties task detail", function () {
		});
		it("defaults task characteristics to those of parent task", function () {
		});
		it("if no parent, adds default characteristics to task", function () {
		});
		it("adds task to Next Actionable Item list and removes parent from that list", function () {
		});
	});
});