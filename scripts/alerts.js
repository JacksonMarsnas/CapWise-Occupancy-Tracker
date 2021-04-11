function create_close_btn () {
    let close_btn = document.createElement('button');
    close_btn.setAttribute('type', 'button');
    close_btn.setAttribute('class', 'btn-close');

    close_btn.addEventListener('click', function(){
        close_btn.parentNode.parentNode.remove();
    })

    return close_btn
}

function write_card(alert_msg, recipient, sender, time) {

    let alert_card = document.createElement('div');
    alert_card.setAttribute("class", "card border-light mb-3");


    // Create body of the card
    let card_body = document.createElement('div');
    card_body.setAttribute('class', 'card-body');

    // Create card title
    let card_title = document.createElement('h5');
    card_title.textContent = "To: " + recipient;

    // Create close button
    let close_btn = create_close_btn();

    // Create content of card with message
    let alert_message = document.createElement('p');
    alert_message.setAttribute('class', 'card-text');
    alert_message.textContent = alert_msg;


    card_body.appendChild(card_title);
    card_body.appendChild(close_btn);
    card_body.appendChild(alert_message);

    // Create footer of the card
    let footer = document.createElement('div');
    footer.setAttribute('class', 'card-footer');

    let footer_text = document.createElement('small');
    footer_text.setAttribute('class', 'text-muted');
    footer_text.textContent = "Sent from " + sender + " at " + time
    footer.appendChild(footer_text)

    // Append the card-body and card-footer to the card div
    alert_card.appendChild(card_body);
    alert_card.appendChild(footer);

    return alert_card
}


function find_msgs_today() {
    let today = new Date()
    let date_today = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
    let storeID = sessionStorage.getItem('storeID');

    db.collection('stores').doc(storeID).collection('messages')
        .where('date', '==', date_today)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var alert_msg = doc.data().message;
                var recipient = doc.data().recipients;
                var sender = doc.data().sender;
                var time = doc.data().time;

                let alert_card = write_card(alert_msg, recipient, sender, time);

                $('#alerts-sec').append(alert_card);
            })
        })
}

find_msgs_today();