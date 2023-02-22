<?php
$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$email = $_POST["email"];
$password = $_POST["password"];
$role = $_POST["role"];

include "config.php";

$insertUser = "INSERT INTO users(firstName,lastName,email,password,role)
values('$firstName','$lastName','$email','$password','$role')";

$result = mysqli_query($con,$insertUser);

if($result){
    echo '<script>alert("User Created Successfully")</script>';
    header('Location: login.php');
}
else{
    echo "Error:".mysqli_error($con);
}
?>