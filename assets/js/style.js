$(function() {
	var settings = $("#settingsPanel");
	var legal = $("#legalPanel");
	var credits = $("#creditsPanel");
	
	$("#settingsButton").on("click", function() {
		settings.removeClass("hidden");
		legal.addClass("hidden");
		credits.addClass("hidden");
	});
	
	$("#legalButton").on("click", function() {
		settings.addClass("hidden");
		legal.removeClass("hidden");
		credits.addClass("hidden");
	});
});
