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
	GC.HelpButton = jQuery(".toolbarHeading.help");
	GC.CalculatorButton = jQuery(".toolbarHeading.calculator");
	GC.AllPanes = jQuery(".pagePane")
	GC.CalculatorPane = jQuery(".calculatorPane");
	GC.HomePane = jQuery(".homePane");
	GC.DamageInput = jQuery("#damageInput");
	GC.InputWarning = jQuery("#inputWarning");
	GC.OutputArea = jQuery("#outputContainer");

	GC.crushButton = jQuery(".damageButton.crush");
	GC.pokeButton = jQuery(".damageButton.poke");
	GC.chopButton = jQuery(".damageButton.chop");

	GC.HomeButton.click(function()
	{
		switchPanes(jQuery(this));
	});
	GC.CalculatorButton.click(function()
	{
		switchPanes(jQuery(this));
	});
	GC.HelpButton.click(function()
	{
		switchPanes(jQuery(this));
	});
	GC.crushButton.click(function()
	{
		ResultUpdater.GenerateResultOutput("krosskada");
	});
	GC.pokeButton.click(function()
	{
		ResultUpdater.GenerateResultOutput("stickskada");
	});
	GC.chopButton.click(function()
	{
		ResultUpdater.GenerateResultOutput("huggskada");
	});
});


switchPanes = function(targetPaneButton)
{
	jQuery("#datGumbyTrigger").trigger("gumby.trigger");
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
				targetPane.fadeOut(100, function()
				{
					targetPane.parent().find(".pagePane:eq("+index+")").fadeIn(100, function()
					{
						GC.SwitchingPanes =false;
					});
				});
			}
		});
	}
}



ResultUpdater = 
{
	CheckDamageValue: function(string)
	{
		var isnum = /^\d+$/.test(string);
		if(!isnum)
		{
			// visa fel
			return false;
		}
		return true;
	},
	GenerateResultOutput: function(damageType)
	{
		var damageValue = GC.DamageInput.val();
		if(!ResultUpdater.CheckDamageValue(damageValue))
		{
			ResultUpdater.ShowInvalidInputWarning("Skriv in ett heltal.")
			return;
		}

		damageValue = parseInt(damageValue);
		if(damageValue > 100)
		{
			ResultUpdater.ShowInvalidInputWarning("Jag tror dig inte. Försök igen.")			
			// show invalid input warning - only gods hit this hard, and we are mere mortals.
			// also I am too lazy to design the gui properly for such huge amounts of extra damage.
			return;
		}
		// alright, let's get cracking.

		var hit = EonRules.RollForHit(damageValue);
		var mainHitArea = hit.hitArea.title;
		var subHitArea = hit.subHitArea.title;
		var extraDamages = hit.subHitArea.extraDamages;
		var firstBreak = damageValue % 10;

		GC.OutputArea.empty();
		var tc = jQuery("#templateContainer");
		var heading = tc.find(".damageHeading").clone();

		heading.find(".damageType").text(damageType);
		heading.find(".damageValue").text(damageValue);
		heading.find(".areasHit").find(".firstArea").text(mainHitArea);
		heading.find(".areasHit").find(".secondArea").text(subHitArea);

		GC.OutputArea.append(heading);
		for(var i=0; i<extraDamages.length+1; i++)
		{
			var maximum = firstBreak + i*10;
			var minimum = firstBreak + (i-1)*10 +1;
			if(minimum < 0)
				minimum = 0;
			var text = ""+minimum+" - "+maximum;

			if(i === extraDamages.length)
			{
				minimum = minimum-1;
				if(minimum < 0)
					minimum = 0;
				text = ""+minimum+"+";
			}

			var exdmg = [];
			for(var k = i; k<extraDamages.length; k++)
			{
				exdmg.push(extraDamages[k]);
			}

			var toAppend = tc.find(".intervalContainer").clone();

			toAppend.find(".armorInterval").text("RV "+text);
			toAppend.find(".damagesForInterval").append(tc.find(".basicDamage").clone());
			toAppend.find(".damagesForInterval").append("<br/>");
			for(var k=0;k<exdmg.length;k++)
			{
				var extralabel = tc.find(".extraDamageItem").clone();
				extralabel.find(".areaValue").text(exdmg[k]);
				toAppend.find(".damagesForInterval").append(extralabel);
			}
			GC.OutputArea.append(toAppend);
		}
	},
	ShowInvalidInputWarning: function(reason)
	{
		if(GC.InputWarning.is(":visible"))
			return;
		
		GC.InputWarning.find("h4").text(reason);
		GC.InputWarning.slideDown(250, function()
		{
			setTimeout(function()
			{
				GC.InputWarning.slideUp(500);
			}, 5000)
		});		
	}
}

DiceRoller = 
{
	RollD4: function(numDice, exploding)
	{
		return DiceRoller.GDR(4, numDice, exploding);
	},
	RollD6: function(numDice, exploding)
	{
		return DiceRoller.GDR(6, numDice, exploding);
	},
	RollD8: function(numDice, exploding)
	{
		return DiceRoller.GDR(8, numDice, exploding);
	},
	RollD10: function(numDice, exploding)
	{
		return DiceRoller.GDR(10, numDice, exploding);
	},
	RollD12: function(numDice, exploding)
	{
		return DiceRoller.GDR(12, numDice, exploding);
	},
	RollD20: function(numDice, exploding)
	{
		return DiceRoller.GDR(20, numDice, exploding);
	},
	RollD100: function(numDice, exploding)
	{
		return DiceRoller.GDR(100, numDice, exploding);
	},
	GDR: function(diceMax, numDice, exploding)
	{
		var rollDie = function(max, resultobject, exploding)
		{
			var rand = Math.ceil(Math.random()*max);
			resultobject.totalRolled += 1;
			resultobject.rolls.push(rand);
			if(rand === max && exploding)
			{ // explosion!
				resultobject.explosions += 1;
				return rand+rollDie(max, resultobject, exploding); 
				// Surely this recursive behavior will never betray me.
			}
			else
			{
				return rand;
			}
		}

		// this object tracks all the rolls and stuff.
		var resObj = {};
		resObj.totalRolled = 0;
		resObj.explosions = 0;
		resObj.result = 0;
		resObj.rolls = [];

		for(var i=0;i<numDice;i++)
		{
			resObj.result += rollDie(diceMax, resObj, exploding);
		}

		return resObj;
	}
};

EonRules =
{	
	GetHitAreaFromRoll: function(diceRollResult)
	{
		// this is gonny be stringly typed, due to laziness
		var H = HitAreas;
		var r = diceRollResult.result;
		if(r < 21)
			return H.head;
		if(r<41)
			return H.leftArm;
		if(r<61)
			return H.rightArm;
		if(r<71)
			return H.chest;
		if(r<81)
			return H.guts;
		if(r<91)
			return H.leftLeg;

		return H.rightLeg;
	},
	GetSubHitAreaFromRoll: function(diceRollResult, majorHitArea)
	{
		var H = HitAreas;
		var r = diceRollResult.result;

		if(majorHitArea.title === H.head.title)
		{
			if(r < 5)
				return H.head.face;
			if(r<9)
				return H.head.skull;
			return H.head.throat;
		}
		if(majorHitArea.title === H.leftArm.title)
		{
			if(r < 3)
				return H.leftArm.shoulder;
			if(r < 5)
				return H.leftArm.upperarm;
			if(r < 6)
				return H.leftArm.elbow;
			if(r < 9)
				return H.leftArm.forearm;
			return H.leftArm.hand;
		}
		if(majorHitArea.title === H.rightArm.title)
		{
			if(r < 3)
				return H.rightArm.shoulder;
			if(r < 5)
				return H.rightArm.upperarm;
			if(r < 6)
				return H.rightArm.elbow;
			if(r < 9)
				return H.rightArm.forearm;
			return H.rightArm.hand;
		}
		if(majorHitArea.title === H.chest.title)
		{
			return H.chest.chest;
		}
		if(majorHitArea.title === H.guts.title)
		{
			if(r < 9)
				return H.guts.guts;
			return H.guts.privates;
		}
		if(majorHitArea.title === H.leftLeg.title)
		{
			if(r < 3)
				return H.leftLeg.hip;
			if(r < 5)
				return H.leftLeg.thigh;
			if(r < 7)
				return H.leftLeg.knee;
			if(r < 10)
				return H.leftLeg.calf;
			return H.leftLeg.foot;
		}
		if(majorHitArea.title === H.rightLeg.title)
		{
			if(r < 3)
				return H.rightLeg.hip;
			if(r < 5)
				return H.rightLeg.thigh;
			if(r < 7)
				return H.rightLeg.knee;
			if(r < 10)
				return H.rightLeg.calf;
			return H.rightLeg.foot;
		}
	},
	RollForHit: function(damage)
	{
		var d100 = DiceRoller.RollD100(1, false);
		var d10 = DiceRoller.RollD10(1, false);

		var hitArea = EonRules.GetHitAreaFromRoll(d100);
		var subHitArea = EonRules.GetSubHitAreaFromRoll(d10, hitArea);
		var extraDamages = [];
		for(var i=0;i<Math.floor(damage/10);i++)
		{
			extraDamages.push(DiceRoller.RollD10(1,false).result);
		}
		var subhit = {};
		if(subHitArea.title)
			subhit.title = subHitArea.title;
		else
			subhit.title = subHitArea;
		subhit.extraDamages = extraDamages;
		return {hitArea:hitArea, subHitArea:subhit};
	}
};

HitAreas = {};

HitAreas.head= {};
HitAreas.head.title = "huvud";
HitAreas.head.face = {};
HitAreas.head.skull = {};
HitAreas.head.throat = {};
HitAreas.head.face.title = "ansikte"
HitAreas.head.skull.title = "skalle";
HitAreas.head.throat.title =  "hals";

HitAreas.leftArm= {};
HitAreas.leftArm.title= "vänster arm";
HitAreas.leftArm.shoulder = "vänster skuldra";
HitAreas.leftArm.upperarm=  "vänster överarm";
HitAreas.leftArm.elbow = "vänster armbåge";
HitAreas.leftArm.forearm = "vänster underarm";
HitAreas.leftArm.hand = "vänster hand";

HitAreas.rightArm= {};
HitAreas.rightArm.title = "höger arm";
HitAreas.rightArm.shoulder = "höger skuldra";
HitAreas.rightArm.upperarm=  "höger överarm";
HitAreas.rightArm.elbow = "höger armbåge";
HitAreas.rightArm.forearm = "höger underarm";
HitAreas.rightArm.hand = "höger hand";

HitAreas.chest= {};
HitAreas.chest.title = "bröstkorg";
HitAreas.chest.chest=  "bröstkorg";

HitAreas.guts= {};
HitAreas.guts.title = "mage";
HitAreas.guts.guts=  {};
HitAreas.guts.guts.title=  "mage";
HitAreas.guts.privates=  {};
HitAreas.guts.privates.title=  "underliv";

HitAreas.leftLeg= {};
HitAreas.leftLeg.title = "vänster ben";
HitAreas.leftLeg.hip = "vänster höft";
HitAreas.leftLeg.thigh = "vänster lår";
HitAreas.leftLeg.knee = "vänster knä";
HitAreas.leftLeg.calf = "vänster vad";
HitAreas.leftLeg.foot = "vänster fot";

HitAreas.rightLeg= {};
HitAreas.rightLeg.title = "höger ben";
HitAreas.rightLeg.hip = "höger höft";
HitAreas.rightLeg.thigh = "höger lår";
HitAreas.rightLeg.knee = "höger knä";
HitAreas.rightLeg.calf = "höger vad";
HitAreas.rightLeg.foot = "höger fot";
