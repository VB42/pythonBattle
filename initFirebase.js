/**
 * Created by Vinay on 4/9/17.
 */

(function() {

    var $ = function (id) {
        return document.getElementById(id);
    };

    const firstName = $("first");
    const lastName = $("last");
    const txtemail = $("username");
    const txtpassword = $("password");
    const btnsignup = $("signup");
    const btnlogout = $("logout");
    const btnlogin = $("login");
    const txtUserName = $("displayUserName");


    if (btnlogin) {
        btnlogin.addEventListener('click', e => {
            const email = txtemail.value;
        const password = txtpassword.value;
        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(function(e){
            if(e.message){
                console.log(e.message);
                alert(e.message);
            }

        });



    })
    }


    if (btnsignup){
        btnsignup.addEventListener('click', e => {

            const email = txtemail.value;
        const password = txtpassword.value;
        const auth = firebase.auth();
        errorMessage = "";

        if ($("retype").value === password) {
            firebase.auth().signOut();
            const promise = auth.createUserWithEmailAndPassword(email, password);
            promise.catch(function(e){
                errorMessage.value = e.message;
                console.log(e.code);
                console.log(e.message);

                if(e.message){
                    alert(e.message);
                }
                //need to add redirect when log in works


            });
            /*user = firebase.auth().currentUser;

             user.updateProfile({
             displayName : firstName.value + " " + lastName.value
             }).then(function() {
             displayName = user.displayName;
             }, function(error) {

             console.log(error);
             });

             console.log(user);
             console.log(user.displayName);*/

        }
        else {
            alert("Sorry, passwords don't match");

        }


    });
    }   if(btnlogout) {
        btnlogout.addEventListener('click', e => {

            database.ref('users/' + auth.currentUser.uid).update({
                status : false,
                seed: null

        });

            database.ref('lookingForOpponent/' + auth.currentUser.uid).remove();
            firebase.auth().signOut();
            window.location.href = "login.html"
    })
    }

    firebase.auth().onAuthStateChanged(user => {

        path = window.location.pathname.split("/").pop();
    if(user) {
        if(path !== 'skulpt.html') {
            window.location = 'skulpt.html'; //After successful login, user will be redirected to home.html
            console.log(firebase.auth().currentUser.email);
        }

        txtUserName.innerHTML = user.email;

        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/points").once('value', function(snapshot){

            $("displayPoints").innerHTML = "Points: " + snapshot.val();
        });

        database = firebase.database();
        auth = firebase.auth();


        database.ref('users/' + auth.currentUser.uid).once('value', function(snap){

                if(snap.val() === null){

                    database.ref('users/' + auth.currentUser.uid).set({
                        username: "store",
                        email: auth.currentUser.email,
                        points : 0,
                        status : true
                    });

                }
                else{

                    database.ref('users/' + auth.currentUser.uid).update({
                        status : true
                    });

                }
            }
        );





    }
    else{
        if(path !== 'login.html' && path !== 'signup.html') {
            window.location = 'login.html';
            alert("Please log in to use our services.");
        }
    }
});


}());

