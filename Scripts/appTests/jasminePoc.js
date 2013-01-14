if (typeof define !== 'function') {
	var define = require('amdefine')(module);
};

define([], function () {
	describe("poc", function () {
		it("compare two strings", function () {
			expect("2").toEqual("2");
		});
	});
});