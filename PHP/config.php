<?php
$con = mysqli_connect("localhost:3307","root","") or die ("Error: Can't Connect to Server");
$db = mysqli_select_db($con,"users") or die ("Error: Can't Connect to Server");
?>