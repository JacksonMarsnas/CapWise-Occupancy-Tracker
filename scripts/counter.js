/* get current day */

function current_date() {
    today = new Date();
    var mmm = today.getMonth();
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    
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

    return (mmm + '-' + dd + '-' + yyyy)

}

let date_field = document.getElementById('date-field')
date_field.textContent = current_date()


/* modify-bg */

function modify_bg() {
    var current_count = parseInt(document.getElementById('current-count').textContent)
    var max_count = parseInt(document.getElementById('max-number').textContent)

    if (current_count <= max_count && current_count > 0) {
        var percentage_full = current_count / max_count * 100
        document.getElementById('bg-modifier').style.height = (100 - percentage_full) + 'vh'
    }
}


/* add button */

function add() {
    let count_node = document.getElementById('current-count')
    let current_count = parseInt(count_node.textContent)

    count_node.textContent = current_count + 1
    modify_bg()
}


/* subtract button */

function subtract() {
    let count_node = document.getElementById('current-count')
    let current_count = count_node.textContent

    count_node.textContent = parseInt(current_count) - 1
    modify_bg()
}


/* open pop up */

function open_message_popup() {
    let popup = document.getElementById('bg-modal')
    popup.style.display = ('flex')
}

/* close pop up */

function close_popup() {
    let popup = document.getElementById('bg-modal')
    popup.style.display = ('none')
}