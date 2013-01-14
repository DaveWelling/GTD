define(['backbone', 'app/Utilities'], function(backbone, utilities) {
	var task = backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			description: '',
			state: 'new'
		},
		initialize: function() {
			this.set("id", utilities.Guid());
		}
	});
	return task;
});