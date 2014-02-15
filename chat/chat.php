<?php

require_once ('../config/config.php');
$mysqli = new mysqli($mysql_host, $mysql_user, $mysql_password, $mysql_database);	
if($mysqli->connect_error)
	exit();

$username = $_GET['username'];
$message = $_GET['message'];
$action = $_GET['action'];
$last_message_id = $_GET['lastmsgid'];

if ($action == 'post_new')
	insert_message($username, $message);
else if ($action == 'new_user'){
	insert_user($username);
	exit();
}
else if ($action == 'remove_user'){
	remove_user($username);
	exit(); // don't need to send any response back since user exited
}

reset_user_inactivity($username);
$response = get_messages($last_message_id);

//Headers are sent to prevent broswers from caching
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header("Content-Type: text/xml");
echo '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';

echo '<response>';

echo $response;

echo '</response>';


function insert_message($username,$message){
	global $mysqli;
	
	if($username == '' || $message == '')
		return;
		
	// Insert the message into database
	$username = $mysqli->real_escape_string($username); // prevents user typing random sql code in textbox to hack database
	$message = $mysqli->real_escape_string($message);
	$query = "INSERT INTO chat (username, message,time_added)
	VALUES ('$username', '$message',now())";
	$result = $mysqli->query($query);
}

function insert_user($username){
	global $mysqli;
	
	// construct the response
	header('Cache-Control: no-cache, must-revalidate');
	header('Pragma: no-cache');
	header("Content-Type: text/xml");
	echo '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';

	echo '<response>';
	echo '<response_type>username_check</response_type>';
	
	$username = $mysqli->real_escape_string($username);
	
	// check for duplicate username
	$query = "SELECT *
	FROM onlineusers
	WHERE username = '$username'
	COLLATE Latin1_General_CS"; //for case sensitivity
	$result = $mysqli->query($query);
	
	if ($result->num_rows){ // we have duplicate usernames
		echo '<result>duplicate</result>';
		echo '</response>';
		return;
	}
	else { // we dont have duplicate usernames
		$ip = $_SERVER['REMOTE_ADDR'];
		$query = "INSERT INTO onlineusers (username,ipaddr,online_since)
		VALUES ('$username','$ip',now())";
		$result = $mysqli->query($query);
		
		// Code to display System message for user join
		/*
		$query = "INSERT INTO chat (username, message,time_added)
		VALUES ('System', '$username has joined!',now())";
		$result = $mysqli->query($query);
		*/
		
		echo '<result>ok</result>';
		echo '</response>';
	}

}

function remove_user($username){
	global $mysqli;
	$username = $mysqli->real_escape_string($username);
	$query = "DELETE FROM onlineusers
	WHERE username='$username'
	LIMIT 1";
	$result = $mysqli->query($query);	
}

function get_messages($last_message_id){
	global $mysqli;
	$response = '<response_type>chat_comm</response_type>';
	$response .= '<display>';
	// Retrieve all messages from database
	$query = "SELECT username, message, time_added
	FROM chat 
	WHERE id > '".$last_message_id."'
	ORDER BY id";
	$result = $mysqli->query($query);

	if($result->num_rows){
		while($row = $result->fetch_array(MYSQLI_ASSOC)){
			$username = $row['username'];
			$message = $row['message'];
			$time = $row['time_added'];
			$response .= "<username>$username</username><message>$message</message><time>$time</time>";
		}
		$result->close();
	}
	$response .= '</display>';
	// Retreive online users
	$response .= '<online>';
	$query = 'SELECT username 
	FROM onlineusers';
	$result = $mysqli->query($query);

	if($result->num_rows){
		while($row = $result->fetch_array(MYSQLI_ASSOC)){
			$username = $row['username'];
			$response .= "<username>$username</username>";
		}
		$result->close();
	}
	$response .= '</online>';
	// Retreive the last message id
	$query = "SELECT id
	FROM chat 
	ORDER BY id
	DESC LIMIT 1";
	$result = $mysqli->query($query);
	
	if ($row = $result->fetch_array(MYSQLI_ASSOC)){
		$msgid = $row['id'];
		$response .= "<lastmsgid>$msgid</lastmsgid>";
	}
	else
		$response .= "<lastmsgid>0</lastmsgid>";
	
	$result->close();
	
	return $response;
}

function reset_user_inactivity($username){
	global $mysqli;
	$query = "UPDATE onlineusers
	SET inactivity = 0
	WHERE username = '$username'";
	$result = $mysqli->query($query);
}
?>
