var formLabels= document.getElementsByTagName("label");
    
function validation(){
    var valid = true;

    
    var firstName = document.regForm.firstName.value;

    if(firstName == ""){
        formLabels[0].innerHTML="First Name : * [Reqiured]";
        formLabels[0].style.color="red";
        valid = false;
    }
    else if(!isNaN(firstName)){
        formLabels[0].innerHTML="First Name : * [Text Only]";
        formLabels[0].style.color="red";
        valid = false;
   
    }
    else{
        formLabels[0].innerHTML="First Name : *";
        formLabels[0].style.color="black";
        valid = (valid) ? true : false;
   
    }

    var lastName = document.regForm.lastName.value;  

    if(lastName == ""){
        formLabels[1].innerHTML="Last Name : * [Reqiured]";
        formLabels[1].style.color="red";
        valid = false;
    }
    else if(!isNaN(lastName)){
        formLabels[1].innerHTML="Last Name : * [Text Only]";
        formLabels[1].style.color="red";
        valid = false;
   
    }
     else{
        formLabels[1].innerHTML="Last Name : *";
        formLabels[1].style.color="black";
        valid = (valid) ? true : false;
   
    }
    var email= document.regForm.email.value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(email == ""){
        formLabels[2].innerHTML="Email : * [Reqiured]";
        formLabels[2].style.color="red";
        valid = false;
    }
    else if(!re.test(email) ){
        formLabels[2].innerHTML = "Email: * [Incorrect Email]";
        formLabels[2].style.color = "red";
        valid = false;
    }
     else{
        formLabels[2].innerHTML="Email : *";
        formLabels[2].style.color="black";
        valid = (valid) ? true : false;
   
    }
    var password = document.regForm.password.value;

    if(password == ""){
        formLabels[3].innerHTML="Password : * [Reqiured]";
        formLabels[3].style.color="red";
        valid = false;
    }
    else if(password.length < 8 ){
        formLabels[3].innerHTML="Password : * [Must be > 8 ]";
        formLabels[3].style.color="green";
        valid = false;
   
    }
     else{
        formLabels[3].innerHTML="Passworrd : *";
        formLabels[3].style.color="black";
        valid = (valid) ? true : false;
   
    }
    var repassword = document.regForm.repassword.value;

    if(repassword == ""){
        formLabels[4].innerHTML="Renter password: *[Required]"
        formLabels[4].style.color="red";
        valid = false;  
    }
    else if(password != repassword){
        formLabels[4].innerHTML="Write correct password"
        formLabels[4].style.color="red";
        valid = false;  
    }
    else if(password == repassword){
        formLabels[4].innerHTML="Renter Passworrd : ";
        formLabels[4].style.color="green";
        valid = (valid) ? true : false;
   
    }
    
    return valid;
}
function clear2(){
    var myLabels = new Array();
    myLabels[0] = "First Name: *";
    myLabels[1] = "Last Name: *";
    myLabels[2] = "Email: *";
    myLabels[3] = "Password: *";
    myLabels[4] = "Renter password: *";
    

    for (var i = 0; i<myLabels.length;i++){
        formLabels[i].innerHTML = myLabels[i];
        formLabels[i].style.color ="black";
    }   
    
}