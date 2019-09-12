# Imgur Extender
A chrome extension to add additional functionality to popular image-sharing website [Imgur](https://imgur.com/) such as changing the loading icon and marking staff members in the comments.

## [Chrome Web Store link](https://chrome.google.com/webstore/detail/imgur-extender/gcnjboicdkemcdhcmanaokkpjhiikblf)

## Required Permissions:
  * storage
    >Allows settings to be saved and loaded across synced devices
  * webRequest / webRequestBlocking
    >Allows interception of file requests to replace the loading icon
  * &ast;://&ast;.imgur.com/&ast;
    >Allows me to read and modify page data for various tasks such as tagging users in comments
  * tab
    >The shadiest permission request, as it shows up as "all browsing history", but simply lets me know which tabs have the script actively running, and verify there aren't multiple copies of the settings page open at once.\
    *There have been updates to the framework that may allow the script to work without this permission in the future.*

## Dependencies:
  * [jQuery](https://jquery.com/)

## Other authors:
  * [Max Azarcon](https://github.com/maxazarcon) redesigned the settings page and provided a new vector logo

## Core Files:
 * [background.js](https://github.com/ZacTheHac/imgur-extender/blob/master/background.js) is the core script file, but mostly handles loading initial settings, intercepting web requests, and providing analytics feedback
 * [replaceloader.js](https://github.com/ZacTheHac/imgur-extender/blob/master/replaceloader.js) does all the heavy lifting including scraping and modifying page data

<img src="https://i.imgur.com/EBKI3wj.png">