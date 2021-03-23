function current_date() {
    new_array = [];

    let loop_counter = 0;
    while(loop_counter < 7){
        new_array.push(apply_dates(loop_counter));
        loop_counter++;
    }
    return new_array;
}

function apply_dates(counter){
    today = new Date();
    new_day = new Date(today);
    new_day.setDate(new_day.getDate() + counter);
    var mmm = new_day.getMonth();
    var dd = new_day.getDate();
    var www = new_day.getDay();

    if(dd < 10) dd = '0' + dd;
    if(mmm == 0) mmm = 'JAN';
    if(mmm == 1) mmm = 'FEB';
    if(mmm == 2) mmm = 'MAR';
    if(mmm == 3) mmm = 'APR';
    if(mmm == 4) mmm = 'MAY';
    if(mmm == 5) mmm = 'JUN';
    if(mmm == 6) mmm = 'JUL';
    if(mmm == 7) mmm = 'AUG';
    if(mmm == 8) mmm = 'SEP';
    if(mmm == 9) mmm = 'OCT';
    if(mmm == 10) mmm = 'NOV';
    if(mmm == 11) mmm = 'DEC';

    return(mmm + ', ' + dd);
}

function make_weekday(){
    today = new Date();
    new_array = [];
    loop_counter = 0;

    while(loop_counter < 7){
        new_day = new Date(today);
        new_day.setDate(new_day.getDate() + loop_counter);
        name_of_day = new_day.getDay();
        if(name_of_day == 0) name_of_day = 'SUN';
        if(name_of_day == 1) name_of_day = 'MON';
        if(name_of_day == 2) name_of_day = 'TUE';
        if(name_of_day == 3) name_of_day = 'WED';
        if(name_of_day == 4) name_of_day = 'THU';
        if(name_of_day == 5) name_of_day = 'FRI';
        if(name_of_day == 6) name_of_day = 'SAT';
        new_array.push(name_of_day);
        loop_counter++;
    }
    return new_array;
}

let is_message_present = false;

function new_message_field(){
    if(is_message_present == false){
        is_message_present = true;
        let new_div = document.createElement("div");
        let confirm_button = document.createElement("button");
        let button_image = document.createElement("img");
        let new_field = document.createElement("textarea");
        let message_area = document.getElementById("area_for_notes");
        confirm_button.setAttribute("id", "form-submit-button");
        new_div.setAttribute("id", "new_form_div");
        button_image.setAttribute("id", "image_for_confirm_button");
        button_image.src = "./images/icons/check-circle.svg";
        new_field.setAttribute("id", "message");
        confirm_button.appendChild(button_image);
        new_div.appendChild(confirm_button);
        new_div.appendChild(new_field);
        message_area.appendChild(new_div);

        confirm_button.addEventListener('click', function(event){
            let new_message_to_add = document.createElement("p");
            new_message_to_add.setAttribute("id", "new_message");
            new_message_to_add.appendChild(document.createTextNode(new_field.value));
            message_area.appendChild(new_message_to_add);
            confirm_button.parentNode.remove();
            is_message_present = false;
        });
    }
}

let date_array = current_date();
let weekdays = make_weekday();
let day_cards = document.getElementsByClassName("date-field");
let weekday_cards = document.getElementsByClassName("weekday");
console.log(weekday_cards);

for(let i = 0; i < 7; i++){
    day_cards[i].innerHTML = date_array[i];
    weekday_cards[i].innerHTML = weekdays[i];
}


// Get modal
var modal = document.getElementById("myModal");

// Get button that opens the modal
var btn = document.getElementsByClassName("arrow_button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function open_message_popup() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function add_people(){
    let number_of_people = document.getElementById('number_of_staff');
    let new_number_of_people = parseInt(number_of_people.innerHTML) + 1;
    number_of_people.innerHTML = new_number_of_people;
}

function subtract_people(){
    let number_of_people = document.getElementById('number_of_staff');
    if(parseInt(number_of_people.innerHTML) > 0){
        let new_number_of_people = parseInt(number_of_people.innerHTML) - 1;
        number_of_people.innerHTML = new_number_of_people;
    }
}