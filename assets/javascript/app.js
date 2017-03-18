// console.log(moment("12/12/2012").unix())
// console.log(moment("2:55 PM", "hh:mm").format("hh:mm"))
console.log(moment("2:55 PM", "hh:mm").isValid())

var config = {
    apiKey: "AIzaSyDtqYd6OlTJ668OHNAdKqiWM2NGGf5yUSg",
    authDomain: "trainschedule-3689e.firebaseapp.com",
    databaseURL: "https://trainschedule-3689e.firebaseio.com",
    storageBucket: "trainschedule-3689e.appspot.com",
    messagingSenderId: "472429132259"
};
firebase.initializeApp(config);
var dataRef = firebase.database();

dataRef.ref().on("child_added", function(childSnapshot) {
	var trainName = childSnapshot.val().trainName
	var destination = childSnapshot.val().destination
	var frequency = childSnapshot.val().frequency
	var startTime = childSnapshot.val().startTime
	// Assumptions
    var tFrequency = frequency;

    // Time is 3:30 AM
    var firstTime = startTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
	var newrow = $("<tr>")
		.append($("<td>").html(trainName))
		.append($("<td>").html(destination))
		.append($("<td>").html(frequency))
		.append($("<td>").html(moment(nextTrain).format("hh:mm")))
		.append($("<td>").html(tMinutesTillTrain));
	$("tbody").append(newrow);
});


$("#submit").on("click", function(event){
	event.preventDefault();
	var trainName = $("#train_nme").val().trim();
	var destination = $("#destination").val().trim();
	var frequency = $("#frequency").val().trim();
	var startTime = $("#start_time").val().trim();
	if (moment(startTime, "hh:mm").isValid()){
		dataRef.ref().push({
			trainName: trainName,
			destination: destination,
			frequency: frequency,
			startTime: moment(startTime, "hh:mm").format("hh:mm"),
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	}
	else {
		$("#start_time").val("invalid start time");
	};
	
});