/// <reference path="../require.js"/>
/// <reference path="../underscore.js"/>
/// <reference path="../backbone.min.js"/>

define(['underscore','backbone'], function (_) {
	return _.clone(Backbone.Events);
})