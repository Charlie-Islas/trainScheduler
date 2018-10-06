//id employee para el name input 

$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCeG1YHEzRz9VW0Brgu2UdP29iHWTJDctA",
        authDomain: "trainscheduler-e7aad.firebaseapp.com",
        databaseURL: "https://trainscheduler-e7aad.firebaseio.com",
        projectId: "trainscheduler-e7aad",
        storageBucket: "trainscheduler-e7aad.appspot.com",
        messagingSenderId: "641190673714"
    };
    firebase.initializeApp(config);
    database = firebase.database();

    $("#addTrain").on("click", function (event) {
        event.preventDefault();
        var makeBtn = false;
        var name = $('#trainName').val().trim();
        var destination = $('#destination').val().trim();
        var frequency = $('#frequency').val().trim();
        var firstTrain = $('#firstTrain').val().trim();
        $("#trainName").val("");
        $("#destination").val("");
        $("#frequency").val("");
        $("#firstTrain").val("");
        //var firstTrain = $('#firstTrain').val().trim();
        
 
        if (name !== "" && destination !== "" && frequency !== "") {
            makeBtn = true;

        }

        if (makeBtn) {
            database.ref().push({
                name: name,
                destination: destination,
                frequency: frequency,
                firstTrain:firstTrain,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });

        }

        else {

            alert("The introduced information is not correct! Please check it and try again.");
        }
        //$("#searchForm")[0].reset();
    });
    database.ref().on("child_added", function (childSnapshot) {
        
        var row = $("<tr>");
        var name = $("<td>").text(childSnapshot.val().name);
        var destination = $("<td>").text(childSnapshot.val().destination);
        var frequency = $("<td>").text(childSnapshot.val().frequency);
        var firstTrain=childSnapshot.val().firstTrain;
       

        var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
	   
	    var currentTime = moment();
	   
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      
	    var tRemainder = diffTime % childSnapshot.val().frequency;
	
	    var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;

        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");

        var minutesTillNext = $("<td>").text(tMinutesTillTrain);

        var nextHour=$("<td>").text(nextTrain);

        
        row.append(name).append(destination).append(frequency).append(minutesTillNext).append(nextHour);
        
        $("#tabla").append(row);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    function displayRealTime() {
        setInterval(function(){
            $('#current-time').html("Current time: "+moment().format('hh:mm A'))
          }, 1000);
        }
        displayRealTime();

});