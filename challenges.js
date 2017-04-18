/**
 * Created by Vinay on 4/11/17.
 */

var database = firebase.database();
var answer;
var auth = firebase.auth();
var opponent;
var arrayOfChallenges = [];
var rand;

function findOpponent(){

    document.getElementById("problemName").innerHTML = "Looking for an opponent...";

    var uid = auth.currentUser.uid;


    database.ref("lookingForOpponent").update({
        [uid]: uid
});//tells firebase that im looking for an opponent


    database.ref("lookingForOpponent").on("value", function(snapshot){

        snapshot.forEach(function(childSnap){


            if(childSnap.val() !== auth.currentUser.uid){//if we find someone else who is also looking for an opponent

                opponent = childSnap.val();
                database.ref("lookingForOpponent").off();//we found our opponent, don't look for anyone else



                database.ref("lookingForOpponent/" + auth.currentUser.uid).remove();
                database.ref("lookingForOpponent/" + childSnap.val()).remove();//remove the data from the looking list so no duplicates


                player = auth.currentUser.uid.localeCompare(childSnap.val());

                if(player === 1){//you are player 1
                    createChallengeArray();

                }
                else if(player === -1){//you are player 2

                    database.ref('challenges').once('value', function (snap) {
                        arrayOfChallenges = [];


                        snap.forEach(function (childSnap) {

                            arrayOfChallenges.push(childSnap.key);

                        });

                    });
                    getSeedAndChallenge();


                }

            }

            /*database.ref("users/" + auth.currentUser.uid + "/lookingForOpponent").once('value', function(snapshot){


                if(snapshot.val() === null){//if our opponent already connected us, then we can stop looking for an opponent

                    console.log("I am player two.");

                    database.ref("lookingForOpponent").off();
                    database.ref('challenges').once('value', function (snap) {

                        snap.forEach(function (childSnap) {

                            arrayOfChallenges.push(childSnap.key);
                        });
                    });
                    getSeedAndChallenge();
                }
            })*/



        })
    })


}
/*function findOpponent(){


    var opponent = null;

    database.ref("users/" +  + auth.currentUser.uid).update({
        lookingForOpponent: "on" //on signifies we're looking, none means not looking, opp id means we've found
    });

    while(!opponent){//while we don't have an opponent

        database.ref("users").on("value", function(snapshot){

            snapshot.forEach(function(childSnap){

                if(sameAsOurId(childSnap.key) || isLooking(childSnap.key)){

                    opponent = childSnap.key;

                    database.ref("users/" +  + auth.currentUser.uid).update({
                        lookingForOpponent: opponent
                    });

                }



            })
        })


    }
    console.log(opponent);

}

function sameAsOurId(uid){
    var value;
    firebase.database().ref('users/' + uid + "/lookingForOpponent").once('value', function(snap){

            value = ((snap.val() === auth.currentUser.uid) && uid !== auth.currentUser.uid);
        }
    );
    return value;
};


function isLooking(uid){
    var value;
    firebase.database().ref('users/' + uid + "/lookingForOpponent").once('value', function(snap){

            value = ((snap.val() === "on") && uid !== auth.currentUser.uid);
        }
    );
    return value;
};*/

function getSeedAndChallenge(){

    document.getElementById("yourcode").value = "";

    database.ref("users/" + auth.currentUser.uid + "/seed").on('value', function(snap){

        getChallenge(snap.val());

    });
}


function getChallenge(seed){

    myChal = arrayOfChallenges[seed];

    document.getElementById("problemName").innerHTML = myChal;

    database.ref('challenges/' + myChal).once('value', function(snap){

        answer = snap.val();
        })

    database.ref('users/' + opponent + "/email").once('value', function(snap){

        document.getElementById("opponentInfo").innerHTML = "Opponent: " + snap.val();

    })

    database.ref('users/' + auth.currentUser.uid + "/correctAnswer").on('value', function(snap){

        if(snap.val() !== null){

            console.log("Sorry you weren't quick enough! Here's the right answer: ");
            console.log(snap.val());
            wrapUp();
            document.getElementById("problemName").innerHTML = "Sorry, you weren't quick enough! See your opponent's solution below.";
            document.getElementById("yourcode").value = snap.val();


        }
    })

}

function wrapUp(){
    database.ref("users/" + auth.currentUser.uid + "/correctAnswer").off();
    database.ref("users/" + auth.currentUser.uid + "/seed").off();

    console.log("off");
    database.ref("users/" + auth.currentUser.uid + "/correctAnswer").remove();
    database.ref("users/" + auth.currentUser.uid + "/seed").remove();
    database.ref("users/" + opponent + "/seed").remove();
    database.ref("users/" + auth.currentUser.uid + "/lookingForOpponent").remove();
    database.ref("users/" + opponent + "/lookingForOpponent").remove();
    database.ref("users/" + auth.currentUser.uid + "/seed").remove();
    database.ref("users/" + opponent + "/seed").remove();


    document.getElementById("opponentInfo").innerHTML = " ";
    console.log("umm help this is weird");



}

function createChallengeArray() {

    var count = 0;
    database.ref('challenges').once('value', function (snap) {
        arrayOfChallenges = [];


        snap.forEach(function (childSnap) {

            arrayOfChallenges.push(childSnap.key);

            count = count + 1;
        });

        rand = Math.floor(Math.random() * count);//find our seed value

        console.log(rand);

        database.ref("users/" + auth.currentUser.uid).update({
            lookingForOpponent: opponent,
            seed: rand
        });

        database.ref("users/" + opponent).update({//put data for our user telling us our opponent
            lookingForOpponent: auth.currentUser.uid,
            seed: rand
        });
        getSeedAndChallenge();
    });

}

function checkSuccess(){

    checkAnswer = document.getElementById(("output")).innerHTML.replace(new RegExp("\n", 'g'), " ").slice(0, -1)
    success = (checkAnswer === answer);

    if(success){
        console.log("You get 10 points for solving that correctly!");


        database.ref("users/" + auth.currentUser.uid + "/points").once('value', function(snapshot) {
            database.ref("users/" + auth.currentUser.uid).update({
                points: snapshot.val() + 10
            });
            document.getElementById("problemName").innerHTML = "You win! Find an opponent for more points!";

            document.getElementById("displayPoints").innerHTML = "Points: " + (snapshot.val() + 10);
        });



        database.ref("users/" + opponent).update({
            correctAnswer : document.getElementById("yourcode").value
        });


        wrapUp();

    }
    else{
        console.log("Keep trying!");
    }

}
