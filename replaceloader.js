var settings;
var loggedIn;
var user;
var working = false;
//"use strict";
/*Stolen from heartbroken (shh, CSS modification is something I don't know how to do)
var css = '.favorite-image.favorited, .favorite-image:active { color: #85BF25 !important; }',
    head = document.head,
    style = document.createElement('style');

style.appendChild(document.createTextNode(css));
head.appendChild(style);
*/

//want to know if an image is natively a gif? grab the response header: "Content-Type: image/gif"

//attempting to lean api: javascript:void((function(){var r=new XMLHttpRequest();r.open('GET','http://imgur.com/',false);r.send(null);alert(r.getAllResponseHeaders());})());
function getImgurResponse() {
	var request = new XMLHttpRequest();
	request.open('GET', 'http://imgur.com/', false);
	request.send(null);
	alert(request.getAllResponseHeaders());
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
load_options(); //once it processes the script, it should load the settings right off

function contains(a, obj) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] === obj) {
			return i;
		}
	}
	return -1;
}

//var StaffMembers = ["4", "9571", "1423365", "4520105", "296176", "13326847", "189598", "1975", "14567826", "6512561"];
//(FOUNDER!!! maybe an extra special badge?) alan:4 (kinda funny he isn't #1. i wonder who 1-3 are? haven't found a way to check. looks like the API may work, but then I would have to learn that...) 
//sarah:9571, TyrannoSARAusRex:1423365, tonygoogs:4520105, badmonkey0001:296176, spatrizi:13326847, brianna:189598, talklittle:1975, untest3d:14567826, thespottedbunny:6512561, cfry99:i have no idea how to get it if he never comments, without asking the API. 
//link to staff page: http://imgur.com/about/team thanks for @Flyingpig2 (ID:11082067) for linking it
//ZacMuerte:6513050
function addFavButtons() {
	//lets add a favorite button, shall we? maybe do this with an event on the "class="caption-toolbar combobox edit-button"" click maybe?
	var favorite_1 = '<div class="item favorite-caption-link" id="favoriteComment" data="'; //funny thing: once it's been used, it switches to class="item favorite-caption-link opened" for some reason.
	var fav_2 = '">favorite NYI</div>';
	try {
		var comment_option_boxes = document.getElementsByClassName("options");
		for (var t = 0; t < comment_option_boxes.length; t++) {
			if ((comment_option_boxes[t].favAdded != "true") && (comment_option_boxes[t].innerHTML.indexOf('"item permalink-caption-link') != -1)) { //doesn't have the favorite button, but has a permalink button.
				//get the comment ID
				var comIDStart = comment_option_boxes[t].innerHTML.indexOf('/comment/') + 9;
				var comment_ID = comment_option_boxes[t].innerHTML.substring(comIDStart, comment_option_boxes[t].innerHTML.indexOf('" data-reactid=', comIDStart));
				comment_option_boxes[t].innerHTML = comment_option_boxes[t].innerHTML //.substring(0,comment_option_boxes[t].innerHTML.indexOf('">permalink</a>')+17) 
					+ favorite_1 + comment_ID + fav_2; //+ comment_option_boxes[t].innerHTML.substring(comment_option_boxes[t].innerHTML.indexOf('">permalink</div>')+17,comment_option_boxes[t].innerHTML.length);
				comment_option_boxes[t].favAdded = "true";
			}
		}
		var fav_buttons = document.getElementsByClassName("item favorite-caption-link")
		for (var Q = 0; Q < fav_buttons.length; Q++) {
			if (fav_buttons[Q].EventAdded != "true") {
				fav_buttons[Q].addEventListener('click',
					function() {
						addFavComment(this);
					}
				);
				fav_buttons[Q].EventAdded = "true"
			}
		}
	} catch (doublefak) {
		console.log("[iX] Favourite adding failed!");
	}
}

function addUserIDs(commenters) {
	if (settings.ListID) { //figured I should move this to the top so it DOESNT LOOP IF IT DOESN'T HAVE TO
		for (var i = 0, length = commenters.length; i < length; i++) { //put userIDs
			if (commenters[i].IDProcessed != "true") {
				try {
					if (commenters[i].children[0].innerHTML.indexOf('(ID:') == -1) {
						var userLink = commenters[i].children[0].innerHTML.substring(0, commenters[i].children[0].innerHTML.indexOf('</a>'));
						var theRest = commenters[i].children[0].innerHTML.substring(commenters[i].children[0].innerHTML.indexOf('</a>'));
						var userID = commenters[i].children[0].attributes["data-author"].value;
						commenters[i].children[0].innerHTML = userLink + " (ID:" + userID + ") " + theRest;
					}
					commenters[i].IDProcessed = "true";
				} catch (fuckitall) {
					console.log("[iX] userID adding failed" + fuckitall);
				}
			}
		}
	}
}

			//DATA BLOCK BEGIN
			var StaffMembers = ['Alan', 'sarah', 'TyrannoSARAusRex', 'tonygoogs', 'badmonkey0001', 'spatrizi', 'brianna', 'talklittle', 'untest3d', 'thespottedbunny', 'cfry99', 'LizForbes', 'heyjude168', 'andytuba', 'cgallello'];
			var GenerallyCoolPeople = ['mistersavage', 'sarah', 'Lassann'];
			var genCoolPplTags = ['<span style="width:92px;color:#85BF25;background-color:Black;font-size:small">THE Adam Savage</span>', '<span style="width:92px;color:#85BF25;background-color:Black">SaraPls</span>', '<span style="width:92px;color:RED;background-color:Black">Lassann</span>'];
			var selfTag = '<span class="selfTag" style="width:92px;color:#85BF25;background-color:Black">YOU</span> ';
			var Imp = "width:92px;color:BLACK;background-color:#85BF25;font-size:15px"
			var unImp = "font-size:11px;color:SlateGray;background-color:"
			var myTag = '<span class="creatorTag" style=' + Imp + '>iX</span><span style=' + unImp + '>-imgur Extender creator</span> ';
			var staffTag = '<span class="staffTag" style="background-color:#85BF25;width:92px !important;height:36px !important;color:green"><img src="http://s.imgur.com/images/imgurlogo-header.png"></span>';
			//Data block end

function markUsers() {
	document.removeEventListener("DOMSubtreeModified", markUsers); //make it so my modifications don't recursively call this again and again.

	if (document.readyState == "complete") {
		addFavButtons();

		getUser(); //updates the username
		var commenters = document.getElementsByClassName("usertext textbox first1");
		//I would add userIDs here, but that's gone forever, at least as automatic. code is kept, but never run

		if (document.URL.indexOf('/user/') == -1) { //we're not on a userpage

			var currUserName;
			try { //put the try outside so that when it breaks it doesn't break super badly...
				//comment tags
				var tag = "";
				for (var i = 0, length = commenters.length; i < length; i++) {
					if (commenters[i].tagged != "true") {
						currUserName = commenters[i].getElementsByClassName("author")[0].children[0].innerText; //gets their username
						currUserName = currUserName.substring(0, currUserName.length - 1); //remove the trailing space

						//generate tag
						//staff
						if (settings.MarkStaff) {
							if (contains(StaffMembers, currUserName) != -1) {
								tag += staffTag;
							}
						}
						//cool people
						var userNum = contains(GenerallyCoolPeople, currUserName);
						if (userNum != -1) {
							tag += genCoolPplTags[userNum];
						}
						//YOU
						if (settings.MarkSelf && loggedIn && currUserName == user) {
							tag += selfTag;
						}
						//iX staff
						if (currUserName == 'ZacMuerte' || currUserName == 'SoulExpression') {
							tag += myTag;
						}


						commenters[i].innerHTML = tag + commenters[i].innerHTML;
						tag = "";
						commenters[i].tagged = "true";
					}
				}
				//gallery poster tags - move this outside. like once the url changes? it's apparently too expensive to have inside...
				/*if (poster.length > 0 && poster[0].tagged != "true") {
					currUserName = poster[0].innerText.substring(3, poster[0].innerText.indexOf(" ", 3))

					//staff
					if (settings.MarkStaff) {
						if (contains(StaffMembers, currUserName) != -1) {
							tag += staffTag;
						}
					}
					//cool people
					var userNum = contains(GenerallyCoolPeople, currUserName);
					if (userNum != -1) {
						tag += genCoolPplTags[userNum];
					}
					//YOU
					if (settings.MarkSelf && loggedIn && currUserName == user) {
						tag += selfTag;
					}
					//iX staff
					if (currUserName == 'ZacMuerte' || currUserName == 'SoulExpression') {
						tag += myTag;
					}

					poster[0].innerHTML = poster[0].innerHTML + tag;
					tag ="";
					poster[0].tagged = true;
				}*/
			} catch (ex) {
				console.log("[iX] Staff marking failed!" + ex);
			}
		}
	}
	document.addEventListener("DOMSubtreeModified", markUsers);
}
document.addEventListener("DOMSubtreeModified", markUsers);

function markPoster() {
	if (document.readyState == "complete") {
		document.removeEventListener("DOMSubtreeModified", markPoster);
		var currUserName;
		var poster = document.getElementsByClassName("under-title-info");
		if (poster.length > 0 && poster[0].children[0].children[3] != null && poster[0].children[0].children[3].tagged != true) {//had to drill down to find something that is modified when switching between posts.
			var tag = "";
			//alert("marking posters");
			getUser(); //updates the username

			currUserName = poster[0].innerText;
			if (currUserName.indexOf("by") == -1) {
				currUserName = "(source)";
			} else {
				currUserName = currUserName.substring(3, poster[0].innerText.indexOf(" ", 3));
			}

			//staff
			if (settings.MarkStaff) {
				if (contains(StaffMembers, currUserName) != -1) {
					tag += staffTag;
				}
			}
			//cool people
			var userNum = contains(GenerallyCoolPeople, currUserName);
			if (userNum != -1) {
				tag += genCoolPplTags[userNum];
			}
			//YOU
			if (settings.MarkSelf && loggedIn && currUserName == user) {
				tag += selfTag;
			}
			//iX staff
			if (currUserName == 'ZacMuerte' || currUserName == 'SoulExpression') {
				tag += myTag;
			}

			document.getElementById("image-title").innerHTML += tag;
			tag = "";
			poster[0].children[0].children[3].tagged = true;
		}
		document.addEventListener("DOMSubtreeModified", markPoster);
	}

}
//document.addEventListener("DOMSubtreeModified", markPoster);
//how to make favorited comments:
//new datatypes are weird, but it'll be an object containing: author (author's ID as well, because that can change) comment ID, image link (these combined can form the direct link), the comment (in case it's deleted or some shit), and the time it was favourited (i dunno, fuck you man)

function favComment(Auth, AuthID, CommentID, imageLink, Comment) {
	this.Author = Auth;
	this.AuthorID = AuthID;
	this.ID = CommentID;
	this.link = imageLink;
	this.comment = Comment;
	this.time = new Date(year, month, day, hours, minutes);
}

favComment.prototype = {
	doX: function() {}
};

function addFavComment(caller) {
	//drill down like 5 parentElements until we get the actual comment box so we can rip it apart
	var authorTag = caller.parentElement.parentElement.parentElement;
	var nameStart = authorTag.innerHTML.indexOf('<a href="/user/') + 15;
	var lengthOfName = authorTag.innerHTML.substring(nameStart, nameStart + 64).indexOf('"'); //grabs the front end of their name, and looks where the closing quote lies (the max length of usernames is 64)
	var Username = authorTag.innerHTML.substring(nameStart, nameStart + lengthOfName);
	//var authorId = authorTag.attributes["data-author"].value
	//I need to find a way to grab their ID now.
	var comment = caller.parentElement.parentElement.parentElement.parentElement.children[caller.parentElement.parentElement.parentElement.parentElement.children.length - 1].innerText; //stupid badges fucked it up. it's fixed now
	//var link = document.URL;
	var link = caller.parentElement.children[2].href;
	link = link.substring(0, link.indexOf('comment/'));
	var commentID = caller.getAttribute('data');
	alert(Username + " wrote: \n" + comment + "\nw/ commentID " + commentID + "\nat " + link);
}

function getUser() {
	if (document.getElementsByClassName('account-user-name')[0] == null) {
		loggedIn = false;
		console.log("You aren't signed into imgur!");
		//_gaq.push(['_setCustomVar', 1, 'Login', 'N/A', 2]);
	} //they're not signed in
	else {
		loggedIn = true;
		var userlink = document.getElementsByClassName('account-user-name')[0].href;
		user = userlink.substring(userlink.lastIndexOf("/") + 1, userlink.length);
		//_gaq.push(['_setCustomVar', 1, 'Login', user, 2]);
		//console.log("Hello "+user+"! Thank you for using imgur x-tend!"); 
	}
}

function resizeImages() {
	//load_options();
	if (settings.Activated && settings.Resize) {
		var allImages = document.getElementsByTagName("img");
		//var allImages = document.getElementsByClassName("small-margin-top");
		//var cssImages = document.getElementsByClassName("save-caption-loader");//much smaller list, and only gets the ones i actually need to resize
		//var zoomLoaders = document.getElementsByClassName("zoom-loader");
		//maybe I should just go through all the elements, and see if they contain "loader"
		//let me see: save-caption-loader, small-loader, outside-loader, past-loader, imagelist-loader, reply-loader, input-loader, loader-small - because fuck small-loader, share-loader, tag-loader
		//not enough types of loaders!
		//what about loading an image in the comments? cboxLoadingGraphic

		//allImages += document.getElementsByClassName("save-caption-loader");//add in comment loaders and such
		var target;
		for (var i = 0, max = allImages.length; i < max; i++) {
			try {
				if (allImages[i].src.indexOf("loaders") > -1) {
					target = allImages[i];
					var res = target.src.substring(target.src.indexOf(".gif") - 2, target.src.indexOf(".gif")); //gets the resolution of the gif we're replacing
					target.setAttribute("style", "height:" + res + "px");
					//					alert("found one!");
				}
			} catch (ex) {
				console.log('[iX] Something broke while resizing loading icons.' + ex);
			}
		}
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.command == "SettingsChanged") {
		load_options();
	} else if (request.command == "doStuff().exe") {
		//tell it that it's dumb and ugly, and should feel bad, but then get to work.
		resizeImages(); //just run the script, it'll find it.
	}
});

function superUpvote() {
	$('[title=like]').not('.pushed').click();
}

function superDownvote() {
	$('[title=dislike]').not('.pushed').click();
}

function unSuperUpvote() {
	$('[title=like]').filter('.pushed').click();
}

function unSuperDownvote() {
	$('[title=dislike]').filter('.pushed').click();
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59801034-1']);
_gaq.push(['_trackPageview']);

(function() {
	try{
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
}
catch(analyticserr){
	console.log("[iX] Analytics adding failed!" + analyticserr);
}
})();