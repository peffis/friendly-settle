<?php
	include("config.php");
	header('Content-Type: text/html; charset=utf-8');

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
    <title>Account Balancing according to me</title>
    <link rel="stylesheet" type="text/css" href="css/default.css"/>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <script type="text/javascript" src="json.js"></script>
    <script type="text/javascript" 
    	    src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js">
    </script>
    <script type="text/javascript">
    	    /* <[!CDATA[ */
	    <?php
	       if (!isset($_GET['id'])) {
	       	  print("var expenses = [];\n");
		  print("var refresh_needed = false;\n");
		  print("var session_id = 'session_' + new Date().getTime() + '_' + Math.floor(Math.random() * 10000);");
	       } else {
	              $id = $_GET['id'];
	       	      $link = mysql_connect(MYSQL_HOST, MYSQL_USER, MYSQL_PWD)
                         or die("Could not connect to database");
		      mysql_select_db(MYSQL_DB) or die( "Could not select database" );	
	          
		      $query = "SELECT data FROM entries WHERE id='$id'";
		      $result = mysql_query($query);
		      $line = mysql_fetch_row($result);
		      $json_string = $line[0];
		      
		      print("var blob = JSON.parse('$json_string');\n");
		      print("var expenses = blob.expenses;\n");
		      print("var members = blob.members;\n");
		      print("var refresh_needed = true;\n");
	      	      print("var session_id = '$id';\n");
               }
	    ?>
            /* ]]> */
    </script>
    <script type="text/javascript" src="c.js"></script>
  </head>
  <body>
    <div id="frame">
    <img style="float: left; padding-right: 10px;" alt="friends" title="account balancing amongst friends" src="images/friends.png"/>

    <h1>Account balancing/Debt settling</h1>
    <p class="top">This is a free, non-commercial online application to do account balancing amongst friends who owes eachother money after, say, a group trip. It is always a mess how to work out who owes what to whom after a trip with many transactions in various group arrangements. Hopefully this application can help you and your friends to calculate this in an easy way, either when you are back from the trip or as you go along.</p>
    <p class="top"><b>How it works:</b> You add all members of the group and all the expenses that the members have done together with the persons that took part in consuming the various expenses. The program will then calculate each and everyone's debt as well as suggest a transaction plan to zero out all debts. You will then be able to save the data and retrieve a URL to pass along to your friends.</p>
    <p class="top"><b>Disclaimer:</b> The author and administrator of the application does not take any responsibility of the application's correctness. Use it at your own risk and, to be sure, double-check its calculations by looking into the generated table afterwards.</p>

    <div id="step1">
	<h2>Step one - add members</h2>
        <div>
	   <p>Add member</p>
	   <p>
	   	   <span><input id="mname" type="text" name="mname"/></span>
	   	   <span><img title="click to add member" alt="click to add member" id="addmember" src="images/add.png"/></span>
           </p>
	</div>

	<div id="member_container">
	   <p>Members</p>
	   <p><ul id="members"></ul></p>
	</div>
    </div>    


    <div id="step2">
        <h2>Step two - add expenses <br/>(or continue adding members above)</h2>	   

	<table class="invisible">
	<tr class="invisible">
        <td class="invisible">
	     <p>Who paid?</p>
	     <ul class="member_box step2_1" id="member_select"></ul>
	</td>


	<td class="invisible">
		<p>Amount paid</p>
	   	<input type="text" id="amount" name="amount"/>
		<p>Description</p>
		<input type="text" id="description" name="description"/>
	</td>

	<td class="invisible">
		<p>Who consumed?</p>
	   	<ul class="member_box" id="consumer_select"></ul>
	</td>
	<td class="invisible">
	<img id="store" title="click to add expense" alt="click to add expense" src="images/add.png"/>
	</td>
	</tr></table>
    </div>

    <div id="step3">

       <h2>Step three - review, save and send<br/>(or continue adding expenses above)</h2>
       <div id="table">

       </div>
       <h3>How to zero out all debts</h3>
		<ul id="solution">
       		</ul>
       <p>Note: This is a naive solution that tries to minimize the number of transactions. There may be smarter ways to solve this depending on your particular constraints (such as if you try to minimize the total amount transferred or number of transactions), especially if members are willing to cancel debts below a certain threshold.</p> 

       <p><img id="save" alt="Click to save this data" title="Click to save this data" 
src="images/save.png"/></p>
       <p id="save_status"></p>
    </div>
    </div>
    <div class="footer">Copyright &#169; 2010, <a href="http://hellkvist.org">Stefan</a> <a href="http://standingonabeach.com">Hellkvist</a><br/>Icons used on this page are created by <a href="http://www.deleket.com/">Deleket</a> and released under CC license</div>    
  </body>
</html>
