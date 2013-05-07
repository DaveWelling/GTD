define(function () {
	var transformToTreeView = function ($el) {
		var hasChildren = $el.children('ul').children().length > 0;
		if (!hasChildren) {
			$el.addClass('selectedimage');
		} else {
			$el.addClass('minusimageapply');
			//$el.children('ul').hide();
			$el.click(function (event) {
				if (this == event.target) {
					if ($(this).is('.plusimageapply')) {
						$(this).children('ul').show();
						$(this).removeClass('plusimageapply');
						$(this).addClass('minusimageapply');
					} else {
						$(this).children('ul').hide();
						$(this).removeClass('minusimageapply');
						$(this).addClass('plusimageapply');
					}
				}
			});
		}
	};
	return transformToTreeView;
});