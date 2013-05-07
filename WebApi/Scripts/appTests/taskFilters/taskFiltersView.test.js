/// <reference path="../amdQunit.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
module("TaskFilters View Tests");


amdTest("Apply button clicked | | filtersApply event", 1, ["app/TaskFilters/taskFiltersView"], function(viewType) {
	var view = new viewType();
	view.setElement($("<div id='taskFilters'></div>"));
	view.render();
	view.on("applyFilters", function() {
		ok(true);
	});
	var button = view.$el.find("#filtersApply").first();
	button.trigger("click");
});


amdTest("GetFilters| Default values (Now,Next,Soon,Later) checked | Returns filter containing Now,Next,Soon,Later"
	, 1
	, ["app/taskFilters/taskFiltersView"]
	, function (viewType) {
		var view = new viewType();
		view.setElement($("<div id='taskFilters'></div>"));
		view.render();
		var filter = view.getFilters();
		var expectedWhenFilter = ["Now", "Next", "Soon", "Later"];
		deepEqual(filter.when, expectedWhenFilter);
	}
);


amdTest("GetFilters| Default value (Action Pending) checked | Returns filter containing ActionPending"
	, 1
	, ["app/taskFilters/taskFiltersView"]
	, function (viewType) {
		var view = new viewType();
		view.setElement($("<div id='taskFilters'></div>"));
		view.render();
		var filter = view.getFilters();
		var expectedStateFilter = ["Action Pending"];
		deepEqual(filter.status, expectedStateFilter);
	}
);


amdTest("GetFilters| Default value (Work) checked | Returns filter containing Work"
	, 1
	, ["app/taskFilters/taskFiltersView"]
	, function (viewType) {
		var view = new viewType();
		view.setElement($("<div id='taskFilters'></div>"));
		view.render();
		var filter = view.getFilters();
		var expectedWhereFilter = ["Work"];
		deepEqual(filter.where, expectedWhereFilter);
	}
);


amdTest("GetFilters| No checkboxes checked | Returns filter containing empty array"
	, 1
	, ["app/taskFilters/taskFiltersView"]
	, function (viewType) {
		var view = new viewType();
		view.setElement($("<div id='taskFilters'></div>"));
		view.render();
		view.$el.find("#checkWork").attr("checked", false);
		var filter = view.getFilters();
		var expectedWhereFilter = [];
		deepEqual(filter.where, expectedWhereFilter);
	}
);