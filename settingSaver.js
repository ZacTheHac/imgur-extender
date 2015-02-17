var link;
var active;
var resize;
var markAdmins;
var markSelf;
var listID;
var settings;

function save_options() {
	link = document.getElementById('link').value;
	active = document.getElementById('active').checked;
	resize = document.getElementById('resize').checked;
	markAdmins = document.getElementById('markAdmins').checked;
	markSelf = document.getElementById('markSelf').checked;
	listID = document.getElementById('listIDs').checked;
	clean_link();
	chrome.storage.sync.set({
		LoadingLink: link,
		Activated: active,
		Resize: resize,
		MarkStaff: markAdmins,
		MarkSelf: markSelf,
		ListID: listID
	},setStatus('Settings Saved!')
	
	/* function() {
		var status = document.getElementById('save');
		status.textContent = 'Settings Saved!';
		status.disabled = true;
//		alert('Settings Saved!');
	setTimeout(function() {
		status.textContent = 'Save';
		status.disabled = false;
	}, 750);
	}*/);
	//chrome.tabs.sendMessage(details.tabId, {command: "SettingsChanged"});
}

function restore_options() {
	chrome.storage.sync.get({
		LoadingLink: 'http://i.imgur.com/QirvO9D.gif',
		Activated: true,
		Resize: true,
		MarkStaff: true,
		MarkSelf: true,
		ListID: false
	}, function(items) {
		settings = items;
		document.getElementById('link').value = items.LoadingLink;
		document.getElementById('active').checked = items.Activated;
		document.getElementById('resize').checked = items.Resize;
		document.getElementById('markAdmins').checked = items.MarkStaff;
		document.getElementById('markSelf').checked = items.MarkSelf;
		document.getElementById('listIDs').checked = items.ListID;
	});
}

function load_options() {
	chrome.storage.sync.get({
		LoadingLink: 'http://i.imgur.com/QirvO9D.gif',
		Activated: true,
		Resize: true,
		MarkStaff: true,
		MarkSelf: true,
		ListID: false
	}, function(items) {
		settings = items;
	});
}

function view_image() {
	clean_link();
	window.open(link);
}

function clean_link() {
	link = document.getElementById('link').value;
	if ((link.lastIndexOf(".") < link.length - 5)&&(link.indexOf("http://imgur.com/") == 0)){//it's not a direct link, but it's on imgur
		var code = link.substring(link.lastIndexOf("/")+1,link.length);
		link= "http://i.imgur.com/" + code + ".gif"; //make a proper direct link to the image
		document.getElementById('link').value = link;
	}
	else if(link.substring(link.lastIndexOf(".")+1)=='gifv'){
		var code = link.substring(link.lastIndexOf("/")+1,link.lastIndexOf("."));
		link= "http://i.imgur.com/" + code + ".gif"; //make a proper direct link to the image
		document.getElementById('link').value = link;
		setStatus("sanitizing a gifv link");
	}
	else{
		if(link.lastIndexOf(".") < link.length - 5){
			alert(link+" doesn't seem to be a direct link to the image. Please use a direct link to an image, or use an imgur (non-album) link");
		}
	}

  //to strip images out of an album: look for "class="album-image"" as for a single image, they use 'class="image textbox "'
}

function setStatus(statusText){
	var status = document.getElementById('save');
	status.textContent = statusText;
	status.disabled = true;
	setTimeout(function() {
		status.textContent = 'Save';
		status.disabled = false;
	}, 750);
}

function list() {
	window.open('http://imgur.com/a/cDYBj', '_blank');
	//document.getElementById('link').value = 'http://i.imgur.com/QirvO9D.gif';
}

function check_for_changes(){
load_options();
_gaq.push(['_trackEvent', 'loadingLink', document.getElementById('link').value]);
	if(document.getElementById('link').value != settings.LoadingLink || document.getElementById('active').checked != items.Activated || document.getElementById('resize').checked != items.Resize || document.getElementById('markAdmins').checked != items.MarkStaff || document.getElementById('markSelf').checked != items.MarkSelf){
		return true;
	}
	return false;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
document.getElementById('list').addEventListener('click',list);
document.getElementById('view').addEventListener('click',view_image);
document.getElementById('Banner').innerHTML = "Imgur Extender v"+chrome.runtime.getManifest().version;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59801034-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

window.onbeforeunload = function() {
	if(check_for_changes()){
		return "You have made unsaved changes.";
	}
}