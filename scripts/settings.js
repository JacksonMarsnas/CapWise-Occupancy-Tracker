writeUserEmail('#user-email');
writeUserName('#user-name');

writeMaxOccupancy('#occupancy');
writeStoreName('#store-name');

input_storeNameValue();
input_occupancyValue();
input_NameValue();

document.getElementById('confirm-logout-btn').addEventListener("click", function(event){
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
    let store_name = sessionStorage.getItem('store')
    store_input.setAttribute('value', store_name)
}

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

let curr_store_name = sessionStorage.getItem('store')
let new_store_name = document.getElementById('store-name-input').value
let new_occupancy = document.getElementById('occupancy-input').value

let staff = {}

db.collection('stores').doc(curr_store_name)
.get()
.then(function (doc) {
    var staff_info = doc.data().staff;
    console.log(staff_info)
    sessionStorage.setItem('OG_staff', staff_info)
})

console.log(sessionStorage.getItem('OG_staff'))

document.getElementById('save-store-btn').addEventListener('click', function(event){

    let curr_store_name = sessionStorage.getItem('store')
    let new_store_name = document.getElementById('store-name-input').value
    let new_occupancy = document.getElementById('occupancy-input').value

    db.collection('stores').doc(curr_store_name)
    .get()
    .then(function (doc) {
        var staff_info = doc.data().staff;
        console.log(staff_info)
        sessionStorage.setItem('OG_staff', staff_info)
    })

    sessionStorage.setItem('store', new_store_name)
    sessionStorage.setItem('occupancy', new_occupancy)

    console.log(sessionStorage.getItem('OG_staff'))

    db.collection('stores').doc(new_store_name).set({
        name: new_store_name,
        max_occupancy: new_occupancy,
        staff: sessionStorage.getItem('OG_staff')
    })
    .then(function(){

        console.log('success?')
        // sessionStorage.setItem('store', new_store_name);
        // sessionStorage.setItem('occupancy', new_occupancy);
    })
    .then();

});


