// ---------------------- ON WINDOW LOAD, RUN MAIN() ----------------------------

window.onload = main;

function main() {

    writeUserEmail('#user-email');
    writeUserNameLive('#user-name');

    writeMaxOccupancy('#occupancy');
    writeStoreName('#store-name');

    input_storeNameValue();
    input_occupancyValue();
    input_NameValue();

};


// ---------------------------- LOG OUT THE USER ----------------------------------

/**
 * Sign out the user when the Log-Out confirmation button  has been clicked.
 */
document.getElementById('confirm-logout-btn').addEventListener("click", function (event) {
    firebase.auth().signOut().then(() => {
        sessionStorage.clear();                 // Clear sessionStorage for next user log-in in session.
        window.location.assign("index.html");   // Return to application index/landing page.
    }).catch((error) => {
        console.log(error);
    });
});


/**------------------------ PRE-SET VALUES OF CURRENT USER INFORMATION IN INPUT ---------------------------------
 * 
 * The input fields of each edit/settings field should be pre-filled with the current user's data from Firestore 
 * so that users are aware they are editing or changing the current store name/ user name / max occupancy. 
 * Some of the following functions READ from Firebase to provide the latest information rather than sessionStorage 
 * which can be less reliable for updates.
 * 
 */

/**
 * Read and set the value of Store Name input to the current store name.
 */
function input_storeNameValue() {

    let store_input = document.getElementById('store-name-input');      // point to the store name input element
    let docID = sessionStorage.getItem('storeID');                      // get the user's storeID (this will not change)

    db.collection('stores').doc(docID)                                  // find the user's store document
        .get()                                                          // READ!!
        .then(function (doc) {
            var store = doc.data().name;                                // point to the store name
            store_input.setAttribute('value', store);                   // set the input element value as the store name
        })
};

/**
 * Read and set the value of Maximum Occupancy input to the current maximum occupancy value of the store.
 */
function input_occupancyValue() {

    let occupancy_input = document.getElementById('occupancy-input');   // point to the occupancy input element
    let occupancy = sessionStorage.getItem('occupancy');                // retrieve the occupancy from sessionStorage
    occupancy_input.setAttribute('value', occupancy);                   // set the input element value as occupancy

};

/**
 * Read and set the value of User Name input to the current user name in the database.
 */
function input_NameValue() {
    let new_name_input = document.getElementById('new-name-input');     // point to new name input element
    let user_name = sessionStorage.getItem('name');                     // retrieve the occupancy from sessionStorage
    new_name_input.setAttribute('value', user_name);                    // set the input element value as the user's current name
}

/* Update data */


/*======================================================================================*/
/*                            FIRESTORE UPDATING FUNCTIONS                              */
/*======================================================================================*/


// --------------------------- UPDATE STORE INFORMATION -----------------------------------------


/**
 * Update the STORE INFORMATION when the save store button is clicked.
 */
document.getElementById('save-store').addEventListener('click', function () {
    updateStore();
});

/**
 * Update the user's STORE DOCUMENT with the input from the settings modal.
 * @returns - store document updated
 */
function updateStore() {

    let store_doc_id = sessionStorage.getItem('storeID')                    // retrieve the user's store ID from sessionStorage
    var storeRef = db.collection('stores').doc(store_doc_id)                // create the reference to the user's store document

    let new_occupancy = document.getElementById('occupancy-input').value    // retrieve the value of the new store occupancy from the occupancy input element

    return storeRef.update({                                                // UPDATE THE FIRESTORE DB
            name: document.getElementById('store-name-input').value,        // update the store name as the value of the store name input element
            max_occupancy: new_occupancy
        })
        .then(function () {
            console.log('changes saved.');
            sessionStorage.setItem('occupancy', new_occupancy);             // update the sessionStorage with the new occupancy number
            location.reload();                                              // reload the page
        })
        .catch(function (err) {
            console.log(err);
        })
};



// --------------------------- UPDATE USER PROFILE INFORMATION -----------------------------------------

/**
 * Update the USER'S DOCUMENT when the save profile button is clicked.
 */
document.getElementById('save-profile').addEventListener('click', function () {
    updateProfile();
});


/**
 * Update the USER'S DOCUMENT with the input from the settings modal.
 */
function updateProfile() {

    let new_username = document.getElementById('new-name-input').value;     // retrieve the new username from the value of the new name input element

    firebase.auth().onAuthStateChanged(function (user) {                    // check the current authenticated user (just to be safe instead of using sessionStorage)
        if (user) {
            db.collection('users')
                .doc(user.uid)                                              // retrieve the user's document by using the user's UID
                .update({                                                   // UPDATE THE FIRESTORE USER DOCUMENT with the new username
                    name: new_username
                })
                .then(function () {
                    console.log('changes saved.');
                    sessionStorage.setItem('name', new_username);           // update the sessionStorage with the new user name
                    setTimeout(location.reload(), 1000);                    // reload the page 
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    })

};