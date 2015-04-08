/*
 * IDR.loop.v12.0.js
 * Below is the Radar Loop code plus cursor Pointer & Origin code.
 * v12.0 2013-04 - PS - Added advertising code for unique ads per radar
 * v12.0 2012-08 - PS
 * v11.0 2012-07 - PS - Added information/instructions box to the Weather Obs. area
 * v11.0 2012-07 - PS - If page is 9am or 24hr rainfall the animation does not play be default.
 * v11.0 2012-06 - PS - Version for adds.
 * v10.1 2012-04-23 rfd - In getLocalDateTime, choose the second last rather the second element split by '.'.
 * 							Allows to use URL's like http://www.bom.gov.au/radar/IDR023.201204230100.png in
 * 							theImageNames array.
 * v10.1 6/9/2011kzt - set bugLeft/bugright to 2px for IE
 * v9 2009-07-10 kzt - added added radar outage information (loop)
 * v8 2008-07-09 kzt - added dwell
 * v8 2008-05-23 kzt - added cookie and convert UTC time to local time
 * v7 2008-02-26 jxl - added nearby radars to navigation
 * v7 2008-01-04 jxl - added 9am rainfall legend and colours to dynamic weather obs table
 * v7 2007-08-03 jxl - added konqueror logic to setInterval document.defaultView.getComputedStyle for font-resizing
 * v7 2007-08-03 jxl - added safari positioning to reposition subroutine to keep container in correct place when window is resized
 * v7 2007-08-03 jxl - addition of updateOverlays() and finished var to handle back button problem in Opera 9+
 * 						the checkbox would be selected (reported a false negative on chekcbox), but overlay would not appear
 * 						it most likely is related to history.navigationMode which was introduced after Opera8.54
 * v7 2007-08-01 jxl - textSize, getComputedStyle required getPropertyValue to work on Netscape7+
 * v6 2007-07-17 jxl - passCheckboxes subroutine updated, so that back button works correctly
 * v6 2007-06-20 jxl - timeout for loop if playing
 * v6 2007-06-20 jxl - dropped meta refresh from HTML, using setInterval for refresh
 * v6 2007-02-05 jxl - added clear all, select all, keep features on refresh
 * v6 2007-01-24 jxl - scrollbars for printer friendly popup in buildPopup function
 * v6 2006-12-22 jxl - debugging for buildPopup, escaping end title tag due to firewall issues
 * v6 2006-11-01 jxl - dropped support for all NN6 browsers
 * v6 2006-11-01 jxl - printer friendly popup added resize for newWindow due to safari problem
 * v6 2006-10-27 jxl - check that getXkm and getYkm are defined
 * v6 2006-10-26 jxl - Sharp lat correction removed
 * v6 2006-10-25 jxl fix for incorrect lon, rounding moved to getRounded fn
 * v6 2006-09-20 jxl fix for incorrect overlaying when window is resized
 * v6 2005-11-25 jxl toggling code for map overlays
 * v4 2006-02-23 jxl - correction for error in display_current_image function - check image array length
 * v4 2006-10-17 jxl - Sharp lat correction added
 * v4 2005-10-30 jxl added map coordinates and additional support for gecko browsers
 * v3 2003-10-14 Clive Edington, stop looping after 6 mins when iconised.
 * v3 2003-03-20 Clive Edington, do not show the mouse when Km is not defined.
 * v3 2003-03-17 Clive Edington, fix typo bug for Mac (Thanks Nik).
 * v3 2003-03-11 Clive Edington, Opera v7 does mouse distances like IE.
 * 										Adjusted NS and IE mouse offsets (+1).
 * 				Fixed '-0km' to '0km'.
 * v3 2003-03-04 (Clive Edington) Nik Hamptons Mac IE mouse fixes.
 * v3 2003-01-02 Clive Edington, Always do loops. Selectively do mouse.
 * v2 2002-02-20 Clive Edington, "km" (not "Km").
 * 2001-05-07 Clive Edington, Better logic for browser version vs actions.
 * 2000-12-07 Clive Edington, No html here, just js.  Allow No images.
 * 2000-07-28 Clive Edington, generalised the code for www.bom.gov.au
 * Thanks to Alf West and the Radar Section for the original code.
 * Usage:
 * (1) Call 'launch()' once (e.g. from BODY onload="..") to start this code.
 * (2) Assumes that these Image dependent variables have already been defined:
 *
 * Km = nn;	// Standard 64km, 128km, 256km or 512km radar picture.
 * nImages = n;
 * theImageNames = new Array();
 * theImageNames[0] = "filename1.gif";
 * theImageNames[1] = "filename2.gif";
 * ...etc...
 * -----------------------------------------------------------------
 * If there are some images, loop them.
 * else when no images are available, exit now.
 * Assume that the enclosing html will provide a message.
 *
 * Microsoft vs. Netscape.  See below for safer definitions.
 * If either of these are true, then the mouse-distances (cursor) shows.
 * If both false, then we get simple loops, but no mouse.
 */

//var ext_id = ID.replace(/IDR(\d\d)\w/i, '$1');
var ext_id = ID.replace(/IDR(\d\d)/i, '$1');
var external = {
	'02': '1297322',
	'03': '1297225',
	'04': '1297226',
	'05': '1297205',
	'06': '1297281',
	'07': '1297287',
	'08': '1297199',
	'09': '1297197',
	'10': '1342113',
	'14': '1297203',
	'15': '1297291',
	'16': '1297292',
	'17': '1297293',
	'18': '1297240',
	'19': '1297248',
	'20': '1342115',
	'22': '1297249',
	'23': '1297241',
	'24': '1297242',
	'25': '1297235',
	'26': '1342118',
	'27': '1297268',
	'28': '1297190',
	'29': '1297294',
	'30': '1297311',
	'31': '1297295',
	'32': '1297296',
	'33': '1297269',
	'34': '1342117',
	'36': '1297243',
	'37': '1342120',
	'39': '1297297',
	'40': '1297186',
	'41': '1297244',
	'42': '1297232',
	'44': '1297298',
	'45': '1297299',
	'46': '1297270',
	'48': '1297300',
	'49': '1297316',
	'50': '1297263',
	'51': '1342121',
	'52': '1297204',
	'53': '1297213',
	'55': '1297221',
	'56': '1297245',
	'62': '1297222',
	'63': '1297233',
	'64': '1297271',
	'65': '1297234',
	'66': '1297264',
	'67': '1297246',
	'68': '1297317',
	'69': '1297224',
	'70': '1297305',
	'71': '1297231',
	'72': '1297247',
	'73': '1297250',
	'75': '1342116',
	'76': '1297276',
	'77': '1342114',
	'99':	'1297184' // National & Default
}

var ads_id = external['99'];
if (external[ext_id]) {
	ads_id = external[ext_id];
}

var original_child;
doMouse = false;
doLatLon = false;
// skip is a named anchor in the standard bureau header
// it is used to jump past the bureau header when the page refreshes
var skip = "#skip";
var path_name = window.location.pathname;
// Get the path to the current file (minus the file name) to use for the
// cookie path.
var cookie_path = path_name.replace(/\/[^\/]+\.s?html$/, '/');
var cookie_domain = document.domain;
// From the full path work out which type of radar page we have
// e.g. defence, reg, public etc.
if (typeof(page_type) == "undefined") {
	var page_type;
	//if (path_name.match(/\/defence\//ig).length && !path_name.match(/\.loopi\./ig)) {
	if (path_name.match(/\/defence\//ig)) {
		page_type = 'defence';
	//} else if (path_name.match(/\/defence\//ig).length && path_name.match(/\.loopi\./ig).length) {
	//	page_type = 'include';
	} else if (path_name.match(/\/reg\//ig) || path_name.match(/\/eval\//ig)) {
		page_type = 'reguser';
	} else if (path_name.match(/\/bomw0211\//ig)) {
		page_type = 'air';
	} else if (path_name.match(/\/national_/ig)) {
		page_type = 'national';
	} else {
		var page_type = 'public';
	}
}
var cookie_prefx = page_type.substring(0,3);
// Find out if this is a 24hr or Since 9am rainfall page
//
//var matches = path_name.match(/[CD]\.loop\.shtml$/g);
var matches = path_name.match(/[CD]\.loop/g);
var is_rainfall = false;
if (matches != null) {
	if (matches.length > 0) {
		is_rainfall = true;
	}
}

// remember when this page started (so we can kill the loops later).
setStartTime();
loop_limit_seconds = 1800;
//previously 300+60;
//refresh_milliseconds = 10000;
refresh_milliseconds = 300000;
//refresh_milliseconds = 10000000;
//check if the latitude and longitude are defined
if (typeof(lat) != "undefined" && typeof(lon) != "undefined") {
	doLatLon = true;
}
if (isUnsupported) doMouse = false;
if (isMS || isGecko || isKonqueror || isOpera) doMouse = true;
// Do not show mouse if Km is not defined.
if (Km < 1) {
	doMouse = false
}
if (nImages > 0) {
	var doc;
	/*
	 *  Holds a pointer to MS or NN document (see launch).
	 *  Now the general Looping code.
	 *
	 * ==========================================================
	 * 						>> jsImagePlayer 1.0 <<
	 * 				for Netscape3.0+, September 1996
	 * 						by (c)BASTaRT 1996
	 * 					Praha, Czech Republic, Europe
	 *  feel free to copy and use as long as the credits are given
	 * 				by having this header in the code
	 * 				contact: xholecko@sgi.felk.cvut.cz
	 * 				http://sgi.felk.cvut.cz/~xholecko
	 * 		modified by D. Watson and A. Earnhart (CIRA/CSU), 7/30/97
	 * 		and Greg Thompson (NCAR/RAP) Dec. 11 1997
	 * ==========================================================
	 *  step 1: define the images
	 * 		See "theImageNames" set above.
	 *
	 *  step 2: define variables used to control images
	 */
	image_href = "";
	first_image = 0;
	last_image = nImages - 1;
	//
	// step 3: define dimensions of image (would be nice if this were interactively done)
	// Presently these ARE NOT used below. See step 9
	//
	animation_height = 512;
	animation_width = 512;
	//**************************************************************************
	// THE CODE STARTS HERE - no need to change anything below
	// global variables
	// holds the images
	theImages = new Array();
	//keeps track of which images to omit from loop
	imageNum = new Array();
	if (page_type === 'national') {
		//holds the sat images
		theSatImages = new Array();
		//keeps track of which sat images to omit from loop
		satImageNum = new Array();
	}
	normal_delay = 300;
	//delay between frames in 1/100 seconds
	delay = normal_delay;
	delay_step = 50;
	delay_max = 4000;
	delay_min = 50;
	dwell_multipler = 3;
	dwell_step = 1;
	end_dwell_multipler = dwell_multipler;
	start_dwell_multipler = 1;
	//number of the current image
	current_image = first_image;
	timeID = null;
	if (is_rainfall) {
		// 0-stopped, 1-playing
		looping = 0;
	} else {
		// 0-stopped, 1-playing
		looping = 1;
	}
	// 0-normal, 1-loop, 2-sweep
	play_mode = 0;
	size_valid = 0;
	reloaded = 0;
	finished = 0;
	if (page_type === 'national') {
		radarLoop = "off";
		satelliteLoop = "off";
		//IDE00035.background.png
		clearLoop = "unknown";
	}
}
// (end of if there are images to loop)
//==========================================================
//		All previous statements are performed as the page loads.
//		The following functions are also defined at this time.
//==========================================================
// Load and initialize everything once page is downloaded
// (called from 'onLoad' in <BODY>)
function launch() {
//alert("start load");
	if (page_type === 'national') {
		$('area.hot-spot').each(function(index) {
			var area_href = $(this).attr('href');
			area_href = area_href.replace(/\.shtml$/, '.loop.shtml');
			$(this).attr('href', area_href+"#skip");
		});
	}
	doc = document;
	var container;
	var container1;
	if (page_type !== 'national' && page_type !== 'include'  && page_type !== 'defence') {
		container = document.getElementById("observationsView");
		container1 = document.getElementById("obs-instruct");
		original_child = container.firstChild;
		//original_child1 = container1.firstChild;
	}
	//load cookie map feature elements
	if (page_type !== 'include') {
		checkMapFeaturesFields();
	}
	//this will replace the meta refresh
	//it will keep the checked features because the url will contain query str
	self.setInterval("passCheckboxes(document.location.href, 'true')", refresh_milliseconds);
	//alert("After reloaded:");
	updateIcons();
	if (nImages == 0) {
		// Scrub the 'Please wait' image.
		//doc.animation.src = "IDR.no.images.new.gif";
		var getOutageMgs = "<h3>Radar service is currently unavailable due to:<\/h3>" + getRadarOutageMgs();
		if (part_time === 1) {
			getOutageMgs += "<p class=\"backup-msg\">N.B. <strong>This is a part-time windfinding radar<\/strong>" +
								" which has routine periods when &quot;weather watch&quot;" +
								" coverage is not available: " +
								" <a href=\"\/australia\/radar\/part-time_table.shtml\">" +
								" See availability table<\/a>.<\/p>"
		}
		var radarOutagespantag = document.getElementById("displayRadarOutageMgs");
		radarOutagespantag.innerHTML = getOutageMgs;
		if ($('span#displayRadarOutageMgs').length && $('div.service-notice').length) {
			$('span#displayRadarOutageMgs h3').after($('div.service-notice'));
			$('div.service-notice').css('padding', '1em');
			$('div.service-notice').css('margin-bottom', '1em');
			$('div.service-notice').css('font-size', '1.2em');
			$('div.service-notice').css('text-align', 'left');
		}
		return;
	}
	if (doMouse) startxy();
	// Start pointer-origin code.
	// If there is only 1 image, show it, but dont start the loop.
	if (nImages == 1) {
		current_image = 0;
		theImages[current_image] = new Image();
		theImages[current_image].src = image_href+theImageNames[current_image];
		// pretend it is ready.
		imageNum[current_image] = true;
		if (page_type === 'national') {
			theSatImages[current_image] = new Image();
			theSatImages[current_image].src = image_href+theSatImageNames[current_image];
			// pretend it is ready.
			satImageNum[current_image] = true;
		}
		display_current_image();
		toggleCheck();
		return;
	}
	//
	// step 5: construct filenames for all images
	//
	for (var i = first_image; i <= last_image; i++) {
		current_image = i;
		theImages[current_image] = new Image();
		theImages[current_image].src = image_href+theImageNames[current_image];
		imageNum[current_image] = false;
		// image is not ready yet.
		if (page_type == 'national') {
			theSatImages[current_image] = new Image();
			theSatImages[current_image].src = image_href+theSatImageNames[current_image];
			satImageNum[current_image] = false;
			// sat image is not ready yet
		}
	}
	current_image = last_image;
	// requested by services policy
	//current_image = first_image;
	// pretend it is ready.
	imageNum[current_image] = true;
	if (page_type === 'national') {
		// pretend it is ready.
		satImageNum[current_image] = true;
	}
	// this needs to be done to set the right mode when the page is manually reloaded
	toggleCheck();
	if (looping == 1) {
		change_mode(1);
		fwd();
	}
	if (looping == 0) {
		change_mode(0);
		stop();
	}
	display_current_image();
	if (page_type === 'national') {
		$.fn.maphilight.defaults = {
			fill: true,
			fillColor: '66CCCC',
			fillOpacity: 0.1,
			stroke: true,
			strokeColor: 'FFFFCC',
			strokeOpacity: 0.2,
			strokeWidth: 1,
			fade: false,
			alwaysOn: false,
			neverOn: false,
			groupBy: false
		}
		$('#trans-map-mask').maphilight();
	}
	// load the real marketing page
	if (page_type === 'public' || page_type === 'national') {
		$('iframe#IF-' + ads_id).attr(
												'src',
												'/includes/marketing2.php?id=' + ads_id
											);
	}
}
function checkMapFeaturesFields() {
	//check if there any cookies
	//if (document.cookie != "" || document.cookie != "popunder=yes; popundr=yes")
	var myCookieVarName = "";
	if (myCookieVarName = checkCookie("isCookieCreated", "null", "null")) {
		var thisCookie = myCookieVarName;
		var theForm = document.tog;
		if (page_type === 'national') {
			natLoop = false;
			radLoop = false;
			satLoop = false;
		}
		//check if theForm exist
		if (theForm) {
			//uncheck all default elements which are: Topography, Locations, Range (for all pages except national)
			var numbEle = theForm.elements.length;
			for (var j = 0; j < numbEle; j++) {
				//check if default checked
				if (theForm.elements[j].checked == true) {
					//uncheck it
					theForm.elements[j].checked = false;
				}
			}
			//get number of element in the form
			var getNumbOfElements = document.tog.elements.length;
			//now use elements from cookie value to turn on the check list
			for (var i = 0; i < thisCookie.length; i++) {
				//element name
				//var mapFeatureName = thisCookie[i].split("=")[0];
				var mapFeatureName = thisCookie[i].split("=")[0];
				if (mapFeatureName.search(cookie_prefx+"_" ) === -1) {
					continue;
				}
				var mapFeatureName = mapFeatureName.replace(cookie_prefx+"_" ,'');
				//number of element
				mapFeatureVal = thisCookie[i].split("=")[1];
				//ignore mapFeatureName="radarCookie" as inserted to trigger cookie has been created
				if (mapFeatureName !== "radarCookie" && mapFeatureName !== "radarSatCookie" && mapFeatureName !== "radar" && mapFeatureName !== "satellite") {
					//check mapFeatureVal is between 1 to theForm length (eg 1 to 13).
					if (mapFeatureVal > 0 && mapFeatureVal < theForm.elements.length) {
						//loop to get form elements
						//alert("sss: "+mapFeatureName);
						for (var e = 0; e < getNumbOfElements; e++) {
							//define each element name
							var getFormElementName = theForm.elements[e].name;
							//compair if form element name and cookie element name is match
							if (getFormElementName == mapFeatureName) {
								//set element to true
								theForm.elements[mapFeatureVal].checked = "true";
							}
						}
					}
				} else if (page_type === 'national' && mapFeatureName === "radarSatCookie") {
					natLoop = "true";
				} else if (page_type === 'national' && mapFeatureName === "radar") {
					radLoop = "true";
				} else if (page_type === 'national' && mapFeatureName === "satellite") {
					satLoop = "true";
				} else {
					if (typeof theForm.elements[mapFeatureVal] !== "undefined") {
						theForm.elements[mapFeatureVal].checked = true;
					}
				}
			}
		}
		if (page_type === 'national') {
			//check if national radar is true
			if (natLoop == "true") {
				theForm.elements[1].checked = radLoop;
				theForm.elements[2].checked = satLoop;
			} else {
				//if no cookies for national radar
				setCookie("null");
			}
		}
	} else {
		//if no cookies, create it and set elements Topography, Locations, Range and Obs as default
		setCookie("null");
	}
}
//create cookie when user click on map features
function setCookie(cookie) {
	var numbElements = document.tog.elements.length;
	var theForm = document.tog;
//if cookie is null need to add elements Topography, Locations and Range to cookie
	if (cookie == "null") {
		//get all elements
		for (var i = 0; i < numbElements; i++) {
			var elementName = theForm.elements[i].name;
//var elementVal = theForm.elements[i].checked;
			if (theForm.elements[i].checked == true || theForm.elements[i].defaultChecked == true) {
				//if (theForm.elements[i].checked == true) {
				//add cookie base on checkbox is checked, 6 is number of month
				createDelCookie(cookie_prefx+"_"+elementName, i, 6);
			}
		}
		//insert extra cookie elelment - to trigger the cookie has been created (create only once)
		if (page_type === 'national') {
			createDelCookie(cookie_prefx+"_"+"radarSatCookie", "created", 6);
		} else {
			createDelCookie(cookie_prefx+"_"+"radarCookie", "created", 6);
		}
	} else {
		//update cookie
		if (cookie == "cookie") {
			//get all elements
			for (var i = 0; i < numbElements; i++) {
				var formElementName = theForm.elements[i].name;
				//var checked = theForm.elements[i].checked;
				if (theForm.elements[i].checked == true) {
					//add cookie
					createDelCookie(cookie_prefx+"_"+formElementName, i, 6);
				} else {
					//delete cookie
					checkCookie(cookie_prefx+"_"+formElementName, i, -1);
				}
			}
		}
	}
}
//create cookie
function createDelCookie(cookieName, cookieVal, cookieExpire) {
	var expireDate = new Date();
	expireDate.setMonth(expireDate.getMonth()+(cookieExpire));
	//document.cookie = cookieName+"="+cookieVal+"; path="+cookie_path+"; expires="+expireDate.toGMTString();
	document.cookie = cookieName+"="+cookieVal+"; expires="+expireDate.toUTCString() +
							"; path="+cookie_path+"; domain="+cookie_domain;
}
//check if cookie already created
function checkCookie(getformElementName, getElemenIndex, getCookieExpire) {
	var theCookie = document.cookie.split("; ");
	for (var i = 0; i < theCookie.length; i++) {
		//split and get the element in the array
		var getCookieElementName = theCookie[i].split("=")[0];
		var cookie_elm_name = cookie_prefx+"_"+"radarCookie";
		if (page_type === 'national') {
			cookie_elm_name = cookie_prefx+"_"+"radarSatCookie";
		}
		if (getformElementName == "isCookieCreated" && getCookieElementName == cookie_elm_name) {
			//return the array
			return theCookie;
		} else {
			if (getformElementName == getCookieElementName) {
				//if element name has already created, then delete it
				createDelCookie(getformElementName, getElemenIndex, -12);
			}
		}
	}
}
function setStartTime() {
	start_time = new Date();
	start_seconds = start_time.getTime() / 1000;
}
function loop_time_OK() {
	// This whole web page should auto-refresh itself every nnn seconds
	// e.g. every 300 seconds (5 minutes).
	// If we see that the loops have been running for more than nnn seconds,
	// then assume that the browser has been iconised, which prevents html
	// refreshes, but does not stop the loop. The loop maybe uselessly
	// trying to fetch out of date images and generating a lot of 404's
	// swamping the web server.
	// So we stop the loop ourselves, and stop useless web traffic.
	// When the browser is un-iconised, the page-refresh kicks in an restarts it.
	// Usage:
	// if (loop_time_OK ()) { continue looping }
	// else { stop(); }
	now_time = new Date();
	now_seconds = now_time.getTime() / 1000;
	elapsed_seconds = now_seconds - start_seconds;
	if (elapsed_seconds < loop_limit_seconds) {
		return 1;
	} else {
		return 0;
	}
}
// Display the 'current_image'.
function display_current_image() {
	if (page_type === 'national') {
		if (radarLoop == "on" && satelliteLoop == "on") {
			//display image onto screen
			doc.animSat.src = theSatImages[current_image].src;
			doc.animation.src = theImages[current_image].src;
			//needed to prevent user aborting a load of an image when using the fwd and back loop controls
			doc.animSat.onabort = function () {
				doc.animSat.src = theSatImages[current_image].src;
			};
			doc.animation.onabort = function () {
				doc.animation.src = theImages[current_image].src;
			};
		} else if (radarLoop == "on" && satelliteLoop == "off") {
			doc.animSat.src = theImages[current_image].src;
			//display image onto screen
			doc.animation.src = theImages[current_image].src;
			//needed to prevent user aborting a load of an image when using the fwd and back loop controls
			doc.animation.onabort = function () {
				doc.animation.src = theImages[current_image].src;
			};
		} else if (radarLoop == "off" && satelliteLoop == "on") {
			doc.animation.src = theSatImages[current_image].src;
			//display image onto screen
			doc.animSat.src = theSatImages[current_image].src;
			//needed to prevent user aborting a load of an image when using the fwd and back loop controls
			doc.animSat.onabort = function () {
				doc.animSat.src = theSatImages[current_image].src;
			};
		} else {
			//if all loops off, display just background
			doc.animSat.src = clearLoop;
			doc.animation.src = clearLoop;
		}
		//correction for error by jxl - check length of images array
		//display image number if there is more than one image in the array
		if (theImages.length > 1) {
			//document.control_form.frame_nr.value = current_image+1;
			numberFram = current_image+1;
			//displayLocatTime = getLocalDateTime(theImageNames[current_image]);
			var spantag = document.getElementById("displayFrameNoLocalTime");
			//spantag.innerHTML = "Frame: "+numberFram+"<br>"+ displayLocatTime;
			spantag.innerHTML = "Frame: "+numberFram;
		}
	} else {
		//display image onto screen
		doc.animation.src = theImages[current_image].src;
		//needed to prevent user aborting a load of an image when using the fwd and back loop controls
		doc.animation.onabort = function () {
			doc.animation.src = theImages[current_image].src;
		};
		//correction for error by jxl - check length of images array
		//display image number if there is more than one image in the array
		if (theImages.length > 1) {
			//document.control_form.frame_nr.value = current_image+1;
			numberFram = current_image+1;
			var spantag = document.getElementById("displayFrameNoLocalTime");
			if (page_type === 'national') {
				spantag.innerHTML = "Frame: "+numberFram;
			} else {
				displayLocatTime = getLocalDateTime(theImageNames[current_image]);
				spantag.innerHTML = "Frame: "+numberFram+"<br>"+displayLocatTime;
			}
		}
	}
}
// get radar outage message
function getRadarOutageMgs() {
	//check to make sure if theRadarOutage object is defined
	if (window.theRadarOutage != undefined) {
		var estimatedTimeOfRetoration = "";
		var startTime = '';
		var durationType = ' hour(s)'
		if (theRadarOutage[2] == "Unknown" || theRadarOutage[3] == "Unknown") {
			estimatedTimeOfRetoration = "Unknown";
		} else {
			//work out the 'estimated time of restoration of service'
			estimatedTimeOfRetoration = getRadarRestorationDate();
		}
		if (theRadarOutage[2] !== "Unknown") {
			startTime = twentyFour2tweleveHourTime(theRadarOutage[2])
		} else {
			startTime = theRadarOutage[2];
		}
		if (estimatedTimeOfRetoration !== "Unknown") {
			var etrDateTime = estimatedTimeOfRetoration.split(' ');
			var etrDate = etrDateTime[0].replace(/\-/gi, '/');
			var etrTime = twentyFour2tweleveHourTime(etrDateTime[1]);
			estimatedTimeOfRetoration = etrDate + ' ' + etrTime;
		}
		if (theRadarOutage[3] === "Unknown") {
			durationType = '';
		}
		var startDate = theRadarOutage[1].replace(/\-/gi, '/');
		outageMgs = "<strong>Reason:</strong> " + theRadarOutage[0] +
						"<br><strong>Date:</strong> " + startDate +
						"<br><strong>Start time:</strong> " + startTime +
						"<br><strong>Duration:</strong> " + theRadarOutage[3] +
						durationType + "<br><strong>Estimated time of restoration of service:</strong> " +
						estimatedTimeOfRetoration;
		return outageMgs;
	} else {
		return "Sorry outage information is currently unavailable.";
	}
}
// get radar outage restoration date
function getRadarRestorationDate() {
	//break up the date
	var radarOutageDate = theRadarOutage[1].split("-");
	outageYear = radarOutageDate[2];
	outageMonth = radarOutageDate[1];
	outageDay = radarOutageDate[0];
	//break up the time
	var radarOutageDate = theRadarOutage[2].split(":");
	outageHrs = radarOutageDate[0];
	outageMin = radarOutageDate[1];
	durationTime = theRadarOutage[3];
	outageDate = new Date();
	//1 millisecond = 1/1000 in Epoch (used frequently with JavaScript conversions)
	//1 hour = 3600 in Epoch
	epochPerHour = 3600;
	//month - Required. A numeric value between 0 and 11 representing the month (where 0 = jan)
	//day -  	Required. A numeric value between 0 and 11 representing the month
	//index of month is theMonth - 1
	indexMonthOutage = outageMonth - 1;
	outageDate.setMonth(indexMonthOutage, outageDay);
	outageDate.setFullYear(outageYear);
	outageDate.setHours(outageHrs, outageMin, 0);
	//get how many milliseconds there are from 1970/01/01 to what ever the day/time is (for example 2008/08/20 00:40) according to universal time
	getOutageEpoch = parseInt(Date.UTC(outageDate.getUTCFullYear(), outageDate.getUTCMonth(), outageDate.getUTCDate(), outageDate.getUTCHours(), outageDate.getUTCMinutes(), outageDate.getUTCSeconds(), outageDate.getUTCMilliseconds()) / 1000);
	durationTime = durationTime * epochPerHour;
	getRestorationDateTime = calLocalTime(getOutageEpoch, durationTime, "null");
	return getRestorationDateTime;
}
function twentyFour2tweleveHourTime(inTime) {
	var ausTZOffset = {
		"NSW": 10,
		"Qld": 10,
		"Vic": 10,
		"Tas": 10,
		"SA": 9.5,
		"NT": 9.5,
		"WA": 8
	};
	var ausTZName = {
		"0": "UTC",
		11.5: "NFT",
		10: "EST",
		11: "EDT",
		9.5: "CST",
		10.5: "CDT",
		8: "WST",
		9: "WDT",
		7: "CXT"
	};
	offset = ausTZOffset[state];
	if (isdst) {
		if (state === 'NT' || state === 'SA') {
			offset = offset + 0.5;
		} else {
			offset = offset + 1;
		}
	}
	var theTime = inTime.split(':');
	var hour = parseInt(theTime[0], 10);
	var min = theTime[1];
	var ampm = 'am';
	if (hour > 12) {
		if (hour === 24) {
			hour = 12;
		} else {
			hour = hour - 12;
			ampm = 'pm';
		}
	}
	if (hour === 0) {
		hour = 12;
	}
	return hour + ':' + min + ' ' + ampm + ' ' + ausTZName[offset];
}
// get local time
function getLocalDateTime(inDate) {
	//get radar file name eg: /radar/IDR183.T.200808200040.png
	var theTime_tmp = inDate.split(".");
	var theTime = theTime_tmp[theTime_tmp.length - 2];
	//get '200808200040'
	var theDateTime = theTime.split("");
	//NFT	Norfolk (Island) Time+11:30 hours
	//EST	Eastern Standard Time+10 hours
	//EDT	Eastern Daylight Time+11 hours
	//CST	Central Standard Time+9:30 hours
	//CDT	Central Daylight Time+10:30 hours
	//WST	Western Standard Time+8 hours
	//WDT	Western Daylight Time+9 hours
	//CXT	Christmas Island Time+7 hours
	//declare associative array
	var ausTZName = {
		"0": "UTC",
		11.5: "NFT",
		10: "EST",
		11: "EDT",
		9.5: "CST",
		10.5: "CDT",
		8: "WST",
		9: "WDT",
		7: "CXT"
	};
	var ausTZOffset = {
		"NSW": 10,
		"Qld": 10,
		"Vic": 10,
		"Tas": 10,
		"SA": 9.5,
		"NT": 9.5,
		"WA": 8
	};
	dDate = new Date();
	//1 millisecond = 1/1000 in Epoch (used frequently with JavaScript conversions)
	//1 hour = 3600 in Epoch
	epochPerHour = 3600;
	//get the year
	theYear = theDateTime[0]+theDateTime[1]+theDateTime[2]+theDateTime[3];
	//get month
	theMonth = theDateTime[4]+theDateTime[5];
	//get date
	theDay = theDateTime[6]+theDateTime[7];
	//get UTC hour
	theUTCHour = theDateTime[8]+theDateTime[9];
	//get UTC min
	theUTCMin = theDateTime[10]+theDateTime[11];
	//month - Required. A numeric value between 0 and 11 representing the month (where 0 = jan)
	//day -  Required. A numeric value between 0 and 11 representing the month
	//index of month is theMonth - 1
	indexMonth = theMonth - 1;
	dDate.setMonth(indexMonth, theDay);
	dDate.setFullYear(theYear);
	dDate.setHours(theUTCHour, theUTCMin, 0);
	//get how many milliseconds there are from 1970/01/01 to what ever the day/time is (for example 2008/08/20 00:40) according to universal time
	getEpoch = parseInt(Date.UTC(dDate.getUTCFullYear(), dDate.getUTCMonth(), dDate.getUTCDate(), dDate.getUTCHours(), dDate.getUTCMinutes(), dDate.getUTCSeconds(), dDate.getUTCMilliseconds()) / 1000);
	//get offsettime
	if (isdst > 0) {
	//DST
		getTimezoneOffset = (ausTZOffset[state])+1;
		getOffsetEpoch = getTimezoneOffset * epochPerHour;
		//add one hour to TZoffset * epochPerHour
		getTZName = ausTZName[getTimezoneOffset];
		utcToLocalTime = calLocalTime(getEpoch, getOffsetEpoch, getTZName);
	} else {
		//no DST
		getTimezoneOffset = ausTZOffset[state];
		getOffsetEpoch = getTimezoneOffset * epochPerHour;
		//add one hour to TZoffset * epochPerHour
		getTZName = ausTZName[getTimezoneOffset];
		utcToLocalTime = calLocalTime(getEpoch, getOffsetEpoch, getTZName);
	}
	return utcToLocalTime;
}
//This number will be positive if you are behind UTC (e.g., Pacific Daylight Time), and negative if you are ahead of UTC (e.g., Aus).
function calLocalTime(epochTime, TZOffsetEpoch, TZName) {
	var mEpoch = parseInt(epochTime+TZOffsetEpoch);
	if (mEpoch < 10000000000) mEpoch *= 1000;
	// convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
	ddDate = new Date();
	ddDate.setTime(mEpoch);
	var localHour = ddDate.getHours();
	var localMin = ddDate.getMinutes();
	//set hour to two digit
	if (localHour < 10) {
		localHour = "0"+localHour;
	}
	//set min to two digit
	if (localMin < 10) {
		localMin = "0"+localMin;
	}
	if (TZName != "null") {
	//locatDateTime = "Time "+localHour+":"+localMin+" "+TZName+" "+ddDate.getDate()+"/"+(ddDate.getMonth()+1)+"/"+ddDate.getFullYear();
		locatDateTime = localHour+":"+localMin+" "+TZName+" "+ddDate.getDate()+"/"+(ddDate.getMonth()+1)+"/"+ddDate.getFullYear();
	} else {
		locatDateTime = ddDate.getDate()+"/"+(ddDate.getMonth()+1)+"/"+ddDate.getFullYear()+" "+localHour+":"+localMin;
	}
	return locatDateTime;
}
// Stop the animation
function stop() {
	// cancel animation (timeID holds the expression which calls the fwd or bkwd function)
	if (looping == 1) {
		clearTimeout(timeID);
	}
	looping = 0;
	return;
}
// Display animation in fwd direction in either loop or sweep mode
function animate_fwd() {
	if (nImages <= 1) return;
	current_image++;
	// increment image number
	// check if current image has exceeded loop bound
	if (current_image > last_image) {
		if (play_mode == 1) {
			//fwd loop mode - skip to first image
			current_image = first_image;
		}
		if (play_mode == 2) {
			//sweep mode - change directions (go bkwd)
			current_image = last_image;
			animate_rev();
			return;
		}
	}
	// check to ensure that current image has not been deselected from the loop
	// if it has, then find the next image that hasn't been
	while (imageNum[current_image] == false) {
		if (theImages[current_image].complete) {
			imageNum[current_image] = true;
			break;
		}
		current_image++;
		if (current_image > last_image) {
			if (play_mode == 1) current_image = first_image;
			if (play_mode == 2) {
				current_image = last_image;
				animate_rev();
				return;
			}
		}
	}
	display_current_image();
	delay_time = delay;
	if (current_image == first_image) {
		delay_time = start_dwell_multipler * delay;
	}
	if (current_image == last_image) {
		delay_time = end_dwell_multipler * delay;
	}
	//alert("delay Time: "+ delay_time+" Current Image: "+current_image);
	// call "animate_fwd()" again after a set time (delay_time) has elapsed
	// (Maybe stop the loops if we are iconised).
	if (loop_time_OK()) {
		timeID = setTimeout("animate_fwd()", delay_time);
	} else {
		if (confirm("The radar loop has timed out.  Would you like to resume?")) {
			setStartTime();
			window.focus();
			if (loop_time_OK()) {
				timeID = setTimeout("animate_fwd()", delay_time);
			}
		} else {
			stop();
		}
	}
}
// Display animation in reverse direction
function animate_rev() {
	if (nImages <= 1) return;
	current_image--;
	//decrement image number
	// check if image number is before lower loop bound
	if (current_image < first_image) {
		if (play_mode == 1) {
		//rev loop mode - skip to last image
			current_image = last_image;
		}
		if (play_mode == 2) {
			current_image = first_image;
			//sweep mode - change directions (go fwd)
			animate_fwd();
			return;
		}
	}
	// check to ensure that current image has not been deselected from the loop
	// if it has, then find the next image that hasn't been
	while (imageNum[current_image] == false) {
		//The complete property is read-only and returns a Boolean value indicating whether or not the browser has completed loading the image.
		if (theImages[current_image].complete) {
			imageNum[current_image] = true;
			break;
		}
		current_image--;
		if (current_image < first_image) {
			if (play_mode == 1) current_image = last_image;
			if (play_mode == 2) {
				current_image = first_image;
				animate_fwd();
				return;
			}
		}
	}
	display_current_image();
	delay_time = delay;
	//set interval time first image to 600 (6 m/s)
	//if (current_image == first_image)  delay_time = start_dwell_multipler*delay;
	//set interval time last image to 900 (9 m/s)
	if (current_image == last_image) delay_time = end_dwell_multipler * delay;
	//set other images 2 - 5 interval time 300 (3 m/s)
	// call "animate_rev()" again after a set amount of time (delay_time) has elapsed
	// (Maybe stop the loops if we are iconised).
	if (loop_time_OK()) {
		timeID = setTimeout("animate_rev()", delay_time);
	} else {
		if (confirm("The radar loop has timed out.  Would you like to resume?")) {
			setStartTime();
			window.focus();
			if (loop_time_OK()) {
				timeID = setTimeout("animate_rev()", delay_time);
			}
		} else {
			stop();
		}
	}
}
// Changes playing speed by adding to or substracting from the delay between frames
function change_speed(dv) {
	delay += dv;
	// check to ensure max and min delay constraints have not been crossed
	if (delay > delay_max) delay = delay_max;
	if (delay < delay_min) delay = delay_min;
}
// functions that changed the dwell rates.
function change_end_dwell(dv) {
	end_dwell_multipler += dv;
	if (end_dwell_multipler < 1) {
		end_dwell_multipler = 0;
	}
}
function change_start_dwell(dv) {
	start_dwell_multipler += dv;
	if (start_dwell_multipler < 1) {
		start_dwell_multipler = 0;
	}
}
// Increment to next image
function incrementImage() {
	var number;
	if (nImages <= 1) return;
	stop();
	current_image++;
	number = current_image;
	// if image is last in loop, increment to first image
	if (number > last_image) number = first_image;
	// check to ensure that image has not been deselected from loop
	while (imageNum[number] == false) {
		if (theImages[number].complete) {
			imageNum[number] = true;
			break;
		}
		number++;
		if (number > last_image) number = first_image;
	}
	current_image = number;
	display_current_image();
}
/*not in use but could be used to forward to 1st image of animation*/
function fwdwind() {
	var number;
	if (nImages <= 1) return;
	stop();
	number = last_image;
	// check to ensure that image has not been deselected from loop
	while (imageNum[number] == false) {
		if (theImages[number].complete) {
			imageNum[number] = true;
			break;
		}
	}
	current_image = number;
	display_current_image();
}
// Decrement to next image
function decrementImage() {
	var number;
	if (nImages <= 1) return;
	stop();
	current_image--;
	number = current_image;
	// if image is first in loop, decrement to last image
	if (number < first_image) number = last_image;
	// check to ensure that image has not been deselected from loop
	while (imageNum[number] == false) {
		if (theImages[number].complete) {
			imageNum[number] = true;
			break;
		}
		number--;
		if (number < first_image) number = last_image;
	}
	current_image = number;
	display_current_image();
}
/*not in use but could be used to rewind to last image of animation*/
function rewind() {
	var number;
	if (nImages <= 1) return;
	stop();
	number = first_image;
	// check to ensure that image has not been deselected from loop
	while (imageNum[number] == false) {
		if (theImages[number].complete) {
			imageNum[number] = true;
			break;
		}
	}
	current_image = number;
	display_current_image();
}
// "Play forward"
function fwd() {
	stop();
	looping = 1;
	play_mode = 1;
	animate_fwd();
}
// "Play reverse"
function rrev() {
	stop();
	looping = 1;
	play_mode = 1;
	animate_rev();
}
// "play sweep"
function sweep() {
	stop();
	looping = 1;
	play_mode = 2;
	animate_fwd();
}
// Change play mode (normal, loop, swing)
function change_mode(mode) {
	play_mode = mode;
}
/*
<!-- Below is the Radar moving cursor Pointer & Origin code.-->
<!-- 2007-07-24 jxl, NN4 support has been dropped, ilayer has been removed from HTML-->
<!-- Supported layout engines -->
<!-- Gecko (eg. Mozilla), KHTML (eg. safari, koqueror), Trident (eg. IE), Presto (eg. Opera)-->
<!-- 2000-07-28 Clive Edington, generalised the code to NN4.-->
<!-- Thanks to Alf West and the Radar Section for the original IE code.-->
*/
// Usage:
// (1) Call 'startxy()' once (e.g. from BODY onload="..") to start this code.
// (2) Assumes that these Image dependent variables have already been defined:
//
// GifFileName = "??.gif";
// Km = nn;	// Standard 64km, 128km, 256km or 512km radar picture.
// -----------------------------------------------------------------
//
// This code assumes a TABLE with a radar image and X, Y outputs, etc,
// and then does the logic of updating X & Y whenever the mouse moves.
if (nImages > 0) {
	var distance = "";
	// Km = nn;	// Standard 64km, 128km, 256km or 512km radar picture.
	if (Km) {
		switch (Km) {
		case 64:
			distance = "4";
			break;
		case 128:
			distance = "3";
			break;
		case 256:
			distance = "2";
			break;
		case 512:
			distance = "1";
			break;
		case 2150:
			distance = "5";
			break;
		default:
			alert("km variable not set correctly - please send feedback");
			break;
		}
	}
	ID = ID+distance;
	// Compute some internal globals.
	var maxKm = Km - 1;
	//  128km is .5 KmPerPixel,  512km is 2 KmPerPixel
	var KmPerPixel = Km / 256;
	// Internal Global variables.
	var xx = 0;
	var yy = 0;
	var zz = 0;
	var aa = 0;
	var xKm = 0;
	var yKm = 0;
	var mapx = 0;
	var mapy = 0;
	var xKmOrigin = 0;
	var yKmOrigin = 0;
	// viewer internal variables
	var overlayPath = "/products/radar_transparencies/";
	if (page_type === 'include' || page_type === 'defence' ||
		 page_type === 'reguser' ||  page_type === 'air') {
		overlayPath = "/products/reg/radar_transparencies/";
	}
	//the location of the overlays on the server
	if (page_type === 'national') {
		var viewer = "map-mask";
		//the ID of the div where the animation is located
		var viewer_new = "overlay";
	} else {
		var viewer = "overlay";
		//the ID of the div where the animation is located
	}
}
// startxy is called once after the BODY has been loaded.
// It initalises x-y stuff and sets up mouse-event callbacks.
function startxy() {
	//added to deal with text resizing around the viewer container
	//marker is currently in the right-hand panel, where loop controls are found
	var marker = document.getElementById("marker");
	if (marker) {
		var textSize = 0;
		if (window.getComputedStyle) {
			// getComputedStyle(marker, null).fontSize resulted in an exception on Netscape 7
			// needed to use getPropertyValue('font-size', null) to get the text size
			textSize = parseInt(window.getComputedStyle(marker, null).getPropertyValue('font-size', null));
		} else if (document.body.currentStyle) {
			textSize = parseInt(document.body.currentStyle.fontsize);
		} else if (document.defaultView.getComputedStyle) {
			//required for Konqueror
			textSize = parseInt(document.defaultView.getComputedStyle(marker, null).getPropertyValue('font-size'));
		}
		// setInterval is used to ensure that the page displays correctly if font is increased by ctrl-+
		setInterval(function () {
			var newSize = 0;
			if (window.getComputedStyle) {
				newSize = parseInt(window.getComputedStyle(marker, null).getPropertyValue('font-size', null));
			} else if (document.body.currentStyle) {
				newSize = parseInt(document.body.currentStyle.fontsize);
			} else if (document.defaultView.getComputedStyle) {
				newSize = parseInt(document.defaultView.getComputedStyle(marker, null).getPropertyValue('font-size'));
			}
			if (newSize != textSize) {
				textSize = newSize;
				reposition();
			}
			//required for Opera 9+
			//toggles are checked when user hits back button but overlays don't load as they should
			if (isOpera && finished == 0) {
				updateOverlays();
				finished = 1;
			}
		},
		500);
	}
	// Setup mouse-move, mouse-click(down), window onresize callbacks.
	if (page_type === 'national') {
		$('area.hot-spot').mousemove(function(e){move(e);});
	}
	if (isMS) {
		//reposition function is called if window is resized
		window.onresize = reposition;
		document.body.onmousemove = move;
		if (page_type === 'national') {
			var image_map_areas = document.getElementById('m_radar_national_web_map_satellite').children;
			document.body.attachEvent("onkeydown", function (e) {
					var evt = e ? e : window.event;
					if (evt.keyCode == 13) {
						down();
					}
				},
				true);
		} else {
			document.body.onmousedown = down;
			document.body.onclick = down;
		}
	}
	if (isGecko || isKonqueror || isOpera && !isMS) {
		// reposition function is called if window is resized
		window.addEventListener("resize", reposition, true);
		// attaching event listeners to the viewing area
		var loopArea = document.getElementById(viewer);
		if (page_type === "national") {
			//var hot_spots = document.getElementsByClassName('hot-spot');
			//for (var it = 0; it < hot_spots.length; it = it+1) {
			//	hot_spots[it].addEventListener("mousemove", move, true);
			//}
			loopArea.addEventListener("mousemove", move, true);
			loopArea.addEventListener("mousedown", down, true);
			window.document.addEventListener("keydown", function (e) {
				var evt = e ? e : window.event;
				if (evt.keyCode == 13) {
					down();
				}
			},
			true);
		} else {
			if (nImages > 0) {
				loopArea.addEventListener("mousemove", move, true);
				loopArea.addEventListener("mousedown", down, true);
			}
		}
	}
	resetOrigin();
}
//var do_once = 0;
function getYkm(e) {
	if (!e) {
		evnt = window.event;
	} else {
		evnt = e;
	}
	yKm = 9999;
	//var spantag = document.getElementById("displayY");
	if (isMS || isOpera) {

		// X-Y relative to the container (i.e. the image).
		if (evnt.srcElement && evnt.srcElement.id) {
			var animation_obj = document.getElementById('animation');
			//if (evnt.srcElement.parentNode.id == viewer) {
			if (evnt.srcElement.parentNode.id == viewer ||
				evnt.srcElement.parentNode.parentNode.id == 'map-mask' ||
				evnt.srcElement.parentNode.id == 'm_radar_national_web_map_satellite') {

				var posY;
				if( typeof( animation_obj.offsetParent ) != "undefined" ) {
					for( posY = 0; animation_obj; animation_obj = animation_obj.offsetParent ) {
						posY += animation_obj.offsetTop;
					}
				}
				var scroll_top = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
				yPixels = -((evnt.clientY+scroll_top) - (posY+1) - animation_height / 2);
				//spantag.innerHTML = yPixels;
				// Mac IE forgets to adjust for the scroll bars.
				if (isMac) {
					yPixels += document.body.scrollTop
				}
				yKm = yPixels * KmPerPixel;

			}
		}

	}
	if (isGecko || isKonqueror) {
		var element = document.getElementById(viewer);
		var distanceY = 0;
		while (element.offsetParent) {
			distanceY += element.offsetTop;
			element = element.offsetParent;
		}
		//if (e.currentTarget.id == viewer) {
		if (e.currentTarget.id == viewer ||
				e.currentTarget.parentNode.id == 'map-mask' ||
				e.currentTarget.parentNode.id == 'm_radar_national_web_map_satellite') {
			if (isGecko || isOpera) {
				//spantag.innerHTML = distanceY;
				yKm = -(e.pageY - distanceY - 256) * KmPerPixel
			}
			//take care e.clientY moves with scrolling - you don't want scrolling to have an effect
			if (isKonqueror) {
				yKm = -((e.clientY+document.body.scrollTop) - document.getElementById(viewer).offsetTop - 256) * KmPerPixel
			}
		}
	}
	return yKm;
}
function getXkm(e) {
	if (!e) {
		evnt = window.event;
	} else {
		evnt = e;
	}
	xKm = 9999;
	//var spantag = document.getElementById("displayX");
	if (isMS || isOpera) {

		// X-Y relative to the container (i.e. the image).
		if (evnt.srcElement && evnt.srcElement.id) {
			var animation_obj = document.getElementById('animation');
			//if (evnt.srcElement.parentNode.id == viewer) {
			if (evnt.srcElement.parentNode.id == viewer ||
				 evnt.srcElement.parentNode.parentNode.id == 'map-mask' ||
				 evnt.srcElement.parentNode.id == 'm_radar_national_web_map_satellite' ) {

				var posX;
				if( typeof( animation_obj.offsetParent ) != "undefined" ) {
					for( posX = 0; animation_obj; animation_obj = animation_obj.offsetParent ) {
						posX += animation_obj.offsetLeft;
					}
				}
				var scroll_left = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
				xPixels = (evnt.clientX+scroll_left) - (posX+2) - animation_width / 2;
				//spantag.innerHTML = xPixels;
				// Mac IE forgets to adjust for the scroll bars.
				if (isMac) {
					xPixels += document.body.scrollLeft
				}
				xKm = xPixels * KmPerPixel;

			}
		}

	}
	if (isGecko || isKonqueror) {
		var element = document.getElementById(viewer);
		var distanceX = 0;
		while (element.offsetParent) {
			distanceX += element.offsetLeft;
			element = element.offsetParent;
		}
		//if (e.currentTarget.id == viewer) {
		if (e.currentTarget.id == viewer ||
				e.currentTarget.parentNode.id == 'map-mask' ||
				e.currentTarget.parentNode.id == 'm_radar_national_web_map_satellite') {
			if (isGecko || isOpera) {
				//spantag.innerHTML = (e.pageX - distanceX - 256);
				xKm = (e.pageX - distanceX - 256) * KmPerPixel;
			}
			if (isKonqueror) {
				xKm = ((e.clientX+document.body.scrollLeft) - document.getElementById(viewer).offsetLeft - 256) * KmPerPixel
			}
		}
	}
	return xKm;
}
function getRounded(num) {
	num = Math.round(num) / 100;
	// Turn -0 into +0
	if (num == 0) {
		num = Math.abs(num);
	}
	return num;
}
function getMapX(lon, xKm, yKm, mapy) {
	var mapx = 100 * lon+xKm / (1.1111 * Math.cos(mapy / 5729));
	return mapx;
}
function getMapY(lat, yKm) {
	var mapy = 100 * lat+yKm / 1.1111;
	return mapy;
}
// The following subroutines are used for Pointer, Map Coordinates and Origin fields
function move(e) {
	if (!e) {
		evnt = window.event;
	} else {
		evnt = e;
	}
	// When the mouse moves, update the pointer boxes.
	// ensure that the page is completely loaded and then run getXkm and getYkm, check that those fns are defined
	if (typeof(getXkm) != "undefined" && typeof(getYkm) != "undefined") {
		xKm = getXkm(evnt);
		yKm = getYkm(evnt);
		xx = xKm - xKmOrigin;
		yy = yKm - yKmOrigin;
		zz = Math.round(Math.sqrt(xx * xx+yy * yy) - .01);
		aa = 450 - Math.round(Math.atan2(yy, xx) * 57.29);
		if (aa > 359) {
			aa = aa - 360;
		}
		if (zz < 1) {
			aa = 0;
		}
		xx = Math.round(xx);
		yy = Math.round(yy);
		// Turn -0 into +0
		if (xx == 0) {
			xx = 0;
		}
		if (yy == 0) {
			yy = 0;
		}
		if (zz == 0) {
			zz = 0;
		}
		displayPtrOrigin(aa, xx, yy, zz);
		if (doLatLon) {
			mapy = getMapY(lat, yKm);
			mapx = getMapX(lon, xKm, yKm, mapy);
			mapy = getRounded(mapy);
			mapx = getRounded(mapx);
			displayLatLon(mapx, mapy);
		}
	}
}
function displayPtrOrigin(aa, xx, yy, zz) {
	if (Math.abs(xKm) >= maxKm || Math.abs(yKm) >= maxKm) {
		document.pointer.x.value = "";
		document.pointer.y.value = "";
		document.pointer.z.value = "";
		document.pointer.a.value = "";
	} else {
		if (xx >= 0) {
			document.pointer.x.value = xx+' km East';
		} else {
			document.pointer.x.value = -xx+' km West';
		}
		if (yy >= 0) {
			document.pointer.y.value = yy+' km North';
		} else {
			document.pointer.y.value = -yy+' km South';
		}
		document.pointer.z.value = zz+' km Away';
		document.pointer.a.value = aa+' Degrees';
	}
}
// Convert decimal degrees to degrees and minutes for Map Coordinates fields
// Internal subroutine used in displayLatLon
function convertCoord(value) {
	//need to negate negative number first
	value = Math.abs(value);
	var strValue = value.toString();
	var degrees;
	var mins;
	var converted;
	if (! (strValue.substr(0, strValue.indexOf(".")))) {
		degrees = strValue+" deg ";
		mins = 0;
	} else {
		degrees = strValue.substr(0, strValue.indexOf("."))+" deg ";
		//convert decimal to mins
		mins = 60 * (strValue.substr(strValue.lastIndexOf(".")));
		mins = Math.round(mins);
	}
	mins = mins.toString();
	mins = mins+" min ";
	converted = degrees+mins;
	return converted;
}
function displayLatLon(mapx, mapy) {
	if (Math.abs(xKm) >= maxKm || Math.abs(yKm) >= maxKm) {
		if (doLatLon) {
			document.coordinates.latitude.value = "";
			document.coordinates.longitude.value = "";
		}
	} else {
		var len = document.coordinates.units.length;
		var radioNum;
		for (radioNum = 0; radioNum < len; radioNum++) {
			if (document.coordinates.units[radioNum].value == "decdeg" && document.coordinates.units[radioNum].checked == true) {
				if (mapx >= 0) {
					document.coordinates.longitude.value = mapx+' deg E';
				} else {
					document.coordinates.longitude.value = -mapx+' deg W';
				}
				if (mapy >= 0) {
					document.coordinates.latitude.value = mapy+' deg N';
				} else {
					document.coordinates.latitude.value = -mapy+' deg S';
				}
			}
			if (document.coordinates.units[radioNum].value == "degmin" && document.coordinates.units[radioNum].checked == true) {
				if (mapx >= 0) {
					document.coordinates.longitude.value = convertCoord(mapx)+'E';
				} else {
					document.coordinates.longitude.value = convertCoord(mapx)+'W';
				}
				if (mapy >= 0) {
					document.coordinates.latitude.value = convertCoord(mapy)+'N';
				} else {
					document.coordinates.latitude.value = convertCoord(mapy)+'S';
				}
			}
		}
	}
}
function down() {
	// A left-click (mouse-down) to move the Origin.
	// xKm & yKm are the distances from the centre of the radar image.
	// They were already computed in (mouse) move() above.
	// (or are zero at startup.)
	// Maybe set the new origin.
	if (Math.abs(xKm) < maxKm && Math.abs(yKm) < maxKm) {
		xKmOrigin = xKm;
		yKmOrigin = yKm;
	}
	if (xKmOrigin >= 0) {
		document.offsets.xo.value = Math.round(xKmOrigin)+' km East'
	} else {
		document.offsets.xo.value = -Math.round(xKmOrigin)+' km West'
	}
	if (yKmOrigin >= 0) {
		document.offsets.yo.value = Math.round(yKmOrigin)+' km North'
	} else {
		document.offsets.yo.value = -Math.round(yKmOrigin)+' km South'
	}
}
function resetOrigin() {
	xKm = 0;
	yKm = 0;
	down();
}
function updateIcons() {
	var imgObj = null;
	if (typeof(radarID) != "undefined") {
		for (var i in radarID) {
			if (radarID[i] != '') {
				imgObj = document.getElementById(i);
				if (imgObj != null) {
					var newLink = document.createElement("a");
					var link = "IDR"+radarID[i]+"3.loop.shtml"+skip;
					newLink.setAttribute("href", link);
					var newImg = document.createElement("img");
					newImg.setAttribute("src", "/images/radar_"+i+".png");
					newImg.setAttribute("border", 0);
					newLink.appendChild(newImg);
					var changedNode = imgObj.parentNode.replaceChild(newLink, imgObj);
					getDestination(newLink, i);
					displayDestination(newLink, i);
				}
			}
		}
	} else {
		//???
	}
	return;
}
function displayDestination(linkObj, direction) {
	if (typeof(radarName) != "undefined") {
		if (radarName[direction] != '') {
			var img = linkObj.firstChild;
			img.setAttribute("alt", radarName[direction]);
			linkObj.setAttribute("name", radarName[direction]);
			linkObj.setAttribute("title", radarName[direction]);
			return false;
		}
	}
}
function getDestination(linkObj, direction) {
	if (typeof(radarID) != "undefined") {
		if (radarID[direction] != '') {
			var link = "IDR"+radarID[direction]+"3.loop.shtml";
			linkObj.onclick = function () {
				passCheckboxes(link);
				//return false; -???
			};
		} else {
			//???
		}
	}
}
function overlayOn(feature, zValue) {
	var posX = 0;
	var posY = 0;
	if (isGecko || isMS || isKonqueror || isOpera) {
		var element, container;
		if (page_type === 'national') {
			element = document.getElementById(viewer_new);
			container = document.getElementById(viewer_new);
		} else {
			element = document.getElementById(viewer);
			container = document.getElementById(viewer);
		}
		var featureDivId = feature.name+"Div";
		while (element.offsetParent) {
			posX += element.offsetLeft;
			posY += element.offsetTop;
			element = element.offsetParent;
		}
		posX = "auto";
		posY = "auto";
		if (feature.checked || feature.type == "hidden") {
			if (feature.name != "radar" && feature.name != "satellite") {
				//if the element doesn't exist create it
				if (! (document.getElementById(featureDivId))) {
					if (document.createElement) {
						var newDiv = document.createElement("div");
						newDiv.setAttribute("id", featureDivId);
						//if(feature.name == "copyright")
						//{
						// var bgstring = "url(\""+overlayPath+"IDR."+feature.name+".png"+"\")";
						//}
						//else if(feature.name == "observations")
						if (feature.name == "observations") {
							setEventHandlers();
							if (typeof(nObsImages) != "undefined" && nObsImages > 0 && typeof(obsdata) != "undefined" && obsdata.length > 0) {
								var obsURL = obsImg[nObsImages - 1];
								var bgstring = "url(\""+obsURL+"\")";
							} else {
								// no observations available
								var bgstring = "url(\"IDR.no.observations.gif\")";
							}
						} else {
							var bgstring = "url(\""+overlayPath+ID+"."+feature.name+".png"+"\")";
						}
						container.style.width = "512px";
						container.style.height = "557px";
						container.style.position = "absolute";
						container.appendChild(newDiv);
						//get the object and then apply styling due to IE6 problems
						var featureObj = document.getElementById(featureDivId);
						featureObj.style.width = "512px";
						featureObj.style.height = "512px";
						featureObj.style.backgroundColor = "transparent";
						featureObj.style.position = "absolute";
						featureObj.style.zIndex = zValue;
						//Mac IE works out the container position differently to PC IE
						if (isMac && isMS && !isOpera) {
							container.lastChild.style.left = container.offsetParent.offsetLeft;
							container.lastChild.style.top = container.offsetParent.offsetTop;
							container.style.left = 0;
							container.style.top = 0;
						} else {
							if (isKonqueror && !isLikeGecko) {
								/* for konqueror 3.1.3 on www2 */
								var X = parseInt(document.getElementById(viewer_new).style.left);
								var Y = parseInt(document.getElementById(viewer_new).style.top);
								// konqueror will move the container unless this is done
								if (posX != X && posY != Y) {
									container.style.left = (posX - X);
									container.style.top = (posY - Y);
									container.style.left = "offset=document.body.scrollLeft";
									container.style.top = "offset=document.body.scrollTop";
								} else {
									container.style.left = posX;
									container.style.top = posY;
								}
							} else {
								/* safari positioning works with this */
								container.style.left = posX;
								container.style.top = posY;
								/* for safari positioning	- KHTML seems to need the scroll values */
								if (isSafari) {
									container.style.left = "offset=document.body.scrollLeft";
									container.style.top = "offset=document.body.scrollTop";
								}
							}
							container.lastChild.style.left = "0px";
							container.lastChild.style.top = "0px";
							//apply background to feature div last - IE6
							if (container.style.backgroundImage == "") {
								container.style.backgroundImage = "url(\""+overlayPath+"IDR.legend."+type+".png"+"\")";
								//container.style.setProperty("background-image", "url(\""+overlayPath+"IDR.legend."+type+".png"+"\")", "important");
								//alert(container.style.getPropertyPriority("background-image"));
							}
							if (feature.name !== 'nearbyRadars') {
								featureObj.style.backgroundImage = bgstring;
							}
							//attempted to use important to get around high-contrast theme in windows
							//featureObj.style.setProperty("background-image", bgstring, "important");
							//alert(featureObj.style.getPropertyPriority("background-image"));
						}
					}
				} else {
					//if the element already exists don't recreate it, just make it visible
					document.getElementById(featureDivId).style.visibility = "visible";
					if (feature.name == "observations") {
						setEventHandlers();
					}
				}
			} else {
				if (feature.name == "radar") {
					radarLoop = "on";
				} else if (feature.name == "satellite") {
					satelliteLoop = "on"
				} else {
					radarLoop = "unknown";
					satelliteLoop = "unknown";
				}
			}
		} else if (feature.checked != feature.defaultChecked || !(feature.checked) != feature.f) {
			if (feature.name != "radar" && feature.name != "satellite") {
				//make the element invisible
				if (document.getElementById(featureDivId)) {
					document.getElementById(featureDivId).style.visibility = "hidden";
				}
				if (feature.name == "observations") {
					unsetEventHandlers();
					clearObs();
				}
			} else {
				if (feature.name == "radar") {
					radarLoop = "off";
				} else if (feature.name == "satellite") {
					satelliteLoop = "off"
				} else {
					radarLoop = "unknown";
					satelliteLoop = "unknown";
				}
			}
		}
	}
}
function overlayOff(feature) {
	if (feature.name != "radar" && feature.name != "satellite") {
		var featureDivId = feature.name+"Div";
		if (document.getElementById(featureDivId)) {
			//make the element invisible
			document.getElementById(featureDivId).style.visibility = "hidden";
			if (feature.name == "observations") {
				unsetEventHandlers();
			}
		}
	} else {
		if (feature.name == "radar") {
			radarLoop = "off";
		} else if (feature.name == "satellite") {
			satelliteLoop = "off"
		} else {
			radarLoop = "unknown";
			satelliteLoop = "unknown";
		}
		//define clearn background
		clearLoop = overlayPath+ID+".background.png";
	}
}
// The tickAll and cleaAll subroutines are used to select all or clear all features
// these subroutines are triggered by the onclick event attached to the "select all" and "clear all" buttons
//put ticks in all the features checkboxes
function tickAll() {
	for (var i = 0; i < document.tog.length; i++) {
		if (document.tog[i].type == "checkbox") {
			var elementName = document.tog[i].name;
			var checked = document.tog[i].checked;
			if (document.tog[i].checked == false) {
				//clearn the cookie
				createDelCookie(cookie_prefx+"_"+elementName, i, 6);
			}
			//set all checkbox true
			document.tog[i].checked = true;
			if (document.tog[i].checked == true) {
				overlayOn(document.tog[i], document.tog[i].value);
				if (document.tog[i].name == "observations") {
					initObs(document.tog[i].checked);
					setLinks(document.tog[i].checked);
				}
				if (document.tog[i].name == "nearbyRadars") {
					setNavLinks(document.tog[i].checked);
				}
			}
		}
	}
}
//put ticks in all the features checkboxes
function clearAll() {
	for (var i = 0; i < document.tog.length; i++) {
		if (document.tog[i].type == "checkbox") {
			var elementName = document.tog[i].name;
			var checked = document.tog[i].checked;
			if (document.tog[i].checked == true) {
				//clear the cookie
				createDelCookie(cookie_prefx+"_"+elementName, i, -12);
			}
			//now untick the checkbox
			document.tog[i].checked = false;
			if (document.tog[i].checked == false) {
				overlayOff(document.tog[i]);
				if (document.tog[i].name == "observations") {
					unsetLinks(document.tog[i].checked);
					clearObs();
				}
				if (document.tog[i].name == "nearbyRadars") {
					unsetNavLinks(document.tog[i].checked);
				}
			}
		}
	}
	passCheckboxes('http://'+document.location.host+document.location.pathname);
}
function resetFeatures(){
	clearAll();
	setCookie("null");
	checkMapFeaturesFields();
	updateOverlays();
}
// The following subroutines are used for the display of Weather observations
// the setEventHandlers and unsetEventHandlers subroutines are for Weather observations only
function setEventHandlers() {
	//attach event handlers for observations
	if (isMS) {
		document.onmousemove = getObs;
	}
	if (isGecko || isKonqueror || isOpera) {
		loopArea = document.getElementById(viewer);
		loopArea.addEventListener("mousemove", getObs, true);
	}
}
function unsetEventHandlers() {
	if (isMS) {
		document.onmousemove = null;
	}
	if (isGecko || isKonqueror || isOpera) {
		loopArea = document.getElementById(viewer);
		loopArea.removeEventListener("mousemove", getObs, true);
	}
}
// Display initial observations table with some user instructions
function initObs(flag) {
	if (flag) {
		var container = document.getElementById("observationsView");
		var container1 = document.getElementById("obs-instruct");
		var child = container.firstChild;
		var child1 = container1.firstChild;
		if (typeof(child) != "undefined") {
			container.removeChild(child);
		}
		if (typeof(child1) != "undefined") {
			//container1.removeChild(child1);
			//while (container1.firstChild) {
			//	container1.removeChild(container1.firstChild);
			//}
			container1.innerHTML = '';
		}
		if (!document.getElementById("obstable")) {
			obsDIV = document.getElementById("observationsView");
			obsInstruct = document.getElementById("obs-instruct");
			obsT = document.createElement('table');
			obsTBOD = document.createElement('tbody');
			obsT.appendChild(obsTBOD);
			obsT.setAttribute("id", "obstable");
			obsDIV.appendChild(obsT);
			obsT = document.getElementById("obstable");
			obsT.setAttribute("class", "obstable");
			//className works in IE because "class" does not
			obsT.setAttribute("className", "obstable");
			tr = document.createElement('tr');
			th1 = document.createElement('th');
			th1.setAttribute("class", "marker");
			th1.setAttribute("className", "marker");
			marker1 = document.createElement('div');
			marker1.setAttribute("class", "red_legend");
			marker1.setAttribute("className", "red_legend");
			marker1.appendChild(document.createTextNode(''));
			th1.appendChild(marker1);
			th2 = document.createElement('th');
			th2.setAttribute("class", "label");
			th2.setAttribute("className", "label");
			addr = document.createElement('abbr');
			addr.setAttribute("title", "Temperature");
			addr.appendChild(document.createTextNode('Temp.'));
			th2.appendChild(addr);
			th3 = document.createElement('th');
			th3.setAttribute("class", "marker");
			th3.setAttribute("className", "marker");
			marker2 = document.createElement('div');
			marker2.setAttribute("class", "blue_legend");
			marker2.setAttribute("className", "blue_legend");
			marker2.appendChild(document.createTextNode(''));
			th3.appendChild(marker2);
			th4 = document.createElement('th');
			th4.setAttribute("class", "label");
			th4.setAttribute("className", "label");
			th4.appendChild(document.createTextNode('Wind'));
			th5 = document.createElement('th');
			th5.setAttribute("class", "marker");
			th5.setAttribute("className", "marker");
			marker3 = document.createElement('div');
			marker3.setAttribute("class", "green_legend");
			marker3.setAttribute("className", "green_legend");
			marker3.appendChild(document.createTextNode(''));
			th5.appendChild(marker3);
			th6 = document.createElement('th');
			th6.setAttribute("class", "label");
			th6.setAttribute("className", "label");
			th6.appendChild(document.createTextNode('Rain'));
			tr.appendChild(th1);
			tr.appendChild(th2);
			tr.appendChild(th3);
			tr.appendChild(th4);
			tr.appendChild(th5);
			tr.appendChild(th6);
			//th = document.createElement('th');
			//th.setAttribute("class", "align-left");
			//th.appendChild(document.createTextNode('Mouse-over observations for more detail.  Double-click for data from the last 72 hours.'));
			//tr.appendChild(th);
			obsT.tBodies[0].appendChild(tr);
			obsInstruct.appendChild(document.createTextNode('Mouse-over observations for more detail.'));
			obsInstruct.appendChild(document.createElement('br'));
			obsInstruct.appendChild(document.createTextNode('Double-click for data from the last 72 hours.'));
		}
	}
}
// Display observations in table below the radar map
// the user will select the station by mousing-over an observation on the radar map
function getObs(e) {
	//if (!e) var e = window.event;
	if (!e) {
		evnt = window.event;
	} else {
		evnt = e;
	}
	if (typeof(nObsImages) != "undefined" && nObsImages > 0 &&
		 typeof(obsdata) != "undefined" && obsdata.length > 0) {
		var tolerance = 42 * KmPerPixel //test value of nn km from event
		var mapy = 0;
		var mapx = 0;
		var xKm = getXkm(evnt);
		var yKm = getYkm(evnt);
		var container = document.getElementById("observationsView");
		var child = container.firstChild;
		var mapy = getMapY(lat, yKm);
		var mapx = getMapX(lon, xKm, yKm, mapy);
		var mapy = getRounded(mapy);
		var mapx = getRounded(mapx);
		var distanceArray = new Array();
		for (i = 0; i < obsdata.length; i++) {
			diffx = mapx - obsdata[i][4];
			//lon eg.138.47
			diffy = mapy+obsdata[i][3];
			//lat eg. -34.62, +ve number in js
			degrees = Math.sqrt(diffx * diffx+diffy * diffy) - .01;
			distanceArray[i] = degrees;
		}
		var least = distanceArray[0];
		var leastIndex = 0;
		for (j = 0; j < distanceArray.length; j++) {
			if (distanceArray[j] < least) {
				least = distanceArray[j];
				leastIndex = j;
			}
		}
		//111 km per degree
		distance = 111 * distanceArray[leastIndex];
		//alert("tolerance: "+tolerance+" distance "+distance);
		obsDIV = document.getElementById("observationsView");
		if (!document.getElementById("obstable")) {
			obsT = document.createElement('table');
			obsTBOD = document.createElement('tbody');
			obsT.appendChild(obsTBOD);
			obsT.setAttribute("id", "obstable");
			obsDIV.appendChild(obsT);
			obsT.setAttribute("class", "obstable");
			//className works in IE because "class" does not
			obsT.setAttribute("className", "obstable");
		} else {
			obsT = document.getElementById("obstable");
			while (obsTBOD.rows.length > 0) {
				obsTBOD.deleteRow(0);
			}
			tr = document.createElement('tr');
			th = document.createElement('th');
			th.setAttribute("colSpan", "6");
			//aligning the text to left
			th.setAttribute("class", "align-left");
			th.setAttribute("className", "align-left");
			if (distance < tolerance) {
				th.appendChild(document.createTextNode('Station: '+obsdata[leastIndex][14]+' '+obsdata[leastIndex][1]));
				//insert break
				th.appendChild(document.createElement('br'));
				th.appendChild(document.createTextNode('Observation recorded at: '+obsdata[leastIndex][2]));
			} else {
				//th.appendChild(document.createTextNode('Mouse-over observations for more detail.  Double-click for data from the last 72 hours.'));
				th.appendChild(document.createTextNode('Station: -'));
				//insert break
				th.appendChild(document.createElement('br'));
				th.appendChild(document.createTextNode('Observation recorded at: -'));
			}
			tr.appendChild(th);
			obsT.tBodies[0].appendChild(tr);
			tr2 = document.createElement('tr');
			th1 = document.createElement('th');
			abbr = document.createElement('abbr');
			abbr.setAttribute("title", "Temperature degrees celsius");
			abbr.appendChild(document.createTextNode('Temp. \u00B0C'));
			th1.appendChild(abbr);
			th1.setAttribute("class", "red");
			th1.setAttribute("className", "red");
			th2 = document.createElement('th');
			th2.appendChild(document.createTextNode('Dew Point '));
			th2.appendChild(document.createElement('br'));
			th2.appendChild(document.createTextNode('\u00B0 C'));
			th3 = document.createElement('th');
			abbr = document.createElement('abbr');
			abbr.setAttribute("title", "Relative Humidity percentage");
			abbr.appendChild(document.createTextNode('Rel. Hum. %'));
			th3.appendChild(abbr);
			th4 = document.createElement('th');
			abbr = document.createElement('abbr');
			abbr.setAttribute("title", "Wind Direction");
			abbr.appendChild(document.createTextNode('Wind Dir.'));
			th4.appendChild(abbr);
			th4.setAttribute("class", "blue");
			th4.setAttribute("className", "blue");
			th5 = document.createElement('th');
			th5.appendChild(document.createTextNode('Wind Speed km/h'));
			th5.setAttribute("class", "blue");
			th5.setAttribute("className", "blue");
			th6 = document.createElement('th');
			abbr = document.createElement('abbr');
			abbr.setAttribute("title", "Rainfall mm since 9am");
			abbr.appendChild(document.createTextNode('Rain. mm since 9am'));
			th6.appendChild(abbr);
			th6.appendChild(document.createTextNode(''));
			th6.setAttribute("class", "green");
			th6.setAttribute("className", "green");
			tr2.appendChild(th1);
			tr2.appendChild(th2);
			tr2.appendChild(th3);
			tr2.appendChild(th4);
			tr2.appendChild(th5);
			tr2.appendChild(th6);
			obsT.tBodies[0].appendChild(tr2);
			tr3 = document.createElement('tr');
			td1 = document.createElement('td');
			td1.setAttribute("class", "red");
			td1.setAttribute("className", "red");
			td2 = document.createElement('td');
			td3 = document.createElement('td');
			td4 = document.createElement('td');
			td4.setAttribute("class", "blue");
			td4.setAttribute("className", "blue");
			td5 = document.createElement('td');
			td5.setAttribute("class", "blue");
			td5.setAttribute("className", "blue");
			td6 = document.createElement('td');
			td6.setAttribute("class", "green");
			td6.setAttribute("className", "green");
			if (distance < tolerance) {
				if (!isNaN(obsdata[leastIndex][8])) {
					td1.appendChild(document.createTextNode(obsdata[leastIndex][8].toFixed(1)));
				} else {
					td1.appendChild(document.createTextNode("-"));
				}
				if (!isNaN(obsdata[leastIndex][7])) {
					td2.appendChild(document.createTextNode(obsdata[leastIndex][7].toFixed(1)));
				} else {
					td2.appendChild(document.createTextNode("-"));
				}
				td3.appendChild(document.createTextNode(obsdata[leastIndex][10]));
				td4.appendChild(document.createTextNode(obsdata[leastIndex][5]));
				td5.appendChild(document.createTextNode(obsdata[leastIndex][6]));
				if (!isNaN(obsdata[leastIndex][9])) {
					td6.appendChild(document.createTextNode(obsdata[leastIndex][9].toFixed(1)));
				} else {
					td6.appendChild(document.createTextNode("-"));
				}
			} else {
				td1.appendChild(document.createTextNode("-"));
				td2.appendChild(document.createTextNode("-"));
				td3.appendChild(document.createTextNode("-"));
				td4.appendChild(document.createTextNode("-"));
				td5.appendChild(document.createTextNode("-"));
				td6.appendChild(document.createTextNode("-"));
			}
			tr3.appendChild(td1);
			tr3.appendChild(td2);
			tr3.appendChild(td3);
			tr3.appendChild(td4);
			tr3.appendChild(td5);
			tr3.appendChild(td6);
			obsT.tBodies[0].appendChild(tr3);
		}
	}
}
// remove the observations shown in the table below the radar map
function clearObs() {
	var container = document.getElementById("observationsView");
	var container1 = document.getElementById("obs-instruct");
	if (document.getElementById("obstable")) {
		container.removeChild(document.getElementById("obstable"));
		container.appendChild(original_child);
	}
	if (document.getElementById("obs-instruct")) {
		container1.innerHTML = '';
		//container1.appendChild(original_child1);
	}
}
// place/activate links to nearby radars
function setNavLinks(flag, e) {
	if (!e) {
		var e = window.event;
	}
	var box = document.getElementById(viewer);
	// check if the array radarNav exists
	if (typeof(radarNav) != "undefined") {
		if (radarNav.length > 0) {
			for (k = 0; k < radarNav.length; k++) {
				var linkid = "radarlink"+k;
				if (flag && !(document.getElementById(linkid))) {
					var linkObj = null;
					var link = document.createElement("a");
					var image = document.createElement("img");
					var text = radarNav[k][0];
					image.setAttribute("src", '/images/radar_icon'+radarNav[k][3]+'.png');
					image.setAttribute("width", radar_hotspot_width);
					image.setAttribute("height", radar_hotspot_height);
					image.setAttribute("border", 0);
					link.setAttribute("href", radarNav[k][4]);
					link.setAttribute("id", linkid);
					link.setAttribute("name", linkid);
					link.setAttribute("title", text);
					link.style.position = "absolute";
					link.style.left = radarNav[k][1]+"px";
					link.style.top = radarNav[k][2]+"px";
					link.style.width = radar_hotspot_width+"px";
					link.style.height = radar_hotspot_height+"px";
					link.appendChild(image);
					link.setAttribute("class", 'radarlink'+radarNav[k][3]);
					link.setAttribute("className", 'radarlink'+radarNav[k][3]);
					link.style.zIndex = "100";
					box.appendChild(link);
					linkObj = document.getElementById(linkid);
					if (isMS || isOpera) {
						// set the returnValue to false to prevent default behaviour in links
						linkObj.onmousedown = function () {
							window.event.returnValue = false;
						};
						linkObj.onclick = function () {
							window.event.returnValue = false;
						};
						linkObj.ondblclick = function () {
							document.location.href = this.href;
						};
					} else {
						linkObj.addEventListener("ondblclick", function () {
							document.location.href = linkObj.href;
						},
						false);
						linkObj.addEventListener("click", function (e) {
							e.preventDefault();
							this.removeEventListener('click', arguments.callee, false);
						},
						false);
					}
				} else if (!flag) {
					var link = document.getElementById(linkid);
					if (link) {
						box.removeChild(link);
					}
					if (isMS || isOpera) {
						if (link) {
							link.detachEvent("ondblclick", function () {
								document.location.href = document.getElementById(linkid).href;
							});
						}
					}
				}
			}
		}
	}
}
// remove/deactivate links to  nearby radars
function unsetNavLinks(flag) {
	var box = document.getElementById(viewer);
	// check if the array obsdata exists
	if (typeof(radarNav) != "undefined" && radarNav.length > 0) {
		for (k = 0; k < radarNav.length; k++) {
			var linkid = "radarlink"+k;
			if (!flag && document.getElementById(linkid)) {
				var link = document.getElementById(linkid);
				if (link) {
					box.removeChild(link);
				}
				if (isMS) {
					link.detachEvent("ondblclick", function () {
						document.location.href = document.getElementById(linkid).href;
					});
				}
			}
		}
	}
}
// place/activate links to 72 hour observations
// links are available over every weather observation shown in the observations layer
function setLinks(flag, e) {
	if (!e) var e = window.event;
	var box = document.getElementById(viewer);
	// check if the array obsdata exists
	if (typeof(nObsImages) != "undefined" && nObsImages > 0 && typeof(obsdata) != "undefined" && obsdata.length > 0) {
		for (k = 0; k < obsdata.length; k++) {
			var linkid = "obslink"+k;
			if (flag && !(document.getElementById(linkid))) {
				var linkObj = null;
				var link = document.createElement("a");
				var text = "Observations for "+obsdata[k][1];
				//check to make sure array 13 have id product
				if (!obsdata[k][13] == "") {
					link.setAttribute("href", obsdata[k][13]);
				}
				link.setAttribute("id", linkid);
				link.setAttribute("name", linkid);
				link.setAttribute("title", text);
				link.style.position = "absolute";
				link.style.left = obsdata[k][11]+"px";
				link.style.top = obsdata[k][12]+"px";
				link.style.width = hotspot_width;
				link.style.height = hotspot_height;
				link.setAttribute("class", "obslink");
				link.setAttribute("className", "obslink");
				link.style.zIndex = "100";
				box.appendChild(link);
				linkObj = document.getElementById(linkid);
				if (isMS || isOpera) {
				// set the returnValue to false to prevent default behaviour in links
					linkObj.onmousedown = function () {
						window.event.returnValue = false;
					};
					linkObj.onclick = function () {
						window.event.returnValue = false;
					};
					linkObj.attachEvent("onmousemove", getObs);
					//add this statment to detect if there is href to product IDcode
					if (!obsdata[k][13] == "") {
						linkObj.ondblclick = function () {
							document.location.href = this.href;
						};
					}
				} else {
					linkObj.addEventListener("ondblclick", function () {
						document.location.href = linkObj.href;
					},
					false);
					linkObj.addEventListener("click", function (e) {
						e.preventDefault();
						this.removeEventListener('click', arguments.callee, false);
					},
					false);
				}
			} else if (!flag) {
				var link = document.getElementById(linkid);
				if (link) {
					box.removeChild(link);
				}
				if (isMS || isOpera) {
					if (link) {
						link.detachEvent("onmousemove", getObs);
						link.detachEvent("ondblclick", function () {
							document.location.href = document.getElementById(linkid).href;
						});
					}
				}
			}
		}
	}
}
// remove/deactivate links to 72 hour observations
// links are available over every weather observation shown in the observations layer
function unsetLinks(flag) {
	var box = document.getElementById(viewer);
	// check if the array obsdata exists
	if (typeof(nObsImages) != "undefined" && nObsImages > 0 && typeof(obsdata) != "undefined" && obsdata.length > 0) {
		for (k = 0; k < obsdata.length; k++) {
			var linkid = "obslink"+k;
			if (!flag && document.getElementById(linkid)) {
				var link = document.getElementById(linkid);
				if (link) {
					box.removeChild(link);
				}
				if (isMS) {
					link.detachEvent("onmousemove", getObs);
					link.detachEvent("ondblclick", function () {
						document.location.href = document.getElementById(linkid).href;
					});
				}
			}
		}
	}
}
// the passCheckboxes function provides a mechanism for appending user selections to URL
// the function passes looping, reloaded and map feature options
function passCheckboxes(url, refreshing) {
	//load cookie map feature elements
	if (document.tog) {
		checkMapFeaturesFields();
	}
	// is the page loading as a result of a refresh - see setInterval
	// refreshing argument is true if page is reloading from setInterval
	if (refreshing == 'true' && typeof reloaded !== 'undefined') {
		reloaded++;
	} else {
		reloaded = 0;
	}
	//toggles disappear when there are no images, so check to see if form "tog" exists
	var tmp = url.split("#");
	if (document.tog) {
		//var formarrayLen = document.tog.length;
		//var i;
		//var element;
		//var refLen = 0;
		var ref = tmp[0];
		//var queryStr = "";
		//for(i = 0; i<formarrayLen; i++)
		//{
		// element = document.tog[i];
		//
		// if (element.type == "checkbox")
		// {
		// if (element.checked == true)
		// {
		// queryStr = queryStr+element.name+"=true&"
		// }
		// }
		//}
		//queryStr = "looping="+looping+"&";
		//+ "reloaded="+reloaded+"&"+queryStr;
		//ref = ref+"?"+queryStr;
		//ref = ref+"?"+"s";
		//alert("ref:" +ref);
		//refLen = ref.length;
		//strip off trailing ampersand
		//ref = ref.substr(0, refLen - 1);
		//alert("remove amp: " +ref);
		//if (document.location.hash)
		// ref = ref+document.location.hash;
		//else
		// ref = ref+skip;
		// needed to ensure that back button works as intended
		if (reloaded > 0) {
			location.replace(ref);
			//window.location.reload();
			//self.location.replace(ref);
			//alert("URL: "+location.replace(ref));
		} else {
			//???document.location.href = ref;
		}
		//alert("last");
	} else {
		document.location.href = url;
	}
}
// Check the toggles and update any that have changed
function updateOverlays() {
//if any of the toggle checkboxes are ticked do the right thing
	if (document.tog) {
		var formarrayLen = document.tog.length;
		var i;
		var element;
		for (i = 0; i < formarrayLen; i++) {
			element = document.tog[i];
			if (element.checked != element.defaultChecked || !(element.checked) != element.defaultChecked || element.checked == false) {
				overlayOff(element);
				if (element.name == "observations") {
					unsetLinks(element.checked);
				}
			}
			if (element.checked == true) {
				overlayOn(element, element.value);
				//get the surface obs going
				if (element.name == "observations") {
					initObs(element.checked);
					setLinks(element.checked, document.onmousemove);
					setEventHandlers();
				}
				//get the nearby radars going
				if (element.name == "nearbyRadars") {
					setNavLinks(element.checked, document.onmousemove);
					setEventHandlers();
				}
			}
			// hidden field contains info for loading the  map background
			if (element.type == "hidden") {
				overlayOn(element, element.value);
			}
		}
	}
}
// called when page refreshes, onload calls launch(), which then calls toggleCheck
// ensures that user selected features are retained on reload of page
function toggleCheck() {
	var URL = document.location.href;
	var tmp = URL.split("?");
	var checked = new Array();
	var unchecked = new Array();
	var j = 0;
	var k = 0;
	//if tmp has some contents
	if (tmp.length > 1) {
		var qs = tmp[1].split("#");
		if (qs.length > 1) {
			var appended = qs[0];
		} else {
			var appended = tmp[1];
		}
		var items = appended.split("&");
		var count = 0;
		var box;
		var cmd;
		while (count < items.length) {
			var i = 0;
			box = items[count].split("=");
			if (box[0] == "looping" && box[1] == 1) {
				if (box[1] == 1) {
					looping = box[1];
					change_mode(1);
					animate_fwd();
				}
			}
			if (box[0] == "looping" && box[1] == 0) {
				if (box[1] == 0) {
					looping = box[1];
					change_mode(0);
					stop();
				}
			}
			if (box[0] == "reloaded") {
				reloaded = box[1];
			}
			var formarrayLen = document.tog.length;
			for (i = 0; i < formarrayLen; i++) {
				element = document.tog[i];
				unchecked[k] = element.name;
				k++;
				if (box[0] == element.name) {
					checked[j] = box[0];
					cmd = "document.tog."+box[0]+".checked="+box[1];
					eval(cmd);
					j++;
				}
			}
			count++;
		}
		// at this point the unchecked list contains all available checkboxes
		// so match them against those in the checked array
		// if you find a match, set the value to false - removing the element name from the array
		for (k = 0; k < unchecked.length; k++) {
			for (j = 0; j < checked.length; j++) {
				if (checked[j] == unchecked[k]) {
					unchecked[k] = "false";
				}
			}
		}
		// go through the unchecked array
		// when the value is not false in the array, the relevant checkbox checked state must be set to false
		for (k = 0; k < unchecked.length; k++) {
			if (unchecked[k] != "false") {
				cmd = "document.tog."+unchecked[k]+".checked = false";
				eval(cmd);
			}
		}
	}
	updateOverlays();
}
// the reposition subroutine controls placement of the loop container in the radar loops
// the subroutine is triggered by the onresize event of the window object
// it is also triggered by any font/text resizing detected by the setInterval in startxy()
function reposition(e) {
	//doesn't fire when user increases font size
	var loopCell = document.getElementById("overlayCell");
	var styleObj = document.getElementById(viewer).style;
	var cellX = 0;
	var cellY = 0;
	while (loopCell.offsetParent) {
		cellX += loopCell.offsetLeft;
		cellY += loopCell.offsetTop;
		loopCell = loopCell.offsetParent;
	}
	//styleObj.left=cellX+"px";
	//styleObj.top=cellY+"px";
	styleObj.left = "auto";
	styleObj.top = "auto";
	/* for safari positioning  - KHTML seems to need the scroll values */
	if (isSafari) {
		styleObj.left = "offset=document.body.scrollLeft";
		styleObj.top = "offset=document.body.scrollTop";
	}
}
// printRadarImage, buildPop and killOff are used for the printer friendly control
function printRadarImage() {
//hold onto the looping mode when user clicked the print button
	var entryMode = looping;
	//stop the loop and check if the image still exists
	stop();
	var radarImgObj = document.getElementById("animation");
	var radarImg = radarImgObj.src;
	var host = "http://"+document.location.host;

	if (radarImg.match(host, 'g') === null){ // "These are not the droids you are looking for."
		radarImg = radarImg.replace(
							/^http:\/\/[^\/]+[\/\w]*?(radar\/IDR\w{3}\.T\.\d{12}\.png)$/i,
							function (match, $1, $2) {
								return host + '/' + $1;
							});
	}

	//animation must always have a z-index=0
	var radarImgZIndex = 0;
	// vars for the urls and z-indexes for processing by perl script
	// var scriptName = "/cgi-bin/radar/print.cgi?";
	// on mirror printv2.cgi is on wwww
	// var scriptName = "http://www.bom.gov.au/cgi-bin/radar/printv2.cgi?";
	var scriptName = "/cgi-bin/radar/printv2.cgi?";
	var qString = "";
	var imgSrc = "";
	var legend = host+overlayPath+"IDR.legend."+type+".png";
	var legendZIndex = -100;
	//large negative number to insert layer into the bottom of the stack
	qString = qString+legend+"="+legendZIndex+"&";
	if (document.tog) {
		var formarrayLen = document.tog.length;
		var i;
		var element;
		var imgRef = "";
		for (i = 0; i < formarrayLen; i++) {
			element = document.tog[i];
			if (element.type == "checkbox") {
				if (element.checked == true) {
					if (element.name == "observations") {
						if (typeof(nObsImages) != "undefined" && nObsImages > 0) {
							var obsURL = obsImg[nObsImages - 1];
							imgRef = host+obsURL;
							qString = qString+imgRef+"="+element.value+"&";
						}
					} else {
						if (element.name != "nearbyRadars") {;
							imgRef = host+overlayPath+ID+"."+element.name+".png";
							qString = qString+imgRef+"="+element.value+"&";
						}
					}
				}
			}
			if (element.type == "hidden") {
				if (element.name != "nearbyRadars") {
					if (element.name == "copyright") {
						imgRef = host+overlayPath+"IDR."+element.name+".png";
						qString = qString+imgRef+"="+element.value+"&";
					} else {
						imgRef = host+overlayPath+ID+"."+element.name+".png";
						qString = qString+imgRef+"="+element.value+"&";
					}
				}
			}
		}
	}
	qString = qString+radarImg+"="+radarImgZIndex;
	var flatImg = document.createElement("img");
	var RI = radarImgObj.src;
	buildPopup(scriptName, qString, RI);
	//reset loop to state before print button was clicked
	if (entryMode == 1) {
		looping = 1;
		change_mode(1);
		fwd();
	}
}
function buildPopup(scriptName, qString, RI) {
	//pre-cache loader image
	var loaderImg = new Image();
	loaderImg.src = "/scripts/radar/images/radar_please_wait.gif";
	//pre-cache print radar image
	var radarImg = new Image();
	radarImg.src = scriptName+qString;
	var loaderW = 512;
	var loaderH = 557;
	var logoW = 250;
	var logoH = 75;
	var approx = 1.125;
	var windowFeatures = "";
	windowFeatures += "status,";
	var winW = loaderW * approx;
	var winH = (loaderH+logoH) * approx;
	windowFeatures += "height="+winH+",width="+winW+",";
	windowFeatures += "left=0,top=0,scrollbars=yes,resizable=yes";
	//left and top are supported in NN6+ and IE4+
	var newContent = "<!DOCTYPE HTML PUBLIC \"-\/\/W3C\/\/DTD HTML 4.0 Transitional\/\/EN\">\n";
	newContent += "<html>\n<head>\n<title>Printer friendly radar<\/title>\n";
	newContent += "<style type=\"text/css\">";
	newContent += "@media print { .noprint {visibility:hidden;} }";
	newContent += "</style>\n";
	//test if the radar img is still there, especially is the window is iconised and loop has stopped
	// if the user goes back to the loop in history then the cache images will be looping
	newContent += "<script language=\"JavaScript\" type=\"text/javascript\">\n";
	newContent += "function checkImage()\n";
	newContent += "{\n";
	newContent += "	var img = new Image()\;\n";
	newContent += "	img.src = \""+RI+"\"\;\n";
	newContent += "	img.onerror \= function (evt)\n";
	newContent += "	{\n";
	newContent += "		alert\(this.src+\" can't be loaded. Please refresh the radar loop and try again.\"\)\;\n";
	newContent += "	}\n";
	newContent += "	img.onload = function (evt)\n";
	newContent += "	{\n";
	newContent += "	}\n";
	newContent += "}\n";
	newContent += "</script>\n";
	newContent += "</head>\n";
	newContent += "<body onload=\"checkImage();window.opener.windowClosed=false;\" onunload=\"if (window.opener) window.opener.windowClosed=true;\">";
	newContent += "<p style=\"vertical-align:top;text-align:left;border:solid 1px #cccccc;\">\n";
	newContent += "<img src=\"/images/BM_inline.gif\" alt=\"Bureau of Meteorology\" id=\"logo\" name=\"logo\" width=\""+logoW+"\" height=\""+logoH+"\">\n";
	newContent += "</p>\n";
	newContent += "<p style=\"vertical-align:middle;text-align:center;\">\n";
	newContent += "<img src=\""+loaderImg.src+"\" alt=\"Loading, please wait...\" id=\"loader\" name=\"loader\" width=\""+loaderW+"\" height=\""+loaderH+"\">\n";
	newContent += "</p>\n";
	newContent += "<p class=\"noprint\" style=\"vertical-align:middle;text-align:center;\">\n";
	newContent += "<a href=\"javascript:print();\" style=\"margin:1px;\"><img src=\"/images/print.gif\" width=\"29\" height=\"28\" alt=\"print\" title=\"print\" border=\"0\" style=\"border:solid 1px #cccccc;\"></a>\n";
	newContent += "<a href=\"javascript:self.close();\" style=\"margin:1px;\"><img src=\"/images/close.gif\" width=\"29\" height=\"28\" alt=\"close\" title=\"close\" border=\"0\" style=\"border:solid 1px #cccccc;\"></a></p>\n";
	newContent += "</body>\n</html>";
	if (typeof(newWindow) != "undefined" && newWindow.closed == false) {
		newWindow.close();
	}
	while (!windowClosed && typeof(newWindow) != "undefined") {
		newWindow.close();
		windowClosed = true;
	}
	try {
		var newWindow = window.open("", "pop", windowFeatures);
		newWindow.document.open("text/html");
		newWindow.document.write(newContent);
		//print will not work if the output stream is left open
		newWindow.document.close() //close output stream
		//safari does not open window to correct size, call resize
		placeholder = newWindow.document.loader;
		placeholder.setAttribute("src", radarImg.src);
	} catch(err) {
		//netscape 8 has a problem with document.write to new window - error 0x805303e8
		//load in the cgi directly to get around the problem
		var newWindow = window.open(radarImg.src, "pop", windowFeatures);
	}
	if (typeof(newWindow) != "undefined") {
		newWindow.resizeTo(winW * approx, winH * approx);
	}
	if (window.focus) {
		newWindow.focus();
	}
}
// var windowClosed is utilised in the killOff subroutine
var windowClosed = true;
// killOff subroutine called called from the onunload event on the body tag
// ensuring that any popups generated are closed if the user navigates away from the radar
function killOff() {
	if (typeof(newWindow) != "undefined" && newWindow.closed == false) {
		newWindow.close();
		windowClosed = true;
	}
}
