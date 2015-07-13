var link;
var active;
var resize;
var markAdmins;
var markSelf;
var settings;

function save_options() {
	link = document.getElementById('link').value;
	active = document.getElementById('active').checked;
	resize = document.getElementById('resize').checked;
	markAdmins = document.getElementById('markAdmins').checked;
	markSelf = document.getElementById('markSelf').checked;

	clean_link();

	chrome.storage.sync.set({
			LoadingLink: link,
			Activated: active,
			Resize: resize,
			MarkStaff: markAdmins,
			MarkSelf: markSelf
		},
		function() { //this is a workaround for the fact that syncing is asynchronous, so unless your main thread is super slow, it doesn't update in time.
			settings.LoadingLink = document.getElementById('link').value;
			settings.Activated = document.getElementById('active').checked;
			settings.Resize = document.getElementById('resize').checked;
			settings.MarkStaff = document.getElementById('markAdmins').checked;
			settings.MarkSelf = document.getElementById('markSelf').checked;
			setStatus('Settings Saved!'); //I'm dumb. you can only have 1 callback function...
		}
	);
}

function restore_options() {
	chrome.storage.sync.get({
		LoadingLink: 'http://i.imgur.com/QirvO9D.gif',
		Activated: true,
		Resize: true,
		MarkStaff: true,
		MarkSelf: true,
		CustomTagNames: ['mistersavage', 'sarah', 'Lassann'],
		CustomTagTags: ['<span style="width:92px;color:#85BF25;background-color:Black;font-size:small">THE Adam Savage</span>', '<span style="width:92px;color:#85BF25;background-color:Black">SeraPls</span>', '<span style="width:92px;color:RED;background-color:Black">Lassann</span>']
	}, function(items) {
		settings = items;
		document.getElementById('link').value = items.LoadingLink;
		document.getElementById('active').checked = items.Activated;
		document.getElementById('resize').checked = items.Resize;
		document.getElementById('markAdmins').checked = items.MarkStaff;
		document.getElementById('markSelf').checked = items.MarkSelf;
		buildCustomTags(items.CustomTagNames, items.CustomTagTags);
	});
}

function load_options() {
	chrome.storage.sync.get({
		LoadingLink: 'http://i.imgur.com/QirvO9D.gif',
		Activated: true,
		Resize: true,
		MarkStaff: true,
		MarkSelf: true,
	}, function(items) {
		settings = items;
	});
}

function buildCustomTags(CTNames, CTTags) {
	var tagTable = document.getElementById("customTagsTable").children[0];
	for (var i = 0; i < CTNames.length; i++) {
		var name = CTNames[i];
		var tag = CTTags[i];
		var html = '<TR>\n<TD class="CTusername" id="CTusername' + i + '" tagnum="' + i + '"><span class="innerText">';
		html += name + '</span></TD>\n';
		html += '<TD class="CThtml" id="CThtml' + i + '" tagnum="' + i + '"><span class="innerText">' + escapeHtml(CTTags[i]) + '</span></TD>';
		html += '<TD class="CTvisual" id="CTvisual' + i + '" tagnum="' + i + '"><span class="innerText">' + CTTags[i] + '</span></TD>\n</TR>';
		tagTable.innerHTML += html;
	};

	var table = document.getElementById("customTagsTable");
		for (var i = 1; i < table.rows.length; i++) {
			for (var j = 0; j < table.rows[i].cells.length-1; j++) {
				table.rows[i].cells[j].addEventListener('click', function() {tableClicked(this);});
			}
		}
		var TRElem = document.createElement("TR");
		TRElem.innerHTML = '<TD id="addNew">Add New...</TD>'
	tagTable.appendChild(TRElem);
	document.getElementById("addNew").addEventListener('click', addNewTag);

}

function tableClicked(cell) {
	//alert("Cell clicked:\n" + cell.innerText);
	var input = document.createElement("input");
	input.setAttribute("type","text");
	input.setAttribute("id","CTEditBox");
	input.setAttribute("style","width:"+cell.offsetWidth+"px;");

	//get which one of the boxes it is, and prefill it with the apropriate text
	if(cell.id.indexOf("html") != -1){//it's an html node
		input.value = document.getElementById("CTvisual"+cell.getAttribute("tagnum")).children[0].innerHTML;
	}
	else{
		input.value = cell.innerText;
	}

	cell.replaceChild(input,cell.children[0]);
	//add a handle here that says when they click to finalize the text.
}

function addNewTag() {
	alert("NYI");
}

function escapeHtml(text) {
	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, function(m) {
		return map[m];
	});
}

function view_image() {
	clean_link();
	window.open(link);
}

function clean_link() {
	link = document.getElementById('link').value;
	if ((link.lastIndexOf(".") < link.length - 5) && (link.indexOf("http://imgur.com/") == 0)) { //it's not a direct link, but it's on imgur
		setStatus("creating a direct link");
		var code = link.substring(link.lastIndexOf("/") + 1, link.length);
		link = "http://i.imgur.com/" + code + ".gif"; //make a proper direct link to the image
		document.getElementById('link').value = link;
	} else if (link.substring(link.lastIndexOf(".") + 1) == 'gifv') {
		var code = link.substring(link.lastIndexOf("/") + 1, link.lastIndexOf("."));
		link = "http://i.imgur.com/" + code + ".gif"; //make a proper direct link to the image
		document.getElementById('link').value = link;
		setStatus("sanitizing a gifv link");
	} else {
		if (link.lastIndexOf(".") < link.length - 5) {
			alert(link + " doesn't seem to be a direct link to the image. Please use a direct link to an image, or use an imgur (non-album) link");
		}
	}

	//to strip images out of an album: look for "class="album-image"" as for a single image, they use 'class="image textbox "'
}

function setStatus(statusText) {
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
}

function check_for_changes() {
	//load_options();//don't need to do this anymore. I manually update the settings object when they hit save.
	_gaq.push(['_trackEvent', 'loadingLink', document.getElementById('link').value]);
	var changes = "";
	if (document.getElementById('link').value != settings.LoadingLink) {
		changes += 'Loading link changed from "' + settings.LoadingLink + '" to "' + document.getElementById('link').value + '"\n';
	}
	if (document.getElementById('active').checked != settings.Activated) {
		if (document.getElementById('active').checked)
			changes += 'Custom loading icons activated.\n';
		else
			changes += 'Custom loading icons deactivated.\n';
	}
	if (document.getElementById('resize').checked != settings.Resize) {
		if (document.getElementById('resize').checked)
			changes += 'Custom loading icons will now be resized.\n';
		else
			changes += 'Custom loading icons will no longer be resized.\n';
	}
	if (document.getElementById('markAdmins').checked != settings.MarkStaff) {
		if (document.getElementById('markAdmins').checked)
			changes += 'Staff will now be marked in the comments.\n';
		else
			changes += 'Staff will no longer be marked in the comments.\n';
	}
	if (document.getElementById('markSelf').checked != settings.MarkSelf) {
		if (document.getElementById('markSelf').checked)
			changes += 'You will now be marked in the comments.\n';
		else
			changes += 'You will no longer be marked in the comments.\n';
	}
	return changes;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('list').addEventListener('click', list);
document.getElementById('view').addEventListener('click', view_image);
document.getElementById('Banner').innerHTML = "Imgur Extender v" + chrome.runtime.getManifest().version;

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59801034-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

window.onbeforeunload = function() {
	var changes = check_for_changes();
	if (changes != '') {
		return "You have made unsaved changes:\n" + changes;
	}
}