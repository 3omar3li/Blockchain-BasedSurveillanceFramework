<html>
<head>
	<title>Resgistration</title>
	<meta charset="UTF-8" />
	<link rel="stylesheet" type="text/css" href="style.css" >
	<link rel="stylesheet" type="text/css" href="mystylesheet.css">
	<script src="././script.js"></script>
	<script>
            function change() {
                location.assign("mainpage controller.html");
            }
        </script>
</head>

<body>
	<div id="header">
             &nbsp;&nbsp;<img onclick="change()" src="cctv.jpg"
                style="padding: 14px 16px; display: block; width: 90px; height: 70px; float: left;">
            
            <a href="mainpage controller.html">Home</a>
              
        </div>
<br>
<br>
<br>
<div id="myDiv">
  <h3 align ="center" >Add new admin</h3>
  <form onsubmit="return validation()" method="post" name="regForm" action= "register_handler.php">
		<label>First Name: *</label>
		<input type="text" name="firstName" placeholder="Your First Name" size="25" />
		<label>Last Name: *</label>
		<input type="text" name="lastName" placeholder="Your Last Name" size="25" />
		<label>Email: *</label>
		<input type="text" name="email" size="25" placeholder="Your Email" />
		<label>Password: *</label>
		<input type="password" name="password" placeholder="Your Password" size="25" />
		<label>Renter Password: *</label>
		<input type="password" name="repassword" placeholder="Enter Your Password Again" size="25" />
		<label>Role: *</label>
		<input type="text" name="role" placeholder="Enter Your Role" size="25" />
		
		<div align="center">
		<input type="submit" value="Register" />
		<input type="reset" value="Clear" onclick="clear2();" />
		
</div>
  </form>
</div>

	<div id="footer" style="margin-top:4%">&copy; Blockchain-Based Surveillance Framework</div>

</body>

</html>