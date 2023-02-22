<html>
<head>
	<title>Login</title>
	<meta charset="UTF-8" />
	<link rel="stylesheet" type="text/css" href="style.css">
	<link rel="stylesheet" type="text/css" href="mystylesheet.css">
 	<script src="script_login.js"></script>
	<script>
            function change() {
                location.assign("index.html");
            }
        </script>
</head>

<body>
	<div id="header" class="menu">
             &nbsp;&nbsp;<img onclick="change()" src="cctv.jpg"
                style="padding: 14px 16px; display: block; width: 90px; height: 70px; float: left;">
				<a href="about.html">About</a>
                <a href="././signup.php">Sign up</a>
                <a href="index.html">Home</a>
              
        </div>
<br>
<br>
<br>
<br>
<div id="myDiv">
  <h3 align ="center" >Login</h3>
  <form onsubmit="return validation()" method="post" name="regForm" action= "login_handler.php">
	  	<label>Email: *</label>
		<input type="text" name="email" size="25" placeholder="Your Email" />
		<label>Password: *</label>
		<input type="password" name="password" placeholder="Your Password" size="25" />
		
		<div align="center">
		<input type="submit" value="Login" />
		<input type="reset" value="Clear" onclick="clear2();" />
</div>
  </form>
</div>

<div id="footer" style="margin-top:20%">&copy; Blockchain-Based Surveillance Framework</div>

</body>
	
</html>