/// <reference path="../qunit.js"/>
/// <reference path="../testUtilities.js"/>
/// <reference path="../../require.js"/>
/// <reference path="../sinon-1.4.2.js"/>
/// <reference path="../sinon-qunit-1.0.0.js"/>
/// <reference path="../createContext.js"/>
/// <reference path="../../jquery-1.8.2.js"/>
/// <reference path="../../backbone.min.js"/>
/// <reference path="../../app/constants.js"/>
/// <reference path="../amdQunit.js"/>

module("Task Hierarchy View Tests", {
	setup: function () {
		var that = this;
		//this.asyncShell = function(numberAssertionsExpected, testFunction) {
		//	expect(numberAssertionsExpected);
		//	stop(2000);
		//	this.ctxt(['app/taskList/taskListView', 'app/collections/tasks', 'app/eventSink'], function(viewType, tasksType, sink) {
		//		var hierarchyCollection = that.getHierarchyCollection(tasksType);
		//		var view = new viewType({ collection: hierarchyCollection });
		//		try {
		//			testFunction = _.bind(testFunction, that);
		//			testFunction(view, hierarchyCollection, sink);
		//			hierarchyCollection.destroy();
		//		} catch(e) {
		//			hierarchyCollection.destroy();
		//			throw e;
		//		}
		//		start();
		//	});
		//};
		////taskListTemplate
		//this.fakeTemplateResult = function () {
		//	var content = "<li data-taskId='" + AppConstants.RootId + "'>whatever</li>";
		//	return $(content)[0];
		//};
		//this.template = {
		//	load: function (name, req, onload, config) {
		//		that.template.loadCalled = true;
		//		onload(that.fakeTemplateResult);
		//	},
		//	loadCalled: false
		//};
		//this.stubs = {
		//	'hbs': that.template
		//};
		//this.ctxt = new CreateContext(this.stubs);
		
		this.generateTwoTierHierarchy = function () {
			var hierarchyView = $(' \
<span data-taskId="' + AppConstants.RootId + '>"> \
	<a class="taskTitle" href="#/task/' + AppConstants.RootId + '">hiearchy</a> \
	<div class="taskAdd"></div> \
</span> \
<ul> \
	<span data-taskId="firstChild"> \
		<a class="taskTitle" href="#/task/firstChild">First Child</a> \
		<div class="taskAdd"></div> \
	</span> \
	<ul> \
	</ul> \
</ul> \
');
			return hierarchyView;
		};
		this.getHierarchyCollection = function (tasksType) {
			var tasks = new tasksType();
			var firstGrandchild = new tasks.model(
				{
					Id: 3,
					title: 'firstGrandchild',
					children: []
				});
			tasks.add(tasks);
			var firstChild = new tasks.model(
				{
					Id: 2,
					title: 'firstChild',
					children: [firstGrandchild.get("Id")]
				});
			tasks.add(firstChild);
			this.root = new tasks.model(
				{
					Id: AppConstants.RootId,
					title: 'root',
					children: [firstChild.get("Id")]
				});
			tasks.add(this.root);
			return tasks;
		};
	},
	teardown: function () {
		//var hierarchy = $(document).find("#hierarchy");
		//if (hierarchy.length > 0) {
		//	document.removeChild(hierarchy[0]);
		//}
		//localStorage.clear();
	}
});



amdTest({
	testDescription: "taskAddedToParent | validTaskAndParentTask | newChildNodeAppendedToParentNode",
	numberExpectedAssertions : 1,
	amdDependencies : ["app/taskHierarchy/taskHierarchyView", "app/collections/tasks"],
	testFunction: function (viewType, tasksType) {
		var tasks = new tasksType();
		var parentTask = new tasks.model({ Id: 1, title: "test title" });
		var childTask = new tasks.model({ Id: 2, title: "test title" });
		tasks.add(parentTask);
		tasks.add(childTask);
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: parentTask });
		view.render();

		parentTask.set("children", [2]);

		equal(view.$el.find('[data-taskId=2]').length, 1);
	}
});


//test("taskAddedToParent validTaskAndParentTask newChildNodeAppendedToParentNode", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		var parentStub = hierarchyView.firstChild.firstChild;
//		view.setElement(hierarchyView);
//		var parentTaskStub = { id: '2', children: [], get: function () { return {}; } };
//		var newTaskStub = { id: '3', title: 'a new test task', toJSON: function () { return this; } };
//		view.taskAddedToParent(newTaskStub, parentTaskStub);
//		// parentstub / ul / li -> check attribute
//		equal(parentStub.firstChild.firstChild.getAttribute("data-taskId"), AppConstants.RootId, "Parent node of parent task should receive an append.");	
//	});
//});

amdTest("getSelectedTask | view Contains Selected Task | selected Task Returned",
	1,
	["app/taskHierarchy/taskHierarchyView", 'app/collections/tasks'],
	function (viewType, tasksType) {
		var tasks = this.getHierarchyCollection(tasksType);
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: tasks.get(AppConstants.RootId) });
		view.render();
		var hierarchyRoot = view.$el.find("[data-taskId='" + AppConstants.RootId + "']").first()[0];
		$(hierarchyRoot).addClass('selectedTask');
		equal(view.getSelectedTaskElement(), hierarchyRoot);
	}
);

//test("selectedTask noSelectedTask nullReturned", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
//		equal(view.getSelectedTask(), null);
//	});
//});


//test("taskSelected previousSelectedTaskExists previousSelectedClassNoLongerSelected", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
//		$(this.hierarchyRoot).addClass('selectedTask');
//		view.taskSelected(this.firstParent);
//		ok(!$(this.hierarchyRoot).hasClass('selectedTask'));
//	});
//});


//test("taskSelected previousSelectedTaskExists newTaskSelected", function () {
//	this.asyncShell(1, function (view, tasks) {
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
//		$(this.hierarchyRoot).addClass('selectedTask');
//		view.taskSelected(this.firstParent);
//		ok($(this.firstParent).hasClass('selectedTask'));
//	});
//});

amdTest({
	testDescription: "addTaskToParent | raisedByRootChild | raises Task:AddToParent with root Id",
	numberExpectedAssertions: 1,
	amdDependencies: ["app/taskHierarchy/taskHierarchyView", "app/collections/tasks", 'app/eventSink'],
	testFunction: function(viewType, tasksType, sink) {
		stop();
		var tasks = this.getHierarchyCollection(tasksType);
		viewType.prototype.rootCollection = tasks;
		var view = new viewType({ model: this.root });
		view.render();
		var target = view.$el.find(".taskAdd").first()[0];
		var fakeEventArgs = {
			target: target
		};
		sink.on("task:addToParent", function (parentTaskId) {
			equal(parentTaskId, AppConstants.RootId);
			start();
		});
		view.addTaskToParentRequest(fakeEventArgs);
	}
});

//test("addTaskToParent raisedByRootChild raises Task:AddToParent with root Id", function () {
//	this.asyncShell(1, function (view, tasks, sink) {
//		this.generateTwoTierHierarchy();
//		var fakeEventArgs = {
//			target: this.hierarchyRoot.children[0]
//		};
//		sink.on("task:addToParent", function (parentTaskId) {
//			equal(parentTaskId, AppConstants.RootId);
//		});
//		view.addTaskToParent(fakeEventArgs);
//	});
//});

//amdTest("taskTitleChanged | valid task given | corresponding hierarchy element updated",
//	1,
//	['app/taskHierarchy/taskHierarchyView', 'app/models/task'],
//	function (viewType, taskType) {
//		var testCollection = this.getHierarchyCollection();
//		var view = new viewType(testCollection);
//		var task = testCollection.models[1];
//		task.set
//		var hierarchyView = this.generateTwoTierHierarchy();
//		view.setElement(hierarchyView);
		
//	}
//);

//amdTest("model change event | new task added to children | new task renders",
//	1,
//	["app/taskHierarchy/taskHierarchyView", "app/models/task"],
//	function (viewType, taskType) {
//		stop();
//		var expectedId = 1;
//		var task = new taskType();
//		var view = new viewType({ model: task });
//		view.on("render", function() {
//			ok(true, "Expecting a render call when the children change on the view's task.");
//			start();
//		});
//		var children = task.get("children");
//		children.push(expectedId);
//		task.set("children", children);
//	}
//);