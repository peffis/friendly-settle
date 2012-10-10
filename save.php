<?php
include("config.php");

if (!isset($_POST['id']) || !isset($_POST['data'])) {
   exit("no variables set");
}

$id = $_POST['id'];
$data = strip_tags($_POST['data']);

$link = mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PWD)
                 or die("Could not connect to database");
mysql_select_db(MYSQL_DB) or die( "Could not select database" );	


$query = "DELETE from entries WHERE id='$id'";
mysql_query($query);

$query = "INSERT INTO entries (id, data) VALUES('$id', '$data')";
mysql_query($query);

print("Data saved successfully. Your persisted URL for this data is:<br/>" . 
	    "<a href=\"http://127.0.0.1/index.php?id=$id\">http://127.0.0.1/index.php?id=$id</a>");

?>
