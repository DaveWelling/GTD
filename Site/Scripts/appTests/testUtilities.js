
testUtilities = window.testUtilities || {};
testUtilities.expectException = function (action, expectedMessageFragment, context) {
	try {
		if (typeof context != 'undefined') {
			action.call(context);
		} else {
			action();
		}
		ok(false, "An exception with text ('" + expectedMessageFragment + "') was expected.");
	}
	catch (err) {
		if (typeof err == "string") {
			ok(err.indexOf(expectedMessageFragment) != -1, "Error thrown: <" + err + "> should include expected message fragment: <" + expectedMessageFragment + ">.");
		}
		else {
			ok(err.message.indexOf(expectedMessageFragment) != -1, "Error thrown: <" + err.message + "> should include expected message fragment: <" + expectedMessageFragment + ">.");
		}
	};
};
String.prototype.killWhiteSpace = function () {
	return this.replace(/\s/g, '');
};
String.prototype.reduceWhiteSpace = function () {
	return this.replace(/\s+/g, ' ');
};

eitherEqual = function (expected1, expected2, expected3, actual, message) {
	var pass = ((expected1 === actual) || (expected2 === actual)) || (expected3 == actual);
	QUnit.push(pass, actual, expected1 + " OR " + expected2, message);
};


testUtilities.namespace = function (nsString) {
	var parts = nsString.split('.'), parent = testUtilities, i; // strip redundant leading global 
	if (parts[0] === "testUtilities") {
		parts = parts.slice(1);
	}
	for (i = 0; i < parts.length; i += 1) { // create a property if it doesn't exist 
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};