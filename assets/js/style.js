$(function() {
	var settings = $("#settingsPanel");
	var legal = $("#legalPanel");
	var credits = $("#creditsPanel");

	$("#settingsButton").on("click", function() {
		settings.show();
		legal.hide();
		credits.hide();
		
		$("#settingsButton").addClass("selected");
		$("#legalButton").removeClass("selected");
		$("#creditsButton").removeClass("selected");
	});

	$("#legalButton").on("click", function() {
		settings.hide();
		legal.show();
		credits.hide();
		$("#settingsButton").removeClass("selected");
		$("#legalButton").addClass("selected");
		$("#creditsButton").removeClass("selected");
	});

	$("#creditsButton").on("click", function() {
		settings.hide();
		legal.hide();
		credits.show();
		$("#settingsButton").removeClass("selected");
		$("#legalButton").removeClass("selected");
		$("#creditsButton").addClass("selected");
	});
});
