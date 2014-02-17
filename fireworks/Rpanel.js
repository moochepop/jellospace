$.fn.slideFadeToggle  = function(speed, easing, callback) {
        return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
};

function toggleRpanel(speed, easing, callback){
	if (rpanelOut) {
		$('#rpanel').animate({opacity: '0', height: '0'}, speed, easing, callback);
		$('img', '#rpanel_toggle').attr('src', 'images/rpanel_show.png');
		rpanelOut = false;
	}
	else {
		$('#rpanel').animate({opacity: '0.7', height: '100%'}, speed, easing, callback);
		$('img', '#rpanel_toggle').attr('src', 'images/rpanel_hide.png');
		rpanelOut = true;
	}
}

