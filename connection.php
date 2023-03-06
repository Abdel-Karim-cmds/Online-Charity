<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "charity_system";

if(!$con = mysqli_connect($dbhost,$dbuser,$dbpass,$dbname))
{

	die("failed to connect!");
}
