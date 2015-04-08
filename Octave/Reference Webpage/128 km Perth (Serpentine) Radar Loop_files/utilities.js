// New BoM Javascript Menu beta

var menuClass = 'collapsingMenu';
var timeId = 'timestamp';
var menuParent = '';

function init(){
//	fixLayout();
	initMenu();
	changeToLocalTime();
}

function changeToLocalTime(){
	var timeStringPattern =/\s?(\d{2}):(\d{2})[\sA-z]+(\d{1,2})\s(\w+)\s(\d{4})/ ;
	var timeTag = document.getElementById(timeId).getElementsByTagName('strong')[0];
	var UTCString = timeTag.firstChild.nodeValue;
	var localString = '';
	var timeArray = UTCString.match(timeStringPattern);
	var timeObject = new Date();
	var now = new Date();
	var month = 0;
	
	if(timeArray){
		switch(timeArray[4]){
			case 'January'	: month = 0; break;
			case 'February'	: month = 1; break;
			case 'March'		: month = 2; break;
			case 'April'		: month = 3; break;
			case 'May'			: month = 4; break;
			case 'June'			: month = 5; break;
			case 'July'			: month = 6; break;
			case 'August'		: month = 7; break;
			case 'September': month = 8; break;
			case 'October'	: month = 9; break;
			case 'November'	: month = 10; break;
			case 'December'	: month = 11; break;
			default: month=12;
		}
		
		timeObject.setUTCHours(timeArray[1]);
		timeObject.setUTCMinutes(timeArray[2]);
		timeObject.setUTCDate(timeArray[3]);		
  	timeObject.setUTCMonth(month);
		timeObject.setUTCFullYear(timeArray[5]);

		localString = getTimeString(timeObject.getHours(), timeObject.getMinutes(), timeObject.getDay(), timeObject.getDate(), timeObject.getMonth(), timeObject.getFullYear(), now.toString());
		timeTag.replaceChild(document.createTextNode(localString), timeTag.firstChild);
	}
}

function getTimeString(hour, minute, day, date, month, year, localString){
	var dateString = '';
	var localOffset = localString.match(/[GMT|UTC]{3}\+(\d{4})/);

	dateString += hour < 9 ? '0'+hour : hour;
	dateString += ':';
	dateString += minute < 9 ? '0'+minute : minute;
	dateString += ' on ';
	
	switch(day){
		case 0	: dateString += "Sunday "; break;
		case 1	: dateString += "Monday "; break;
		case 2	: dateString += "Tuesday "; break;
		case 3	: dateString += "Wednesday "; break;
		case 4	: dateString += "Thursday "; break;
		case 5	: dateString += "Friday "; break;
		case 6	: dateString += "Saturday "; break;
	}

	dateString += date < 9 ? '0'+date : date;

	switch(month){
		case 0	: dateString += " January "; break;
		case 1	: dateString += " February "; break;
		case 2	: dateString += " March "; break;
		case 3	: dateString += " April "; break;
		case 4	: dateString += " May "; break;
		case 5	: dateString += " June "; break;
		case 6	: dateString += " July "; break;
		case 7	: dateString += " August "; break;
		case 8	: dateString += " September "; break;
		case 9	: dateString += " October "; break;
		case 10	: dateString += " November "; break;
		case 11	: dateString += " December "; break;
	}

	dateString += year;
	
	switch(localOffset[1]){
		case '0800' : dateString += " (AWST)"; break;
		case '0930' : dateString += " (ACST)"; break;
		case '1000' : dateString += " (AEST)"; break;
		case '1030' : dateString += " (ACDT)"; break;
		case '1100' : dateString += " (AEDT)"; break;
	}
	
	return dateString;
}

function initMenu() {
	var possibleMenus = document.getElementsByTagName('ul');
	var menuItems = Array();
	
	if(possibleMenus.length){
		for(var k=0; k<possibleMenus.length; k++){
			if(possibleMenus[k].className.match(menuClass)){
				identifyHierarchy(possibleMenus[k]);
			}
		}
	}	
}

function identifyHierarchy(menu){
	
	var menuItems =  menu.getElementsByTagName('li');
	
	if(menuItems.length){ 
		
		for(var i=0;i<menuItems.length;i++){
			if(menuItems[i].getElementsByTagName('ul').length>0){
				menuItems[i].className = "closed";
				createEventListener(menuItems[i], "click", menuAction);
			} else {
				createEventListener(menuItems[i], "click", menuVoid);
			}
		}
	
		openToLocation(menu);	
	}
}

function openToLocation(menu){
	if (menuParent == '') {
		var path = normalisePathString(window.location.href);
	} else {
		var path = menuParent;
	}
	var components = path.split('/');
	var menuItem = null;

	while(menuItem==null && components.length){
		menuItem = findAppropriateLink(menu, path);
		if(menuItem==null){
			components.pop();
			path = components.join('/');
		}
	}

	if(menuItem){
		while(menuItem!=menu){
			if(menuItem.nodeName=="LI" && menuItem.className.length){
				menuItem.className = "open";
			}
			menuItem = menuItem.parentNode;
		}
	}
}

function findAppropriateLink(menu, path){
	
	var links = menu.getElementsByTagName('a');
	var currentElement = null;
	
	for(var i=0;i<links.length;i++){

		href = normalisePathString(links[i].getAttribute('href'));
	
		if(href==path){
			currentElement = links[i];
			links[i].className = 'currentPage';
		}
	}
	
	return currentElement;
}

function normalisePathString(pathString){
	var host = window.location.protocol+'//'+window.location.host;
	var cleanPath = pathString.replace(host, '');
	var splitPath = '';
	
	cleanPath = cleanPath.split('#')[0];
	cleanPath = cleanPath.split('?')[0];		
	cleanPath = cleanPath.split('&')[0];
	
	splitPath = cleanPath.split('/');

	if(splitPath[splitPath.length-1].split('.')[0]=='index')
		splitPath.pop();

	cleanPath = splitPath.join('/');

	if(cleanPath.charAt(cleanPath.length-1)=='/'){
		cleanPath = cleanPath.substr(0,cleanPath.length-1);
	}

	return cleanPath;
}

function menuAction(e){
	e = e ? e : window.event;
	target = e.target ? e.target : e.srcElement;
	
	if(target.className == "open"){
		target.className = "closed";
	} else {
		target.className = "open";		
	}

	if(target.name==undefined){
		cancelEvent(e);
	} else {
		window.location = target;
	}
	
	return false;
}

function menuVoid(e){
	e = e ? e : window.event;
	target = e.target ? e.target : e.srcElement;

	if(target.name==undefined){
		cancelEvent(e);
	} else {
		window.location = target;
	}
	
	return false;
}

function createEventListener(element, eventName, callback)
{
	
  if(element.addEventListener){
    element.addEventListener(eventName, callback, false);
  } else if(element.attachEvent) {
    element.attachEvent("on" + eventName, callback);
	}
	
	return false;
}

function killEventListener(element, eventName, callback)
{
  if(typeof(element) == "string")
    element = document.getElementById(element);
  if(element == null)
    return;
  if(element.removeEventListener)
  {
    if(eventName == 'mousewheel')
    {
      element.removeEventListener('DOMMouseScroll', callback, false); 
    }
    element.removeEventListener(eventName, callback, false);
  }
  else if(element.detachEvent)
    element.detachEvent("on" + eventName, callback);
}

function cancelEvent(e){
  if(!e){
		e = window.event;
	}
	
	if(e.stopPropagation){
		e.stopPropagation();
	}
	
	if(e.preventDefault){
    e.preventDefault();
	}
	
	e.cancelBubble = true;
	e.cancel = true;
	e.returnValue = false;
	
	return false;
}
/*
function fixLayout(){
	if(navigator.userAgent.match('BlackBerry')){
//		document.getElementsByTagName('html').item(0).style.height = "100%";		
//		document.getElementsByTagName('body').item(0).style.height = "auto";		
		document.getElementsByTagName('body').item(0).style.overflow = "visible";		
	}
}
*/
createEventListener(window, 'load', init);