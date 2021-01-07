//add date to top of page
var currentDay = moment().format('dddd, MMMM Do');
$("#currentDay").html(currentDay);

var dayTasks = []

var createTask = function(taskText, taskTime){
    var task = $('<p>').attr('id',taskTime).html(taskText);
    $("#"+taskTime).html(task);
    dayTasks.push(task);
    auditTask(task)
};

/* var saveTasks = function(task){
    localStorage.setItem('dayTasks', JSON.stringify(task))
}

var loadTasks = function() {
    dayTasks = JSON.parse(localStorage.getItem("dayTasks"));
    console.log(dayTasks)

    // if nothing in localStorage, create a new object to track all task status arrays
    if (!dayTasks) {
        dayTasks = []
    }

    // loop over object properties
    $.each(dayTasks, function(task) {
        task.text=$(this)['text'].value;
        task.time=$(this)['time'].value;
        createTask(task.text, task.time);
    });
};   */

var auditTask = function(task){
    // get hour from task element
    var hour = parseInt($(task).attr("id").replace("am", "").replace("pm", ""))
    if (hour < 6){
        hour += 12
    };
    console.log(hour)

    //convert to moment opject
    var time = moment().set("hour", hour).set("minute", 0).format("LLL")
    console.log(time)
  
    // remove any old classes from element
    $(task).parent('div').removeClass("list-group-item-success list-group-item-warning list-group-item-danger list-group-item-dark");
  
    // apply new class if task is near/over due date
    if (Math.abs(moment().diff(time, "hours", true)) <= 1 && (moment().diff(time, "hours", true)) < 0) {
        $(task).parent('div').addClass("list-group-item-warning");
    }
    else if (Math.abs(moment().diff(time, "hours")) === 0) {
        $(task).parent('div').addClass("list-group-item-danger");
    }
    else if (moment().isBefore(time)) {
       $(task).parent('div').addClass("list-group-item-success");
    }
    else{
        $(task).parent('div').addClass("list-group-item-dark");
    }
}

createTask('Test','6pm');