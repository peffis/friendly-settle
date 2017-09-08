friendly-settle
===============

A tool for figuring out who pays what to whom after a series of
transactions among members of a group - such as after a group trip or
similar. Some say it is very Swedish to be this peculiar about details
when it comes to this. Perhaps it is a cultural thing, who knows? A running 
example of this software can be found at [http://hellkvist.org/gruppresan/](hellkvist.org)

SCREEN SHOT
-----------
![screenshot](https://github.com/peffis/friendly-settle/raw/master/screenshot.png)

INSTALLING SOFTWARE
-------------------
1) Copy the content of the www folder to your php enabled web root (such
as /var/www) or to a subfolder under the web root (such as
/var/www/settle)

2) If you are want to keep others from pokeing/peeking at your list
you should password protect the folder (see your web server manual or
your web hosting company's control panel) because the software itself
does not care about authentication/authorization. 

3) Make sure the web server is php enabled. 

4) In the last line of save.php there is a URL mentioned using
127.0.0.1. You might want to change this to where you install it (such
as replacing 127.0.0.1 with somedomain.com/settle)


SETTING UP MYSQL DB
-------------------

1) Create a database in mysql called 'settle' (use some admin tool or
"create database settle;" in mysql - whatever you prefer)

2) Create a mysql user "settle" with password and grant full access to 
'settle' db to this user (use some admin tool or "grant all on
settle.* to 'list_user'@'%' identified by 'your password';" in mysql, whatever you prefer)

3) Edit config.php so that the variable MYSQL_PWD matches whatever
password you used in step 2

4) Create a table in the list database you created in step 1 (use some
admin tool or do "CREATE TABLE 'entries' ('id' text NOT NULL, 'data'
text NOT NULL);" in mysql) as the user you created in step 2. It is a
simple table with two columns of type text. The name of the column
should be 'id' and 'data'. No other database schema is being used
currently in this project. 




Acknowledgements
----------------
The icons found in the images folder are created by Deleket - 
http://www.deleket.com/ and released under CC license. 



Kind regards,
Stefan Hellkvist
