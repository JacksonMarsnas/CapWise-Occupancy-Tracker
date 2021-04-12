// ---------------------- ON WINDOW LOAD, RUN MAIN() ----------------------------

window.onload = main;

function main() {

    // store the user's name to sessionStorage
    storageUserName();

    // Write the user's name live by reading from Firestore (capwise_functions.js)
    writeUserNameLive('#user-name');

}



// ----------------------------- Add Event listener to the Submit form button ---------------------------------

/**
 * Write to FireStore if the user has filled in all fields correctly.
 */
document.getElementById('submit-btn').addEventListener("click", function () {

    let store_name = document.getElementById('store-name').value                // get the value of the store name
    let store_occupancy = document.getElementById('occupancy').value            // get the value of the store occupancy
    let all_staff_info = document.getElementById('staff').value.split(',')      // get the value of the staff information

    if (store_name.length >= 1 && all_staff_info.length >= 1 && store_occupancy != 0) {     // evaluate if all the retrieved values are not empty
        writeStore();                                                                       // write to Firestore if we're good!
    } else {
        toasty('toasty-failure');
    }

});


/*======================================================================================*/
/*                      FIRESTORE WRITE AND UPDATE FUNCTION                             */
/*======================================================================================*/

/**
 * Write the Store information to Firestore and include the new Store document ID in the user's document.
 * Adding the store ID to the user's document allows multiple user's to access information from the same store
 * if necessary and if we can implement that in the future!
 * 
 */
function writeStore() {

    let store_name = document.getElementById('store-name').value;            // retrieve the store name value
    let all_staff_info = document.getElementById('staff').value.split(',');  // retreieve the staff information values and split it into a list
    let staff_data = {};                                                     // define the staff data as an array

    for (i = 0; i < all_staff_info.length; i++) {                            // for every staff in the array
        let staff_info = all_staff_info[i].split("=");                       // split the information at the = sign (splitting the staff name from their email)
        let staff_name = staff_info[0];                                      // assign staff name as the first element in the split list
        let staff_email = staff_info[1];                                     // assign staff email as the second element in the split list

        staff_data[staff_name] = staff_email                                 // add a key:value pair to staff data array, the staff name: staff email
    }

    db.collection("stores").add({                                            // WRITE a new store in the stores collection with the submitted information
            name: store_name,
            max_occupancy: document.getElementById('occupancy').value,
            staff: staff_data
        }).then(function (docRef) {

            firebase.auth().onAuthStateChanged(function (user) {             // check the current authenticated user
                if (user) {
                    let userRef = db.collection('users').doc(user.uid)       // retrieve the current user's document from Firestore using the user's UID

                    userRef.update({                                         // UPDATE the user's document to include the new created store document's ID
                        store: docRef.id
                    })
                }
            })

        }).then(function () {
            console.log('Everything saved!');
            window.location.assign('./main.html');                          // re-direct to main.html if successful
        })
        .catch(function (err) {
            console.log(err);
            toasty('toasty-failure');
        })
};