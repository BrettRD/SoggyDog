/*
	Enhances 'superfish' CSS popup menus on website header
	- adevans 31/05/2012
	
	requires:
	  /libs/jquery/.../jquery.min.js
	  /libs/jquery/external/plugins/superfish/hoverIntent.js
	  /libs/jquery/external/plugins/superfish/superfish.js
*/

$(function(){
	// change menu arrow to white for browsers supporting css gradients
	if (!($.browser.msie && $.browser.version <= 9)) $('.sf-menu-pointer').addClass('white');
	$('ul.sf-menu').superfish({
		delay: 800,
		animation: { opacity: 'show' },
		speed: 0,
		autoArrows: false,
		dropShadows: false,
		onShow: function(){ $(this).siblings('.sf-menu-pointer').show(); },
		onHide: function(){ $(this).siblings('.sf-menu-pointer').hide(); }
	});
	// remove popups instantly when hovering over list items without popups
	$('ul.sf-menu li.no-menu a').hover(function(){ $('ul.sf-menu li.sfHover').removeClass('sfHover'); }, function(){ });
	// hide the tooltips when hovering - testing
	$('ul.sf-menu li').hover(
		function () {
			if ($(this).children('abbr').length > 0) {
				$(this).data('title', $(this).children('abbr').attr('title'));
				$(this).children('abbr').removeAttr('title');
				$(this).children('abbr').children('a').removeAttr('title');
			} else if ($(this).children('a').length > 0) {
				$(this).data('title', $(this).children('abbr').attr('title'));
				$(this).children('a').removeAttr('title');
			}
		},
		function () {
			if ($(this).children('abbr').length > 0) {
				$(this).children('abbr').attr('title', $(this).data('title'));
				$(this).children('abbr').children('a').attr('title', $(this).data('title'));
			} else if ($(this).children('a').length > 0) {
				$(this).children('a').attr('title', $(this).data('title'));
			}
		}
	);
});
