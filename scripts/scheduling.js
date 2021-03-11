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

date_array = current_date();
weekdays = make_weekday();

for (let i = 0; i < 7; i++){
    date_field = document.querySelectorAll("h5");
    date_field[i].textContent = date_array[i];

    weekday_field = document.querySelectorAll("h3");
    weekday_field[i].textContent = weekdays[i];
}
