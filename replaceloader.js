//alert("replaceloader run");

var settings;
var loggedIn;
var user;
//"use strict";
/*Stolen from heartbroken (shh, CSS modification is something I don't know how to do)
var css = '.favorite-image.favorited, .favorite-image:active { color: #85BF25 !important; }',
    head = document.head,
    style = document.createElement('style');

style.appendChild(document.createTextNode(css));
head.appendChild(style);
*/
//want to show notifications? the notifications box is this html: <a href="//imgur.com/account/notifications" class="notification-area new-notification ">*# of notifications*</a>
//add something to options on comments?
//<div class="options">
//                        <div class="addthis_button item share-caption-link" data="260166160">share</div>
//                        <div class="item report-caption-link" data="260166160">report</div>
//                        
//                        <div class="item permalink-caption-link" data="260166160">permalink</div>
//                        
//                    </div>

//want to know if an image is natively a gif? grab the response header: "Content-Type: image/gif"

function load_options() {
	chrome.storage.sync.get({
LoadingLink: 'http://i.imgur.com/QirvO9D.gif',
Activated: true,
Resize: true,
MarkStaff: true,
MarkSelf: true,
ListID: false
	}, function (items) {
		settings = items;
	});
}
load_options();//once it processes the script, it should load the settings right off

function contains(a, obj) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}
var working = false;
//var commentsChecked = 0;
var StaffMembers = ["4", "9571", "1423365", "4520105", "296176", "13326847", "189598", "1975", "14567826", "6512561"];
//(FOUNDER!!! maybe an extra special badge?) alan:4 (kinda funny he isn't #1. i wonder who 1-3 are? haven't found a way to check. looks like the API may work, but then I would have to learn that...) 
//sarah:9571, TyrannoSARAusRex:1423365, tonygoogs:4520105, badmonkey0001:296176, spatrizi:13326847, brianna:189598, talklittle:1975, untest3d:14567826, thespottedbunny:6512561, cfry99:i have no idea how to get it if he never comments, without asking the API. 
//link to staff page: http://imgur.com/about/team thanks for @Flyingpig2 (ID:11082067) for linking it
//ZacMuerte:6513050

function markUsers() {
	//if(commentsChecked < 200){
	if(!working){//only let one be running at a time.
		working = true;
		document.removeEventListener("DOMSubtreeModified", markUsers); //make it so my modifications don't recursively call this again and again.

		if(document.readyState == "complete"){
			//lets add a favorite button, shall we? maybe do this with an event on the "class="caption-toolbar combobox edit-button"" click maybe?
			var favorite_1 = '<div class="item favorite-caption-link" id="favoriteComment" data="'; //funny thing: once it's been used, it switches to class="item favorite-caption-link opened" for some reason.
			var fav_2 = '">favorite NYI</div>';
			try{
				var comment_option_boxes = document.getElementsByClassName("options");
				for (var t = 0; t < comment_option_boxes.length; t++){
					if((comment_option_boxes[t].favAdded != "true")/*(comment_option_boxes[t].innerHTML.indexOf('class="item favorite-caption-link') == -1) */&& (comment_option_boxes[t].innerHTML.indexOf('">permalink</div>') != -1)){ //doesn't have the favorite button, but has a permalink button.
						//get the comment ID
						var comment_ID = comment_option_boxes[t].innerHTML.substring(comment_option_boxes[t].innerHTML.indexOf('permalink-caption-link" data="')+30,comment_option_boxes[t].innerHTML.indexOf('">permalink</div>'));
						comment_option_boxes[t].innerHTML = comment_option_boxes[t].innerHTML.substring(0,comment_option_boxes[t].innerHTML.indexOf('">permalink</div>')+17) 
						+ favorite_1 + comment_ID + fav_2 + 
						comment_option_boxes[t].innerHTML.substring(comment_option_boxes[t].innerHTML.indexOf('">permalink</div>')+17,comment_option_boxes[t].innerHTML.length);
						comment_option_boxes[t].favAdded = "true";
					}
				}
				var fav_buttons = document.getElementsByClassName("item favorite-caption-link")
				for (var Q = 0; Q < fav_buttons.length; Q++){
					if(fav_buttons[Q].EventAdded != "true") {
						fav_buttons[Q].addEventListener('click',
						function(){
							addFavComment(this);
						}
						);
						fav_buttons[Q].EventAdded = "true"
					}
				}
			}
			catch(doublefak){
				console.log("[iX] Favourite adding failed!");
			}
			//var commenters = document.getElementsByClassName("author");
			var commenters = document.getElementsByClassName("usertext textbox first1");
			for (var i = 0, length = commenters.length; i < length; i++){//put userIDs
				if(commenters[i].IDProcessed != "true"){
					try{
						if(settings.ListID){
							if(commenters[i].children[0].innerHTML.indexOf('(ID:') == -1){
								var userLink = commenters[i].children[0].innerHTML.substring(0,commenters[i].children[0].innerHTML.indexOf('</a>'));
								var theRest = commenters[i].children[0].innerHTML.substring(commenters[i].children[0].innerHTML.indexOf('</a>'));
								var userID = commenters[i].children[0].attributes["data-author"].value;
								commenters[i].children[0].innerHTML = userLink + " (ID:" + userID + ") " + theRest;
							}	
						}
						commenters[i].IDProcessed = "true";
					}
					catch(fuckitall){
						console.log("[iX] userID adding failed" + fuckitall);
					}
				}
			}	
			
			if(document.URL.indexOf('/user/') == -1){//and tag important people, only if not on a userpage (it breaks if I do, and there's no point most of the time)
				//load_options();
				getUser();
				var selfTag = '<span class="selfTag" style="width:92px;color:#85BF25;background-color:Black">YOU</span> ';
				var Imp ="width:92px;color:BLACK;background-color:#85BF25;font-size:15px"
				var unImp = "font-size:11px;color:SlateGray;background-color:"
				var myTag = '<span class="creatorTag" style='+Imp+'>iX</span><span style='+unImp+'>-imgur Extender creator</span> ';
				var staffTag = '<span class="staffTag" style="background-color:#85BF25;width:92px !important;height:36px !important;color:green"><img src="http://s.imgur.com/images/imgurlogo-header.png"></span>';
				var staff;
				var creator;
				for (var i = 0, length = commenters.length; i < length; i++){
					if(commenters[i].tagged != "true"){
						//check if staff, and append tag
						try{
							/*
					if(settings.ListID){
						if(commenters[i].innerHTML.indexOf('(ID:') == -1){
							var userLink = commenters[i].innerHTML.substring(0,commenters[i].innerHTML.indexOf('</a>'));
							commenters[i].innerHTML = userLink + " (ID:" + commenters[i].attributes["data-author"].value + ") " + commenters[i].innerHTML.substring(commenters[i].innerHTML.indexOf('</a>'))
						}
					
					}
					I can (and should) put this on the user page, so I put it above that check*/
							if(settings.MarkStaff){
								if(contains(StaffMembers,commenters[i].children[0].attributes["data-author"].value)){
									staff=commenters[i].children[0];
									if(staff.innerHTML.indexOf(staffTag) == -1){//if it's already there, don't bother
										staff.innerHTML = staffTag + staff.innerHTML;
										//staff.tagged = "true";
										//continue;
									}
								}
							}
							if(settings.MarkSelf&&loggedIn){
								var lengthOfName = commenters[i].children[0].innerHTML.substring(32,96).indexOf('"');//grabs the front end of their name, and looks where the closing quote lies (the max length of usernames is 64)
								var UsernameOfCommenter = commenters[i].children[0].innerHTML.substring(32,32 + lengthOfName);
								if(UsernameOfCommenter == user && commenters[i].children[0].innerHTML.indexOf(selfTag) == -1){
									commenters[i].children[0].innerHTML = selfTag + commenters[i].children[0].innerHTML;
									//commenters[i].tagged = "true";
									//continue;
								}
							}
							if(commenters[i].children[0].attributes["data-author"].value == 6513050){ //ooh! that's me they're talkin' about!
								creator=commenters[i];
								if(creator.innerHTML.indexOf(myTag) == -1){//if it's not there, then we can apply it
									creator.innerHTML = myTag + creator.innerHTML;
									//commenters[i].tagged = "true";
									//continue;
								}
							}
							commenters[i].tagged = "true";
						}
						catch(ex){
							console.log("[iX] Staff marking failed!" + ex);
						}
					}
				}
			}
		}
		else{
			//commentsChecked = 0;
		}
	}
	working = false;
	document.addEventListener("DOMSubtreeModified", markUsers);
}
//document.addEventListener('click', markUsers);//check if they're expanding comments, and re-check for staff in the expanded comments
//document.addEventListener("DOMSubtreeModified", markUsers);//so they just pushed out an update that broke all this. I'll have to do a major overhaul. author IDs aren't even used anymore...
//document.getElementById('favoriteComment').addEventListener('click',view_image);

//how to make favorited comments:
//new datatypes are weird, but it'll be an object containing: author (author's ID as well, because that can change) comment ID, image link (these combined can form the direct link), the comment (in case it's deleted or some shit), and the time it was favourited (i dunno, fuck you man)

function favComment(Auth, AuthID, CommentID, imageLink, Comment){
	this.Author = Auth;
	this.AuthorID = AuthID;
	this.ID = CommentID;
	this.link = imageLink;
	this.comment = Comment;
	this.time = new Date(year, month, day, hours, minutes);
}

favComment.prototype = {
	doX : function(){}
};

function addFavComment(caller){
	//drill down like 5 parentElements until we get the actual comment box so we can rip it apart
	var authorTag = caller.parentElement.parentElement.parentElement;
	var	nameStart = authorTag.innerHTML.indexOf('<a href="/user/') + 15;
	var lengthOfName = authorTag.innerHTML.substring(nameStart,nameStart+64).indexOf('"');//grabs the front end of their name, and looks where the closing quote lies (the max length of usernames is 64)
	var Username = authorTag.innerHTML.substring(nameStart,nameStart + lengthOfName);
	var authorId = authorTag.attributes["data-author"].value
	var comment = caller.parentElement.parentElement.parentElement.parentElement.children[caller.parentElement.parentElement.parentElement.parentElement.children.length - 1].innerText; //stupid badges fucked it up. it's fixed now
	var link = document.URL;
	var commentID = caller.getAttribute('data');
	alert(Username + " (" + authorId + ") wrote: \n" + comment + "\nw/ commentID " + commentID + "\nat " + link);
}

function getUser() {
	if(document.getElementsByClassName('account-user-name')[0]===null){
		loggedIn=false;
		console.log("You aren't signed into imgur!");
		_gaq.push(['_setCustomVar',1,'Login','N/A',2]);
	}//they're not signed in
	else{
		loggedIn=true;
		var userlink = document.getElementsByClassName('account-user-name')[0].href;
		user = userlink.substring(userlink.lastIndexOf("/")+1,userlink.length);
		_gaq.push(['_setCustomVar',1,'Login',user,2]);
		//console.log("Hello "+user+"! Thank you for using imgur x-tend!"); 
	}
}

function resizeImages(){
	//load_options();
	if(settings.Activated&&settings.Resize){
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
		for(var i = 0, max = allImages.length; i < max; i++){
			try{
				if (allImages[i].src.indexOf("loaders") > -1){
					target = allImages[i];
					var res = target.src.substring(target.src.indexOf(".gif")-2,target.src.indexOf(".gif")); //gets the resolution of the gif we're replacing
					target.setAttribute("style", "height:"+res+"px");
					//					alert("found one!");
				}
			}
			catch(ex){
				console.log('[iX] Something broke while resizing loading icons.' + ex);
			}
		}
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.command == "SettingsChanged"){
		load_options();
	}
	else if(request.command == "doStuff().exe"){
		//tell it that it's dumb and ugly, and should feel bad, but then get to work.
		resizeImages(); //just run the script, it'll find it.
	}
});

function superUpvote(){
	$('[title=like]').not('.pushed').click();
}

function superDownvote(){
	$('[title=dislike]').not('.pushed').click();
}

function unSuperUpvote(){
	$('[title=like]').filter('.pushed').click();
}

function unSuperDownvote(){
	$('[title=dislike]').filter('.pushed').click();
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-59801034-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();