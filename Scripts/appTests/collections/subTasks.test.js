/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../underscore.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("subTasks Collection Tests");

amdTest("create | valid inputs | throws exception",
1,
["app/collections/subTasks"],
function (subTasksType) {
	var subTasks = new subTasksType();
	testUtilities.expectException(function() {
		subTasks.create({ title: "this should throw an error" });
	}, "Create is not supported");
}
);