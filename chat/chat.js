var xmlHttp = createXmlHttpRequestObject();
xmlHttp.onreadystatechange = handleServerResponse;
var read_message_timeout = -1;
var username = '';
var last_message_id_received = 0;
var scroll_messages = true;
var layout_mode = 'small'; //default when page open is small

window.onresize = function(){
	if (layout_mode == 'large'){
		var windowWidth = $(window).width();
		var screenHeight = $('#left_sidebar').height();
		var mainWidth = windowWidth - 170 - 2; // for the left sidebar and some guardband
		var mainHeight = screenHeight - 44;
		var displayWidth = mainWidth - 6 - 2; // for padding and some guardband
		var displayHeight = mainHeight - 54;
		$('#main').css({'width':mainWidth,'height':mainHeight});
		$('#display').css({'width':displayWidth,'height':displayHeight});
	}
}

window.onunload = function() {
	if (!username || username == null || username == '')
		return;
	//alert('Bye '+username);
	// Need to remove user from DB
	xmlHttp.open("GET", "chat.php?username=" + username 
		+ "&message=null&action=remove_user", true); // make the request
	xmlHttp.send(null);	// send the request
}

window.onbeforeunload = function() {
	if (!username || username == null || username == '')
		return;
	//alert('Bye '+username);
	// Need to remove user from DB
	xmlHttp.open("GET", "chat.php?username=" + username 
		+ "&message=null&action=remove_user", true); // make the request
	xmlHttp.send(null);	// send the request
}

function createXmlHttpRequestObject() {
	var xmlHttp;
	
	if(window.ActiveXObject){ // if user is using IE
		try{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}catch(e){ // if their IE is too stupid to set the obj correctly
			xmlHttp = false;
		}
	}else{
		try{
			xmlHttp = new XMLHttpRequest();
		}catch(e){
			xmlHttp = false;
		}
	}
	
	if(!xmlHttp)
		alert('cant create that object');
	else 
		return xmlHttp;
}

// called onload
function page_init(){
	var d = new Date();
	var welcomeElement = document.getElementById("welcome");
	//welcomeElement.innerHTML = 'Sorry, Chat is currently unavailable. ';
	welcomeElement.innerHTML = 'Welcome to Jerry\'s chat! '+ d + 'Layout weird?->Firefox';
	prompt_and_check_and_set_username(true);
	//process('read_messages');
}

/*
	ACTION can be 'post_new', 'read_messages'
*/
function process(action){
	
	if(xmlHttp.readyState == 4 || xmlHttp.readyState == 0){ // states 0&4 means that the obj isnt busy and can communicate with the server
		
		if (action == 'post_new'){
			var message = encodeURIComponent(document.getElementById('message').value);
			document.getElementById('message').value = ''; // reset the message box
			document.getElementById('message').focus();
		}
		xmlHttp.open("GET", "chat.php?username=" + username 
			+ "&message=" + message
			+ "&action=" + action
			+ "&lastmsgid=" + last_message_id_received, true); // make the request
		
		xmlHttp.send(null);	// send the request
		
		
	}else{
		clearTimeout(read_message_timeout);
		setTimeout(function(){process(action)},500);
	}
}

function prompt_and_check_and_set_username(first_try){
	// check for a valid username
	while (username == null || username == '' || username.toLowerCase().match('(system|jerry)' )){ // ask for username for this session if nothing entered into username box
		if (first_try)
			username = prompt("Please enter a name for this session");
		else username = prompt("This name may have been taken\nPlease enter another name for this session");
	}
		
	// tell server a new user entered
	xmlHttp.open("GET", "chat.php?username=" + username 
		+ "&message=null&action=new_user&lastmsgid=" + last_message_id_received, true); // make the request
	xmlHttp.send(null);	// send the request
}

function handleServerResponse(){
		
	if(xmlHttp.readyState == 4){ // if obj is done communicating
		if(xmlHttp.status == 200){
			
			if (!username){ // username can be null if the user blocks popups
				location.reload();
				return;
			}
			
			var xmlResponse = xmlHttp.responseXML;
			var xmlDocumentElement = xmlResponse.documentElement;
			
			
			if (xmlDocumentElement.childNodes[0].textContent == 'chat_comm'){ // normal periodic relay of chat information
				handle_chat_comm(xmlDocumentElement);
			}else if(xmlDocumentElement.childNodes[0].textContent == 'username_check'){
				handle_username_check(xmlDocumentElement);
			}
			
		}else{
			//alert('something went wrong');
			clearTimeout(read_message_timeout);
			read_message_timeout = setTimeout(function(){process('read_messages')},10000);
		}
	}
}

function handle_chat_comm(xmlDocumentElement){
	// Check if new messages
	var msgid = parseInt(xmlDocumentElement.childNodes[3].textContent);
	if (msgid > last_message_id_received) {// there are new messages
		last_message_id_received = msgid;
		// Update the #display
		var displayElement = xmlDocumentElement.childNodes[1];
		var num_displayElements = displayElement.childElementCount;
		var display_username;
		var message;
		var time;
		var final_display = '';
		for (var ielement = 0; ielement<num_displayElements; ielement = ielement+3){
			display_username = displayElement.childNodes[ielement].textContent;
			message = displayElement.childNodes[ielement+1].textContent;
			time = displayElement.childNodes[ielement+2].textContent;
			if (display_username == 'System') // display system messages in a different color
				final_display += '<span style="color:DimGray">[' + time + ']</span> <span style="color:red">' + display_username +'</span>: ' + message + '<br />';
			else 
				final_display += '<span style="color:DimGray">[' + time + ']</span> <span style="color:blue">' + display_username +'</span>: ' + message + '<br />';
		}
		var displayElement = document.getElementById("display");
		displayElement.innerHTML += final_display;
		if (scroll_messages)
			displayElement.scrollTop = displayElement.scrollHeight; //scroll the display to bottom
	}
	
	// Update #online_users
	final_display = '';
	var usersElement = xmlDocumentElement.childNodes[2];
	var num_usersElements = usersElement.childElementCount;
	for (var ielement = 0; ielement<num_usersElements; ielement++){
		display_username = usersElement.childNodes[ielement].textContent;
		final_display +='<span style="color:DarkSlateGray">' + display_username +'</span><br />';
	}
	var usersElement = document.getElementById("online_users_list");
	usersElement.innerHTML = final_display;
	
	clearTimeout(read_message_timeout);
	read_message_timeout = setTimeout(function(){process('read_messages')},1000);
}

function handle_username_check(xmlDocumentElement){
	if (xmlDocumentElement.childNodes[1].textContent == 'ok'){ // not a duplicate username
		// disable editing username
		document.getElementById('sessionname').innerHTML = username + ':';
		username = encodeURIComponent(username); 
		// continue reading messages
		clearTimeout(read_message_timeout);
		process('read_messages');
	}
	else { // duplicate username!
		//reset username to '' and prompt again
		username = '';
		prompt_and_check_and_set_username();
	}
}

function change_scroll_behavior(type){
	if (type == 'auto'){
		// set the scroll flag
		scroll_messages = true;
	}
	else if(type == 'none')
		scroll_messages = false;
}

function switch_layout(){
	switch_main_div();
	switch_left_sidebar_div();
	switch_css();
	if (layout_mode == 'small'){
		layout_mode = 'large'
		document.getElementById('switch_layout').value = 'shrink';
	}
	else {
		layout_mode = 'small';
		document.getElementById('switch_layout').value = 'expand';
	}
}

function switch_main_div(){
	if (layout_mode == 'small'){ // want to change layout to large
		var windowWidth = $(window).width();
		var screenHeight = $('#left_sidebar').height();
		var mainWidth = windowWidth - 170 - 2; // for the left sidebar and some guardband
		var mainHeight = screenHeight - 44;
		var displayWidth = mainWidth - 6 - 2; // for padding and some guardband
		var displayHeight = mainHeight - 54;
		//$('#main').css({'width':mainWidth,'height':mainHeight,'min-width':1000,'padding-left':170,'padding-bottom':5});
		$('#main').animate({'width':mainWidth,'height':mainHeight,'min-width':1000,'padding-left':170,'padding-bottom':5});
		$('#display').css({'width':displayWidth,'height':displayHeight,'border-left':'none'});
	}
	else { // want to change layout to small
		$('#main').css({'width':700,'height':'auto','min-width':'0px','padding-left':10,'padding-bottom':0});
		//$('#main').animate({'width':700,'height':'408px','min-width':'0px','padding-left':10,'padding-bottom':0});
		$('#display').css({'width':510,'height':350,'border-left':'1px solid rgb(130,130,130)'});
	}
}

function switch_left_sidebar_div(){
	if (layout_mode == 'small'){ // change layout to large 
		// add the #online_users to the left_sidebar 
		document.getElementById('left_sidebar').appendChild(document.getElementById('online_users'));
		
		// set #navbar to invisible
		$('#navbar').css({'display':'none'});
		// show  #left_sidebar
		$('#left_sidebar').css({'display':'inline'});
	}
	else { // change layout to smaller
		// add the #online_users back to #online_users_wrapper
		document.getElementById('online_users_wrapper').appendChild(document.getElementById('online_users'));
		// set #left_sidebar to invisible
		$('#left_sidebar').css({'display':'none'});
		// show  #navbar
		$('#navbar').css({'display':'inline'});	
	}
}

function switch_css(){ // change other css properties of shared divs
	if (layout_mode == 'small'){
		$('#page').css({'width':'100%','box-shadow':'none','margin':0,'padding':0});	
		$('#online_users').css({'width':'100%','height':'auto','border':'none'});	
		$('#welcome').css({'width':'auto'});	
	}
	else { // want to change to smaller layout
		$('#page').css({'width':'920px','box-shadow':'0px 0px 20px 3px rgb(211, 211, 211)','margin-left':50,'margin-top':'10px','padding':'10px 0px 20px 20px'});
		$('#online_users').css({'width':'146px','height':'350px','border':'1px solid rgb(130,130,130)','border-top':'none'});
		$('#welcome').css({'width':'670px'});	
	}
}

$(function(){
	$("#message").keyup(function(event){
		if(event.keyCode == 13){
			process('post_new');
		}
	});
});