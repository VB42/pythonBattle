/**
 * Created by Vinay on 4/11/17.
 */


function createListOfUsers() {


    var add = document.createElement("section");
    add.setAttribute('id', 'listOfUsers');



    var list = document.createElement("ul");



    document.body.appendChild(add);
    add.appendChild(list);


    database = firebase.database();

    database.ref("users").on("value", function(snapshot){
        while (list.hasChildNodes()) {
            list.removeChild(list.lastChild);
        }
        snapshot.forEach(function(childSnap){


            if(isActive(childSnap.key)){

                item = document.createElement("li");
                item.innerHTML = getEmail(childSnap.key);

                list.appendChild(item);

            }



        })
    })

};

function isActive(uid){
    var value;
    firebase.database().ref('users/' + uid + "/status").once('value', function(snap){


            value = (snap.val() === true);
        }
    );
    return value;
};

function getEmail(uid){
    var value;
    database.ref('users/' + uid + "/email").once('value', function(snap){

            value = snap.val();
        }
    );
    return value;
};

//document.getElementById("users").innerHTML = createListOfUsers();********************

