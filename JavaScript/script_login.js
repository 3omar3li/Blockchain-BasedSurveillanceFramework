var formLabels= document.getElementsByTagName("label");
    
function validation(){
    var valid = true;

    
    
    var email= document.regForm.email.value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(email == ""){
        formLabels[0].innerHTML="Email : *[Reqiured]";
        formLabels[0].style.color="red";
        valid = false;
    }
    else if(!re.test(email) ){
        formLabels[0].innerHTML = "Email: *[Incorrect Email]";
        formLabels[0].style.color = "red";
        valid = false;
    }
     else{
        formLabels[0].innerHTML="Email : *";
        formLabels[0].style.color="black";
        valid = (valid) ? true : false;
   
    }
    var password = document.regForm.password.value;

    if(password == ""){
        formLabels[1].innerHTML="Password : *[Reqiured]";
        formLabels[1].style.color="red";
        valid = false;
    }
    else if(password.length < 8 ){
        formLabels[1].innerHTML="Password : * [Must be > 8 ]";
        formLabels[1].style.color="red";
        valid = false;
   
    }
     else{
        formLabels[1].innerHTML="Passworrd : *";
        formLabels[1].style.color="black";
        valid = (valid) ? true : false;
   
    }
    
    return valid;
}
function clear2(){
    var myLabels = new Array();
    myLabels[0] = "Email: *";
    myLabels[1] = "Password: *";

    for (var i = 0; i<myLabels.length;i++){
        formLabels[i].innerHTML = myLabels[i];
        formLabels[i].style.color ="black";
    }   
    
}