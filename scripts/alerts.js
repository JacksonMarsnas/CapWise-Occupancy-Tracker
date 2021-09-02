// --------------------------------- Window Load MAIN -----------------------------------

window.onload = main;

function main() {

    // Write today's date (function from capwise_functions.js)
    write_date('date-field');

    // Find and display the messages for today on the page.
    find_msgs_today();

    // Run display empty after 1000ms.
    setTimeout(display_empty, 1000);

}

/**Check and display the 'empty alerts page' div if there are no alerts on the page.
 * 
 */
function display_empty() {
    let empty_msg = document.getElementById('empty');

    if (document.getElementsByClassName('card').length == 0) {
        empty_msg.style.visibility = 'visible';
    } else {
        empty_msg.style.visibility = 'hidden';
    }

}


// --------------------------------- Add a message card for all messages today -----------------------------------

/**Publish the messages for todaythat are found in Firestore for a given user's store.
 * No return.
 */
function find_msgs_today() {
    let today = new Date() // Define today to store today's Date
    let date_today = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate(); // From today, get the date (yyyy-mm-dd)
    let storeID = sessionStorage.getItem('storeID'); // Retrieve the user's storeID from sessionStorage

    db.collection('stores').doc(storeID).collection('messages') // In the stores collection, search the user's store and messsages for the store
        .where('date', '==', date_today) // QUERY the messages collection for messages that have the same date as today
        .get() // Get all the message documents that fit the query
        .then(function (snap) {
            snap.forEach(function (doc) { // For each document found,
                var alert_msg = doc.data().message; // Assign the message value to alert_msg
                var recipient = doc.data().recipients; // Assign the recipients value to recipient
                var sender = doc.data().sender; // Assign the sender value to sender
                var time = doc.data().time; // Assign the time value to time (the time at which the message was sent)

                let alert_card = create_msg_card(alert_msg, recipient, sender, time, doc.id); // Create a message card with the given information

                $('#alerts-sec').append(alert_card); // Add the created message card to the page 
            })
        })

    return
}


// --------------------------------- Create a message card -----------------------------------


/**Create the message card for a given message.
 * 
 * @param {*} alert_msg - a string, the message content itself
 * @param {*} recipient - a string, the recipient of the message
 * @param {*} sender - a string, the sender who submitted the message
 * @param {*} time - a string, the time at which the message was submitted
 * @param {*} docID - a string, the document ID of the current message as found in Firestore
 * @returns - an element, the complete message card
 */
function create_msg_card(alert_msg, recipient, sender, time, docID) {

    // Create the message card div
    let msg_card = document.createElement('div');
    msg_card.setAttribute("class", "card border-light mb-3 fade-1");

    // Create body of the card
    let card_body = document.createElement('div');
    card_body.setAttribute('class', 'card-body');

    let card_title = document.createElement('h5'); // Create card title
    card_title.textContent = "To: " + recipient;

    let close_btn = create_close_btn(docID); // Create close button

    let alert_message = document.createElement('p'); // Create content of card with message
    alert_message.setAttribute('class', 'card-text');
    alert_message.textContent = alert_msg;

    card_body.appendChild(card_title); // Append card title, close button, and message content into card body
    card_body.appendChild(close_btn);
    card_body.appendChild(alert_message);

    // Create footer of the card
    let footer = document.createElement('div');
    footer.setAttribute('class', 'card-footer');

    let footer_text = document.createElement('small'); // Create the small footer text
    footer_text.textContent = "Sent from " + sender + " at " + time

    footer.appendChild(footer_text) // Append the small footer text to the footer


    // Append the card-body and card-footer to the card div
    msg_card.appendChild(card_body);
    msg_card.appendChild(footer);

    return msg_card
}


/**Create the close button for an alert, including an event listener to delete the closed document
 * 
 * @param {*} docID - a string, the document ID of the current document being read to make the alert
 * @returns - an element, the close button for an alert that will delete the alert from page and from firestore
 */
function create_close_btn(docID) {

    let storeID = sessionStorage.getItem('storeID'); // get the store ID of the current user

    let close_btn = document.createElement('button'); // create the close button element
    close_btn.setAttribute('type', 'button');
    close_btn.setAttribute('class', 'btn-close');

    close_btn.addEventListener('click', function () { // add an event listener to the close button on click

        db.collection('stores').doc(storeID).collection('messages').doc(docID) // search for the specific message's document using docID
            .delete() // DELETE the document from Firestore
            .then(function () {
                console.log('Delete from db successful.')
                close_btn.parentNode.parentNode.remove(); // if successful, delete the alert div from the page

                display_empty();
            }).catch(function (err) {
                console.log('Delete unsuccessful', err)
            })
    })

    return close_btn // return the created close button
}