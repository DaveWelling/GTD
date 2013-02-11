
testUtilities = window.testUtilities || {};
testUtilities.expectException = function (action, expectedMessageFragment) {
	try {
		action();
		ok(false, "An exception with text ('" + expectedMessageFragment + "') was expected.");
	}
	catch (err) {
		if (typeof err == "string") {
			ok(err.indexOf(expectedMessageFragment) != -1, "Wrong exception thrown: " + err);
		}
		else {
			ok(err.message.indexOf(expectedMessageFragment) != -1, "Wrong exception thrown: " + err.message);
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