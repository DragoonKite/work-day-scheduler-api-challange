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

//task info no longer in focus
$("div").on("blur", "textarea", function(){
  // get the textarea's current value/text
  var text = $(this)
  .val()
  .trim();

  // get the id attribute
  var hour = $(this)
  .attr("id")

  // recreate p element
  var taskP = $("<p>")
  .attr("id", hour)
  .text(text);

  // replace textarea with p element
  $(this).replaceWith(taskP);
});
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

createTask('Test','2pm');