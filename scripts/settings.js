writeUserEmail('#user-email');
writeUserName('#user-name');

writeMaxOccupancy('#occupancy');
writeStoreName('#store-name');

input_storeNameValue();
input_occupancyValue();

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

/* Update data */

document.getElementById('save-store-btn').addEventListener('click', function(event){

    let curr_store_name = sessionStorage.getItem('store')
    let new_store_name = document.getElementById('store-name-input').value
    let new_occupancy = document.getElementById('occupancy-input').value

    sessionStorage.setItem('store', new_store_name)
    sessionStorage.setItem('occupancy', new_occupancy)

    db.collection('stores').doc(curr_store_name).update({
        name: new_store_name,
        max_occupancy: new_occupancy
    })
    .then(function(){

        console.log('success?')
        // sessionStorage.setItem('store', new_store_name);
        // sessionStorage.setItem('occupancy', new_occupancy);
    })
    .then();

});


