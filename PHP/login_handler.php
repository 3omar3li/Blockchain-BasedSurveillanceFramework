<?php
$email = $_POST["email"];
$password = $_POST["password"];


include "config.php";


$login = "SELECT email,password FROM users WHERE email = '$email' and password = '$password'";

$result = mysqli_query($con,$login);

$count = mysqli_num_rows($result);


if($count == 1 && $role == "0"){
    session_start();
    $_SESSION["LoggedUser"] = $email;
    header('Location: mainpage.html');

}
elseif($count == 1 && $role == "1"){
     session_start();
    $_SESSION["LoggedUser"] = $email;
    header('Location: mainpage controller.html');
}

else{
    echo "invalid email or password";
}
?>