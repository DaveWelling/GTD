/// <reference path="../require.js"/>
/// <reference path="../jquery-1.8.2.min.js"/>
define(function () {
	this.viewUtilities = function() {
		this.getOrCreateListInElement = function(parentElement) {
			var list;
			var lists = $(parentElement).children('ul');
			if (lists.length == 0) {
				list = document.createElement('ul');
				$(parentElement).append(list);
				return list;
			} else {
				return lists[0];
			}
		};
	};
	return new viewUtilities();
});