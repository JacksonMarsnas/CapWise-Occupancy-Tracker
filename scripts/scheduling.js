// initialization stuffs
let today = new Date();
let last_day_picked = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();     // Gets the current day
let is_message_present = false;                                                                 // Says that no messages are on screen yet
let last_week = document.createElement("h1");                                                   // modal stuff for previous weeks
let last_week_area = document.getElementById("above_notes");
last_week.setAttribute("id", "last_weeks_numbers");
last_week_area.appendChild(last_week);

// final initialization stuff
change_employee_numbers();
reset_modal_numbers();
assign_button_number_and_id();
dates_on_base_screen();

// assigns each button and number on the first schedule screen to a date
function assign_button_number_and_id() {
    let arrow_buttons = document.getElementsByClassName('arrow_button');                            // gets all arrow buttons
    let h2_employee_numbers = document.querySelectorAll('h2');                                      // gets all numbers to the left of arrow buttons
    let today = new Date();                                                                         // make new Date object
    for (let i = 0; i < 7; i++) {                                                                   // loop for setting arrow button id's
        let new_day = new Date(today);
        new_day.setDate(new_day.getDate() + i);                                                     // each loop ieration adds another day
        let new_id = new_day.getFullYear() + "-" + new_day.getMonth() + "-" + new_day.getDate();    // sets id of each button to a different day in the next week
        arrow_buttons[i].setAttribute('id', new_id)
        h2_employee_numbers[i].setAttribute('id', new_id)
    }
}

// puts dates into a 7 member array representing the coming week
function current_date() {
    new_array = [];
    let loop_counter = 0;
    while (loop_counter < 7) {
        new_array.push(apply_dates(loop_counter));  // uses function to get correct date
        loop_counter++;
    }
    return new_array;
}

// creates dates
function apply_dates(counter) {
    today = new Date();
    new_day = new Date(today);
    new_day.setDate(new_day.getDate() + counter);   // adds to the Date object correctly
    var mmm = new_day.getMonth();                   // get month and day
    var dd = new_day.getDate();

    // show month in a way we can understand
    if (dd < 10) dd = '0' + dd;
    if (mmm == 0) mmm = 'JAN';
    if (mmm == 1) mmm = 'FEB';
    if (mmm == 2) mmm = 'MAR';
    if (mmm == 3) mmm = 'APR';
    if (mmm == 4) mmm = 'MAY';
    if (mmm == 5) mmm = 'JUN';
    if (mmm == 6) mmm = 'JUL';
    if (mmm == 7) mmm = 'AUG';
    if (mmm == 8) mmm = 'SEP';
    if (mmm == 9) mmm = 'OCT';
    if (mmm == 10) mmm = 'NOV';
    if (mmm == 11) mmm = 'DEC';

    // returns string representing a month and a day
    return (mmm + ', ' + dd);
}

// makes an array of weekdays
function make_weekday() {
    today = new Date();
    new_array = [];
    loop_counter = 0;

    // gets all weekdays for the coming week in the order they appear
    while (loop_counter < 7) {
        new_day = new Date(today);
        new_day.setDate(new_day.getDate() + loop_counter);
        name_of_day = new_day.getDay();
        if (name_of_day == 0) name_of_day = 'SUN';
        if (name_of_day == 1) name_of_day = 'MON';
        if (name_of_day == 2) name_of_day = 'TUE';
        if (name_of_day == 3) name_of_day = 'WED';
        if (name_of_day == 4) name_of_day = 'THU';
        if (name_of_day == 5) name_of_day = 'FRI';
        if (name_of_day == 6) name_of_day = 'SAT';
        new_array.push(name_of_day);
        loop_counter++;
    }
    // returns an array of weekdays
    return new_array;
}

// opens a new message field in the modal. Also creates a listener for the confirm button to send to DB
function new_message_field() {
    if (is_message_present == false) {                                  // if the message field is not open, it executes the following code
        is_message_present = true;                                      // message field is now open, so they can't open another one
        let new_div = document.createElement("div");                    // makes a new div for message stuff
        let confirm_button = document.createElement("button");          // creates the confirm button for the form
        let button_image = document.createElement("img");               // Image for confirm button
        let new_field = document.createElement("textarea");             //text area for form
        let message_area = document.getElementById("box_field");        // specific area for form stuff
        confirm_button.setAttribute("id", "form-submit-button");        // set id's of form stuff
        new_div.setAttribute("id", "new_form_div");
        button_image.setAttribute("id", "image_for_confirm_button");
        button_image.src = "./images/icons/check-circle.svg";           // button image source is set
        new_field.setAttribute("id", "message");
        new_div.appendChild(new_field);                                 // appends stuff to the correct area
        confirm_button.appendChild(button_image);
        new_div.appendChild(confirm_button);
        message_area.appendChild(new_div);

        // listener for the confirm button
        confirm_button.addEventListener('click', function (event) {
            send_notes_to_db();                                                         // sends notes to the database
            let message_area = document.getElementById("area_for_notes");
            let new_message_to_add = document.createElement("p");                       // creates element for new message
            new_message_to_add.setAttribute("class", "new_message");
            new_message_to_add.appendChild(document.createTextNode(new_field.value));   // appends new message
            message_area.appendChild(new_message_to_add);
            confirm_button.parentNode.remove();                                         // removes all form stuff except newly added message
            is_message_present = false;                                                 // message is no longer present
        });
    }
}

// applies correct dates and weekday names to base screen
function dates_on_base_screen() {
    let date_array = current_date();                                    // makes an array of strings representing dates in the coming week
    let weekdays = make_weekday();                                      // makes an array of strings representing weekdays in the coming week
    let day_cards = document.getElementsByClassName("date-field");      // selects the date and weekdays fields on the base screen
    let weekday_cards = document.getElementsByClassName("weekday");

    for (let i = 0; i < 7; i++) {                   // changes the value of dates and weekdays to the correct values
        day_cards[i].innerHTML = date_array[i];
        weekday_cards[i].innerHTML = weekdays[i];
    }
}

// Get modal
var modal = document.getElementById("myModal");

// Get button that opens the modal
var btn = document.getElementsByClassName("arrow_button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0]; // don't need?

// When the user clicks a button, open the modal and get data from DB about that day
function open_message_popup(button_id) {
    modal.style.display = ("flex");                                             // brings modal to the front
    last_day_picked = button_id;                                                // the last day they picked is the id of the button they just pressed, since each button id is a date
    get_last_week_value();                                                      // gets the number of employees from the previous week to display for reference
    let docref = db.collection("employee_numbers").doc(last_day_picked)         // get the number of employees from the last day picked from the database
    docref.get().then((doc) => {
        if (doc.exists) {                                                       // if the doc exists, good, we don't need to do anything
            console.log("Got doc for " + last_day_picked + " succesfully.")
        } else {                                                                // if it doesn't, initialize it to zero
            db.collection("employee_numbers").doc(last_day_picked).set({
                employees: 0
            })
        }
    })

    db.collection("schedule_notes")                                                 // get notes from the database where the date matches the day they last picked
        .where("timestamp", "==", last_day_picked)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var note = doc.data().message;                                      // for each note in the database that it gets, create a new p element for it
                let new_message_to_add = document.createElement("p");
                let message_area = document.getElementById("area_for_notes");
                new_message_to_add.setAttribute("class", "new_message");
                new_message_to_add.appendChild(document.createTextNode(note));
                message_area.appendChild(new_message_to_add);                       // append all notes to the message area
            });
        })
    reset_modal_numbers();                                                          // resets the numbers on the modal every time it is opened
}

// When the user clicks on X button, close the modal and update any changes they made to DB
function close_modal() {
    modal.style.display = "none";                                               // hide the modal
    let new_message_to_add = document.getElementsByClassName('new_message');    // gets all notes
    let original_message_count = new_message_to_add.length;
    for (let i = 0; i < original_message_count; i++) {                          // loops through all notes, deleting them until that day is opened again
        new_message_to_add[0].remove();
    }
    change_employee_numbers();                                                  // changes the number of employees on the base screen in the case that any edits were made
    update_schedule();                                                          // sends employee numbers to the database
}

// When the user clicks anywhere outside of the modal, close it and update any changes they made to DB
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";                                               // hide the modal
        let new_message_to_add = document.getElementsByClassName('new_message');    // gets all notes
        let original_message_count = new_message_to_add.length;
        for (let i = 0; i < original_message_count; i++) {                          // loops through all notes, deleting them until that day is opened again
            new_message_to_add[0].remove();
        }
        change_employee_numbers();                                                  // changes the number of employees on the base screen in the case that any edits were made
        update_schedule();                                                          // sends employee numbers to the database
    }
}

// add to the number of employees in the modal
function add_people() {
    let number_of_people = document.getElementById('number_of_staff');      // gets the element showing the number of people in the modal
    let new_number_of_people = parseInt(number_of_people.innerHTML) + 1;    // adds 1 to the number of people
    number_of_people.innerHTML = new_number_of_people;                      // writes new number of people
}

// subtract the number of employees in the modal
function subtract_people() {
    let number_of_people = document.getElementById('number_of_staff');          // gets element showing the number of people
    if (parseInt(number_of_people.innerHTML) > 0) {                             // can't go negative
        let new_number_of_people = parseInt(number_of_people.innerHTML) - 1;    // subtracts from number of people
        number_of_people.innerHTML = new_number_of_people;                      // writes new number of people
    }
}

// changes the number of employees in the DB to the number the user has picked
function update_schedule() {
    let employees_today = document.getElementById('number_of_staff');   // gets element showing the number of people in the modal
    db.collection("employee_numbers").doc(last_day_picked).set({        // set the number of employees for the last day picked in the database to this number
        timestamp: last_day_picked,
        employees: employees_today.textContent
    })

}

// changes employee numbers on the base schedule screen
function change_employee_numbers() {
    let new_number = document.querySelectorAll("h2");                                           // gets all numbers of employees on the base screen
    let today = new Date();

    for (let i = 0; i < 7; i++) {                                                               // loops through for each day
        let new_day = new Date(today);
        new_day.setDate(new_day.getDate() + i);                                                 // adds one for every loop ieration
        new_day = new_day.getFullYear() + "-" + new_day.getMonth() + "-" + new_day.getDate();   // makes new date string
        let docref = db.collection("employee_numbers").doc(new_day);                            // reference to the correct document in the database
        docref.get().then((doc) => {
            if (doc.exists) {                                                                   // if that doc exists, change the value of the day to the one in the database
                new_number[i].innerHTML = doc.data().employees;
            } else {                                                                            // else, set it to zero
                db.collection("employee_numbers").doc(new_day).set({
                    employees: 0
                })
                change_employee_numbers();                                                      // change employee numbers on the base screen
            }
        })
    }
}

// changes the modal number to the correct day
function reset_modal_numbers() {
    let employee_number = document.getElementById("number_of_staff");       // number of staff on the modal
    let docref = db.collection("employee_numbers").doc(last_day_picked)     // reference to the number of staff for the last day picked in the database
    docref.get().then((doc) => {
        if (doc.exists) {                                                   // if that doc exists, display the value in the modal
            employee_number.innerHTML = doc.data().employees;
        } else {                                                            // else, set it to zero
            db.collection("employee_numbers").doc(last_day_picked).set({
                employees: 0
            })
        }
    })
}

// sends user entered notes to the DB
function send_notes_to_db() {
    let new_note = document.querySelector('textarea');  // reference to the textarea in the modal form
    db.collection("schedule_notes").add({               // saves the timestamp and the contents of the textarea
        timestamp: last_day_picked,
        message: new_note.value
    })
}

// gets the employee numbers from the previous week
function get_last_week_value() {
    let today = new Date();                                                                 // creates a new Date object
    let new_day = new Date(today);
    let last_day_array = last_day_picked.split("-")                                         // makes an array out of the last day they picked, seperated by dashes
    new_day.setFullYear(parseInt(last_day_array[0]))                                        // sets the values of the Date object to the year, month and day they last picked
    new_day.setMonth(parseInt(last_day_array[1]))
    new_day.setDate(parseInt(last_day_array[2]) - 7)                                        // subtract seven days since it is a week prior
    new_day = new_day.getFullYear() + "-" + new_day.getMonth() + "-" + new_day.getDate();   // add in the dashes again to make it the proper format
    let docref = db.collection("employee_numbers").doc(new_day);                            // reference to document in the database
    docref.get().then((doc) => {
        if (doc.exists) {                                                                   // if it exists, set the value of last week to the value in the document
            let last_week_employees = doc.data().employees;
            last_week.innerHTML = last_week_employees;
        } else {                                                                            // if it doesn't, set it to zero, then display it
            db.collection("employee_numbers").doc(new_day).set({
                employees: 0
            })
            let last_week_employees = doc.data().employees;
            last_week.innerHTML = last_week_employees;
        }
    })
}