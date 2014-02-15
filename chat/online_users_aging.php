<?php
require_once ('../config/config.php');
/* 
	This script is used because some browsers (i.e. chrome) has issues detecting window/tab close events,
	and so the corresponding onunload() and onbeforeunload() functions do not get fired, and users cannot 
	be deleted from the onlineusers table that way. Instead, we will use this aging process.

	This script will 1: check all users in the onlineusers table to see if their 'inactivity' >= $max_inactivity, 
						and delete if so. (They are considered offline)
					 2: increase all users inactivity by 1.
					 
	This script runs every 5 minutes.
	The 'inactive' value will be reset to 0 each time the online user sends GET requests to the server for new messages.
	So with $max_inactivity = 1, the chat room will kick users off within 10minutes of them closing broswer
*/

$mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);	
if($mysqli->connect_error)
	exit();

$max_inactivity = 1;

$result = $mysqli->query("DELETE FROM onlineusers WHERE inactivity = $max_inactivity");

$result = $mysqli->query("UPDATE onlineusers SET inactivity = inactivity + 1");

$mysqli->close();
?>