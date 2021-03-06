//add date to top of page
var currentDay = moment().format('dddd, MMMM Do');
$("#currentDay").html(currentDay);


var dayTasks = {};

var createTask = function(taskText, taskTime){
    var task = $('<p>').attr('id',taskTime).html(taskText);
    $("#"+taskTime).html(task);
    dayTasks[taskTime] = ({task: taskText, id: taskTime});
    auditTask(task);
    saveTasks(dayTasks);
};

var auditTask = function(task){
    // get hour from task element
    var hour = parseInt($(task).attr("id").replace("am", "").replace("pm", ""))
    if (hour < 6){
        hour += 12
    };

    //convert to moment opject
    var time = moment().set("hour", hour).set("minute", 0).format("LLL")
  
    // remove any old classes from element
    $(task).parent('div').removeClass("list-group-item-success list-group-item-warning list-group-item-danger list-group-item-dark");
  
    // apply new class to parent div if task is near/over due date
    if (Math.abs(moment().diff(time, "hours")) === 0) {
        $(task).parent('div').addClass("list-group-item-danger");
    }
    else if (moment().isBefore(time)) {
       $(task).parent('div').addClass("list-group-item-success");
    }
    else{
        $(task).parent('div').addClass("list-group-item-dark");
    }
}

//task info was clicked
$("div").on("click", "p", function() {
    //reads current text from paragraph
    var text = $(this)
    .text()
    .trim();
  
    //creates a new text area with the current text (memory only)
    var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  
    //switches out the old text with new text area
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
});

//checkmark button clicked
$("div").on("click", ".btnWrapper", function(){
    event.stopImmediatePropagation();
    // get the textarea's current value/text
    var text = String($(this).closest('div.row').find('div.col-9 > .form-control').val());

    if(text === "" || text === "\n"){
        text = " ";
    }

    // get the id attribute
    var hour = String($(this).closest('div.row').find('div.col-9').attr('id'));

    // recreate p element
    var taskP = $("<p>")
    .attr("id", hour)
    .text(text);

    // replace textarea with p element
    $('#'+ hour + '> .form-control').replaceWith(taskP);
    dayTasks[hour] = ({task: text, id: hour});
    saveTasks(dayTasks);
    console.log(dayTasks);
});

var saveTasks = function(task){
    localStorage.setItem('dayTasks', JSON.stringify(task));
    localStorage.setItem('currentDay', JSON.stringify(moment()));
}

var loadTasks = function() {
    dayTasks = JSON.parse(localStorage.getItem("dayTasks"));
    //checks to see if the day has changed since the last time the user modified data
    var lastDay = String(JSON.parse(localStorage.getItem('currentDay')));
    var dayChange = moment().diff(moment(lastDay), 'days');

    // if nothing in localStorage or the day has changed, create an empty object to track all task status arrays for the day
    if (!dayTasks || dayChange != 0) {
        dayTasks = {
            '9am': [],
            '10am': [],
            '11am': [],
            '12pm': [],
            '1pm': [],
            '2pm': [],
            '3pm': [],
            '4pm': [],
            '5pm': [],
        };
        saveTasks(dayTasks);
    } 

    // loop over object properties
    $.each(dayTasks, function(hour, arr){
        //checks if arry is empty. Sets task to a blank space first time the page is opened/ or if local storage has been cleared
        if(arr.length === 0){
            createTask(" ", String(hour))
        }
        else{
            createTask(arr.task, hour);
        };
    });  
};   

var timeToNextHour = 0;
var setTimer = function(){
    //set duration for interval equal to time poage was accessed and the next hour
    timeToNextHour = moment().add(1, 'h').seconds(0).minutes(0).diff(moment())
}

//updates the tasks color every hour on the hour
function autoUpdate(){
    setTimeout(function(){
        $("div.col-9 > p").each(function(hour){
            auditTask(this);
        });
        setTimer();
        autoUpdate();
    },timeToNextHour);
};

loadTasks();
autoUpdate();
