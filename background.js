var settings;
var setLoaded = false;

function isAprilFools(){
	var currentDate = new Date()
	var day = currentDate.getDate()
	var month = currentDate.getMonth() + 1
	if(month === 4 && day === 1){
		return true;
	}
	else{
		return false;
	}
}

function weirdLoader(){
	var possibleLoaders = 
	Array('http://i.imgur.com/yxkbl4x.gif',//alan
		'http://i.imgur.com/Ghdwywk.gif',//sera
		'http://i.imgur.com/OmC0Bvy.gif',//edward macaroni fork
		'http://i.imgur.com/4Dn688l.gif',//rickroll ghost
		'http://i.imgur.com/tZhnpUW.gif');//standard rickroll
	return possibleLoaders[~~(Math.random()*possibleLoaders.length)];
	//could use Math.floor, but ~~ uses the closest integer
}

function getSettings(){ //loads the user settings
	setLoaded = false;
	chrome.storage.sync.get({
		LoadingLink: 'http://i.imgur.com/QirvO9D.gif',
		Activated: true,
		Resize: true,
		MarkStaff: true,
		MarkSelf: true
	}, function(items){
		settings = items;
		if(isAprilFools()){
			settings.LoadingLink = weirdLoader();
		}
		setLoaded = true;
	});
}

function waitForGetSettings(){
	if(!setLoaded){
		getSettings();
		var counter = 0;
		while(!setLoaded){
			//do nothing?
			counter++;
			//console.log("[iX] Waited "+counter+" cycles for setting to load.");
			if(counter > 2000){
				console.log("[iX] Settings not loaded.");
				break;//emergency breakout
			}
		}
		if(setLoaded)
			console.log("[iX] Settings Loaded succesfully!");
	}
}

chrome.tabs.onUpdated.addListener(ShowPageAction);
function ShowPageAction(tabId, changeInfo, tab) {
	if (tab.url.indexOf('imgur.com') != -1) {
		chrome.pageAction.show(tabId);
		waitForGetSettings();
		if(settings.Activated){
			chrome.pageAction.setTitle({tabId: tab.id, title: 'Custom loading icons active!'});
			chrome.pageAction.setIcon({tabId: tab.id, path:'icon/16.png'});
		}
		else{
			chrome.pageAction.setTitle({tabId: tab.id, title: 'Using default imgur loading icons'});
			chrome.pageAction.setIcon({tabId: tab.id, path:'icon/16-bw.png'});
		}
	}
};

chrome.webRequest.onBeforeRequest.addListener(function(details){
	waitForGetSettings();
	if(settings.Activated&&(details.url.indexOf("loaders") != -1)){ //makes sure the extention is active, and the image we're intercepting contains "loaders" in the url
		//var res = details.url.substring(details.url.indexOf(".gif")-2,details.url.indexOf(".gif")); //gets the resolution of the gif we're replacing -use for when I have multi-res support
		chrome.tabs.sendMessage(details.tabId, {command: "doStuff().exe"});//tell the content script it's time to work its magic.
//		alert("maybe? "+details.url); //used when debugging, to let me know when it actually does anything. I know I should just log to the console, but eh, it's fine
		return {redirectUrl: settings.LoadingLink}; //finally, redirect the image loading
	}
},{urls: ["*://imgur.com/*","*://*.imgur.com/*"], types:["image"]},['blocking']);
/*
chrome.webRequest.onCompleted.addListener(function(details){
	chrome.tabs.sendMessage(details.tabId, {command: "checkComments"});
},{urls: ["*://imgur.com/*","*://*.imgur.com/*"]});
*/

chrome.pageAction.onClicked.addListener(function(tab){ //open the settings page when they click on the page action
	var optionsUrl = chrome.extension.getURL(chrome.runtime.getManifest().options_page);

	chrome.tabs.query({url: optionsUrl}, function(tabs) {
		if (tabs.length) {
			chrome.tabs.update(tabs[0].id, {active: true});
		} 
		else {
			chrome.tabs.create({url: optionsUrl});
		}
	});
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59801034-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();