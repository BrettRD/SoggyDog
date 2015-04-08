// IDR.browser_check.v07.js
// Below is the code to perform basic browser checking
// Previously this was done as part of the IDR.loop.vxx.js
// REVISION HISTORY
// v8 2012-08-09 PS Support for IE 10 - whilst this code is old and out-moded its
// going to be in use for some time to come so I'm updating it to handle IE10.
// - tidyed some of the code
// - useing regex to discover *real* version number for IE & Opera
// - changed the fail outcome to a confirm dialog so the user can still choose to
//   to view the page even if we have deemed their browser to be incompatable
// v7 2008-12-12 kzt support two digit for browser version IDR.browser_check.v07.js
// reason for change: browser needs to be checked before the page header loads
// v6 2006-12-22 jxl added isUnsupported
// v6 2006-11-01 jxl dropped support for NN6 browsers
// v6 2006-10-02 jxl splits off browser checking code into IDR.browser_check.v06.js

// Microsoft vs. Netscape.  See below for safer definitions.
// If either of these are true, then the mouse-distances (cursor) shows.
// If both false, then we get simple loops, but no mouse.
//
var isMS = false,			isMSold = false,			isOpera = false,		isOperaOld  = false,
	isNN4 = false,				isGecko = false,			isNetscape = false,	isKonqueror = false,
	isLikeGecko = false,		isNN6 = false,				isMac = false,			isSafari = false,
	isChrome = false,			isUnsupported = false,	upgradeMsg = false,	ver_str = '',
	realV = 0,					realVindex = 0,			debug = false;
var browser_version = parseFloat(navigator.appVersion);
//if (!browser_version) {
//	browser_version = 0.  // only do this during testing.
//}
function msg() {
	//location.replace("/products/browser.shtml");
	var message = "Sorry for the interruption, but your browser " +
						"may not display this page correctly.\n" +
						"If you still want to try and view the page press 'OK', " +
						"otherwise press 'Cancel' and you will be returned to " +
						"the previous page.";
	if (!confirm(message)) {
		history.back();
	}
}
// Currently all Internet Explorer browser contain MS as part of the app name
if (navigator.appName.indexOf("Microsoft") !== -1) {
	//IE's real browser version appears in the appVersion string
	ver_str = navigator.appVersion.match(/MSIE[^;]+;/i); // ver_str is an array
	realV = ver_str[0].match(/\d+\.\d+/i);
	realV = Math.floor(realV);
	if (browser_version >= 4 && realV >= 5) {
		isMS = true;
	}
	if (browser_version >= 4 && realV < 5) {
		isMSold = true;
	}
	// IE on Mac has different Mouse calculations.
	if (navigator.appVersion.indexOf("Mac") !== -1) {
		isMac = true;
	}
}
if (navigator.appName.indexOf("Netscape") !== -1) {
	// Netscape 6 reports v5 !!!
	if ((browser_version >= 4) && (browser_version < 5)) {
		isNN4 = true;
	}
	if (navigator.userAgent.toLowerCase().indexOf("netscape6") !== -1) {
		isNN6 = true;
	}
	if (navigator.userAgent.toLowerCase().indexOf("gecko") !== -1) {
		isGecko = true;
	}
	if (navigator.userAgent.toLowerCase().indexOf("netscape") !== -1) {
		isNetscape = true;
	}
}
if (navigator.userAgent.toLowerCase().indexOf("safari") >= 0) {
	isSafari = true;
}
if (navigator.userAgent.toLowerCase().indexOf("konqueror") !== -1) {
	isKonqueror = true;
}
// PS 2012-08-09 - Add for possible future use
if (navigator.userAgent.toLowerCase().indexOf("chrome") !== -1) {
	isChrome = true;
}
if (navigator.appVersion.toLowerCase().indexOf("like gecko") !== -1) {
	isLikeGecko = true;
}
//Opera does not accurately report version numbers
if (navigator.userAgent.toLowerCase().indexOf("opera") !== -1) {
	isOpera = true;
	ver_str = navigator.userAgent.match(/Opera[^\s]+\s/i); // ver_str is an array
	realV = ver_str[0].match(/\d+\.\d+/i);
	realV = Math.floor(realV);
	if (realV < 7) {
		isOperaOld = true;
	}
}
// if a user is using a browser that will not run the IDR.loop.v06.js code, alert them
if ((isMSold) && (!isMS || isMac) && (isMS || isNN4 || isNN6 || isOperaOld)) {
	isUnsupported = true;
	msg();
}
if (debug) {
	document.writeln("<pre style=\"font-size:1.2em;line-height:1em;\">\n");
	document.writeln("\n appName = " + navigator.appName);
	document.writeln("\n appVersion = " + navigator.appVersion);
	document.writeln("\n userAgent = " + navigator.userAgent);
	document.writeln("\n extracted Browser version = " + browser_version);
	document.writeln("\n ver_str = " + ver_str);
	document.writeln("\n realV = " + realV);
	document.writeln("\n realVindex = " + realVindex);
	document.writeln("\n isMS = "  + isMS  + ", isMac=" + isMac);
	document.writeln("\n isMSold = "  + isMSold  + ", isMac=" + isMac);
	document.writeln("\n isSafari = "  + isSafari);
	document.writeln("\n isOpera = "  + isOpera);
	document.writeln("\n isOperaOld = "  + isOperaOld);
	document.writeln("\n isNN4 = " + isNN4 + ", isNN6=" + isNN6);
	document.writeln("\n isNetscape = "  + isNetscape);
	document.writeln("\n isGecko = "  + isGecko);
	document.writeln("\n isKonqueror = "  + isKonqueror);
	document.writeln("\n isChrome = "  + isChrome);
	document.writeln("\n</pre>");
}
