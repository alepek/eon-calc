// Gumby is ready to go
Gumby.ready(function() {
	console.log('Gumby is ready to go...', Gumby.debug());

	// placeholder polyfil
	if(Gumby.isOldie || Gumby.$dom.find('html').hasClass('ie9')) {
		$('input, textarea').placeholder();
	}
});

// Oldie document loaded
Gumby.oldie(function() {
	console.log("This is an oldie browser...");
});

// Touch devices loaded
Gumby.touch(function() {
	console.log("This is a touch enabled device...");
});

// Document ready
$(function() 
{
	// global stuff that doesn't change.
	GC = {};
	GC.SwitchingPanes = false;

	GC.AllNavButtons = jQuery(".toolbarHeading");
	GC.HomeButton = jQuery(".toolbarHeading.home");
	GC.CalculatorButton = jQuery(".toolbarHeading.calculator");
	GC.AllPanes = jQuery(".pagePane")
	GC.CalculatorPane = jQuery(".calculatorPane");
	GC.HomePane = jQuery(".homePane");

	GC.HomeButton.click(function()
	{
		switchPanes(jQuery(this));
	});
	GC.CalculatorButton.click(function()
	{
		switchPanes(jQuery(this));
	});
});


switchPanes = function(targetPaneButton)
{
	if(GC.SwitchingPanes)
		return;

	if(targetPaneButton.hasClass("active"))
	{
		return;
	}
	else
	{
		GC.SwitchingPanes = true;
		GC.AllNavButtons.removeClass("active");
		targetPaneButton.addClass("active");
		var index = targetPaneButton.parent().index();

		// all aboard the anonymous function train! Choo choo!
		GC.AllPanes.each(function()
		{
			// there can be only one visible at this point.
			var targetPane = jQuery(this);
			if(targetPane.is(":visible"))
			{
				targetPane.fadeOut(function()
				{
					targetPane.parent().find(".pagePane:eq("+index+")").fadeIn(function()
					{
						GC.SwitchingPanes =false;
					});
				});
			}
		});
	}
}

