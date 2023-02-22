<?php

session_start();

if(isset($_SESSION['myname']))
{
    unset($_SESSION['myname']);
}
if(isset($_SESSION['myid']))
{
    unset($_SESSION['myid']);
}
header("Location: login.php");
