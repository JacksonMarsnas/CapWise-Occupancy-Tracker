writeUserEmail('#user-email');
writeUserName('#user-name');

writeMaxOccupancy('#occupancy');
writeStoreName('#store-name');

input_storeNameValue();
input_occupancyValue();
input_NameValue();

document.getElementById('confirm-logout-btn').addEventListener("click", function (event) {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();
        window.location.assign("index.html");
    }).catch((error) => {
        console.log(error);
    });
});

/* Pre-written Input */

function input_storeNameValue() {

    let store_input = document.getElementById('store-name-input');
    let docID = sessionStorage.getItem('storeID')

    db.collection('stores').doc(docID)
        .get()
        .then(function (doc) {
            var store = doc.data().name;
            store_input.setAttribute('value', store)
        })
};

function input_occupancyValue() {
    let occupancy_input = document.getElementById('occupancy-input');
    let occupancy = sessionStorage.getItem('occupancy')
    occupancy_input.setAttribute('value', occupancy)
}

function input_NameValue() {
    let new_name_input = document.getElementById('new-name-input');
    let user_name = sessionStorage.getItem('name')
    new_name_input.setAttribute('value', user_name)
}

/* Update data */


document.getElementById('save-store').addEventListener('click', function () {

    updateStore();

});

function updateStore() {

    let store_doc_id = sessionStorage.getItem('storeID')
    var storeRef = db.collection('stores').doc(store_doc_id)

    let new_occupancy = document.getElementById('occupancy-input').value

    return storeRef.update({
            name : document.getElementById('store-name-input').value,
            max_occupancy: new_occupancy
        })
        .then(function () {
            console.log('success?')
            sessionStorage.setItem('occupancy', new_occupancy);
            location.reload();
        })
        .catch(function (err) {
            console.log(err)
        })
};