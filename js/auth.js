//signup
var signupform = document.querySelector('#signupform');
var error_msg;
signupform.addEventListener('submit',(e) => {
    e.preventDefault();
    
//get user info
    var email = signupform['signup-email'].value;
    var password = signupform['signup-password'].value;
    console.log(email,password);
    //signup user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred);
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            signupform.reset();
            window.location.href="html/home.html";
          } 
        });
    }).catch(function(error)
    {
        error_msg = error.message;
        alert(error_msg);
        signupform.reset();
    });
   
});
//login user
var loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit',(e)=> {
  e.preventDefault();
    var email = loginForm['email'].value;
    var password = loginForm['password'].value;
    firebase.auth().signInWithEmailAndPassword(email,password).then(cred=>{
      firebase.auth().onAuthStateChanged(function(user){
        if(user)
        {
          loginForm.reset();
          window.location.href="html/home.html";
        }
      });
    }).catch(function(error){
      var errorcode = error.code;
      if(errorcode === 'auth/wrong-password')
      {
        error_msg = error.message;
        alert(error_msg);
      }
      loginForm.reset();
    });
  
});
//logout user
  document.getElementById("logout-user").addEventListener("click",logout =>{
      firebase.auth.signout().then(function(){
        window.location.href="../index.html";
      });
  });