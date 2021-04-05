/* get current day */

function current_date() {
    today = new Date();
    var mmm = today.getMonth();
    var dd = today.getDate();
    var yyyy = today.getFullYear();

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

    return (mmm + '-' + dd + '-' + yyyy)

}

let date_field = document.getElementById('date-field')
date_field.textContent = current_date()


/* modify-bg */

function modify_bg() {
    let current_count = parseInt(document.getElementById('current-count').textContent)
    let max_count = parseInt(document.getElementById('max-number').textContent)

    if (current_count <= max_count && current_count > 0) {

        let percentage_full = current_count / max_count * 100;
        let new_height = (100 - percentage_full) + 'vh';

        $('#bg-modifier').animate({
            height: new_height
        }, 200);
    }
}


/* add button */

function add() {
    let count_node = document.getElementById('current-count')

    let new_count = parseInt(count_node.textContent) + 1;

    let curr_total = Number(document.getElementById('total').textContent)
    document.getElementById('total').innerHTML = curr_total + 1

    count_node.textContent = new_count;
    sessionStorage.stored_count = new_count;
    sessionStorage.total = curr_total + 1
    modify_bg()
}


/* subtract button */

function subtract() {
    let count_node = document.getElementById('current-count')

    let new_count = parseInt(count_node.textContent) - 1;

    count_node.textContent = new_count;
    sessionStorage.stored_count = new_count;
    modify_bg()
}


/* Session Store */

if (sessionStorage.stored_count) {
    document.getElementById('current-count').innerHTML = sessionStorage.stored_count;
    modify_bg()
}

if (sessionStorage.total) {
    document.getElementById('total').innerHTML = sessionStorage.total;
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


/* TOAST ME UPPP */

var option = {
    animation: true,
    delay: 2000
};

function toasty(toast_id) {
    var toast = document.getElementById(toast_id);

    var toastElement = new bootstrap.Toast(toast, option);

    toastElement.show();

}

/*==============================================================================*/
/*                                FIRESTORE                                     */
/*==============================================================================*/

/* Send or store msg */

document.getElementById('send-btn').addEventListener("click", function () {

    writeMessages()

    close_popup()
    document.getElementById('modal-form').reset()

});


function writeMessages() {
    var messagesRef = db.collection("messages")

    messagesRef.add({
            timestamp: Date(),
            recipients: document.getElementById('recipient').value,
            message: document.getElementById('notify-message').value
        }).then(function () {
            toasty('toasty-success');
        })
        .catch(function (error) {
            toasty('toasty-failure');
        })
};


/* Store daily count */

document.getElementById('confirm-end-btn').addEventListener("click", function () {
    writeDailyCount();

    sessionStorage.clear()
    setTimeout(location.reload.bind(location), 10000)

    toasty('toasty-save')
});


function writeDailyCount() {
    var dailyCountRef = db.collection("daily");

    dailyCountRef.add({
        date: current_date(),
        end_total: sessionStorage.total
    });
};
