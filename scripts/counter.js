// ---------------------- ON WINDOW LOAD, RUN MAIN() ----------------------------

window.onload = main // execute main on window load

function main() {

    // display the staff of the user's store for the messaging modal
    displayStaff();

    // write the maximum occupancy to the counter page
    writeMaxOccupancy('#max-number');

    // write the date to the counter page
    write_date('date-field');

    
    // check if a stored_count and total have been stored to sessionStorage. If they exist, update the counter
    // to display the prevoius count and total (basically don't forget where the count was last at!)

    if (sessionStorage.stored_count) {
        document.getElementById('current-count').innerHTML = sessionStorage.stored_count;
        modify_bg()
    }

    if (sessionStorage.total) {
        document.getElementById('total').innerHTML = sessionStorage.total;
    }
}

// ------------------------  ADDING AND SUBTRACTING THE CURRENT OCCUPANCY ----------------------------



/**
 * Add to the current occupancy, applied to the add button.
 */
function add() {

    let count_node = document.getElementById('current-count') // point to the current count element

    let new_count = parseInt(count_node.textContent) + 1; // increment the current count number by one

    let curr_total = Number(document.getElementById('total').textContent) // point to the total today element
    document.getElementById('total').innerHTML = curr_total + 1 // increment the total today number by one

    count_node.textContent = new_count; // change the current count element to reflect the new number
    sessionStorage.stored_count = new_count; // store the new count in current stored count in sessionStorage                 
    sessionStorage.total = curr_total + 1 // store the new current total count overall in sessionStorage
    modify_bg() // modify the background according to the new numbers
}



/**
 * Subtract from the current occupancy, applied to the subtract button.
 * The total today count does not change by subtracting.
 */
function subtract() {
    let count_node = document.getElementById('current-count') // point to the current count element

    let new_count = parseInt(count_node.textContent) - 1; // decrement the current count number by one

    count_node.textContent = new_count; // store the new count in current stored count in sessionStorage        
    sessionStorage.stored_count = new_count; // store the new current total count overall in sessionStorage
    modify_bg() // modify the background according to the new numbers
}

/**
 * Modify the background bar according to the current count.
 */
function modify_bg() {

    // retrieve the current and maximum occupancy count from the page

    let current_count = parseInt(document.getElementById('current-count').textContent)
    let max_count = parseInt(document.getElementById('max-number').textContent)

    if (current_count <= max_count && current_count > 0) { // execute the following code if the current count is less than the absolute maximum and is greater than 0

        let percentage_full = current_count / max_count * 100; // get the percentage that the store is full
        let new_height = (100 - percentage_full) + 'vh'; // determine the new height of the background bar

        $('#bg-modifier').animate({
            height: new_height // animate and slide to the new height in 200ms
        }, 200);
    }
}



/*==============================================================================*/
/*                          FIRESTORE  FUNCTIONS                                */
/*==============================================================================*/


/**
 * For the send button, on-click, write a message to Firestore and reset the form.
 */
document.getElementById('send-btn').addEventListener("click", function () {

    writeMessages()                                 // write the message to Firestore

    document.getElementById('modal-form').reset()   // reset the form inputs

});

/**
 * Write a submitted message to Firestore in the user's store.
 */
function writeMessages() {

    // Retrive the user's store ID and name from sessionStorage (should be stored after landing on main.html)
    let storeID = sessionStorage.getItem('storeID')
    let current_user = sessionStorage.getItem('name')

    // Define the reference to the message collection in the user's store
    var messagesRef = db.collection('stores').doc(storeID).collection("messages")

    messagesRef.add({                                                                           // WRITE to the database
            date: today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate(),         // today's date
            time: current_time(),                                                               // current time (function from capwise_functions.js)
            recipients: document.getElementById('recipient').value,                             // the selected recipient name
            sender: current_user,                                                               // the current user's name as sender
            message: document.getElementById('notify-message').value                            // the message itself
        }).then(function () {
            toasty('toasty-success');                                                           // if successful, pop a toast!
        })
        .catch(function (error) {
            toasty('toasty-failure');                                                           // if failed, pop a toast!
        })
};


/**
 * For the confirm to end shift button, onclick, write today's total count to Firestore
 */
document.getElementById('confirm-end-btn').addEventListener("click", function () {
    writeDailyCount();
});

/**
 * Write today's total count to Firestore.
 */
function writeDailyCount() {
    var dailyCountRef = db.collection("daily");             // refer to the collection 'daily'

    dailyCountRef.add({                                     // WRITE to the collection
            date: current_date(),                           // get the current date (capwise_functions.js)
            end_total: sessionStorage.total                 // the final total stored in sessionStorage
        })
        .then(function () {
            toasty('toasty-save');                          // if successful, pop a toast!
            sessionStorage.setItem('stored_count', 0);      // reset the stored_count to 0
            sessionStorage.setItem('total', 0);             // reset the total to 0
            setTimeout("location.href = './counter.html'", 500);    // refresh the page after 500ms
        });
};


/**
 * Dispaly the staff of a user's store in the form for selection.
 */
function displayStaff() {

    let docID = sessionStorage.getItem('storeID')       // retrieve the user's store ID from the sessionStorage

    db.collection('stores').doc(docID)                  // refer to the user's store document
        .get()                                          // READ
        .then(function (doc) {

            var staff = doc.data().staff                // point to the staff key of the store document
            let staff_names = Object.keys(staff)        // get the keys of the staff data structure (the names of all the staff)

            staff_names.forEach(function (name) {       // for each staff name

                $("#recipient").append("<option value='" + name + "'>" + name + "</option>");   // append as an option in the recipients input field

            })

        });
};