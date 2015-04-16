$(function() {
	var settings = $("#settingsPanel");
	var legal = $("#legalPanel");
	var credits = $("#creditsPanel");

	$("#settingsButton").on("click", function() {
		settings.show();
		legal.hide();
		credits.addClass("hidden");
		
		$("#settingsButton").addClass("selected");
		$("#legalButton").removeClass("selected");
		$("#creditsButton").removeClass("selected");
	});

	$("#legalButton").on("click", function() {
		settings.addClass("hidden");
		legal.removeClass("hidden");
		credits.addClass("hidden");
		$("#settingsButton").removeClass("selected");
		$("#legalButton").addClass("selected");
		$("#creditsButton").removeClass("selected");
	});

	$("#creditsButton").on("click", function() {
		settings.addClass("hidden");
		legal.addClass("hidden");
		credits.removeClass("hidden");
		$("#settingsButton").removeClass("selected");
		$("#legalButton").removeClass("selected");
		$("#creditsButton").addClass("selected");
	});
});
