displayStaff();

/* get total count */
writeMaxOccupancy('#max-number');

/* get current day */

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

/*==============================================================================*/
/*                                FIRESTORE                                     */
/*==============================================================================*/

/* Send or store msg */

document.getElementById('send-btn').addEventListener("click", function () {

    writeMessages()

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
});


function writeDailyCount() {
    var dailyCountRef = db.collection("daily");

    dailyCountRef.add({
        date: current_date(),
        end_total: sessionStorage.total
    })
    .then(function(){
        toasty('toasty-save');
        sessionStorage.setItem('stored_count', 0);
        setTimeout("location.href = './counter.html'",500);
    });
};


function displayStaff() {

    let docID = sessionStorage.getItem('storeID')

    db.collection('stores').doc(docID)
    .get()
    .then(function (doc) {
    
        var staff = doc.data().staff
        let staff_names = Object.keys(staff)
    
        staff_names.forEach(function(name){
    
            $("#recipient").append("<option value='" + name + "'>" + name + "</option>");
    
        })
    
    });
};