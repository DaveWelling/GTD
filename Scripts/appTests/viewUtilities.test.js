/// <reference path="qunit.js"/>
/// <reference path="createContext.js"/>

module("View Utilities Tests", {
	setup: function() {
		this.ctxt = new CreateContext({});
	}
});

test("getOrCreateListInElement noList createsList", function () {
	expect(1);
	stop(1000);
	this.ctxt(['app/viewUtilities'], function (viewUtilities) {
		var parentElement = document.createElement("div");
		viewUtilities.getOrCreateListInElement(parentElement);
		ok(parentElement.firstChild.tagName == 'UL', "getOrCreateListInElement should create an unordered list if none exists in passed element");
		start();
	});
});

test("getOrCreateListInElement hasList returnsList", function () {
	expect(1);
	stop(1000);
	this.ctxt(['app/viewUtilities'], function (viewUtilities) {
		var parentElement = document.createElement("div");
		var list = document.createElement("ul");
		list.setAttribute("id", "testid");
		$(parentElement).append(list);
		var actualList = viewUtilities.getOrCreateListInElement(parentElement);
		equal(actualList.id, list.id, "getOrCreateListInElement should return an unordered list if it exists already in the parent.");
		start();
	});
});