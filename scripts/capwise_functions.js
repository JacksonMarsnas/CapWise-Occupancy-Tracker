/* TOAST FUNCTIONS */


/**Show the given toast with its toad ID.
 * 
 * @param {*} toast_id - a string, the toast's id (without the #)
 */
function toasty(toast_id) {

    var option = {
        animation: true,
        delay: 2000
    };

    var toast = document.getElementById(toast_id);

    var toastElement = new bootstrap.Toast(toast, option);

    toastElement.show();

};


/* CURRENT DATE */

/**Get the current date in format mmm-dd-yyyy, where month is the first three letters of the month.
 * 
 * @returns a string, the date today
 */

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

/**Write the current date to an element with the passed element ID.
 * 
 * @param {*} elementID - a string, the ID of the element you would like to have written to, 
 *                        must be an element that can have textContent
 */
function write_date(elementID){
    let element = document.getElementById(elementID)  // Retrieve the element with the given ID from the document
    element.textContent = current_date()              // Write the current date to it by calling current_date()
}

/**Get the current time in 12-hour format.
 * 
 * @returns - a string, the current time when the function is called in the format hh:mm am/pm 
 */

function current_time() {
    var hh = today.getHours()
    var mm = today.getMinutes()

    if (mm < 10) {
        mm = "0" + mm
    }

    if (hh >= 12) {
        hh = hh % 12
        return (hh + ":" + mm + "pm")
    } else {
        return (hh + ":" + mm + "am")
    }
}


/* ----------------------------------------   SESSION STORAGE FUNCTIONS  ------------------------------------------------ 

    When designing by use of Firestore, we quickly reqlized that reading information from Firestore can take a
    long amount of time. To speed up the process, we've used main.html to call a few functions to store a few
    essential information that we use across a few pages. This session storage generally stores: the maxium occupancy,
    the current total count, the name of the user, the user's store ID reference in the database, and their email
*/

/**
 * Store the user's storeID number.
 */
function storageStoreDocId() {

    firebase.auth().onAuthStateChanged(function (user) {        // Check the current authenticated user
        if (user) {
            db.collection('users') 
                .doc(user.uid)                                  // get the user's document in 'users'
                .get()                                          // READ 
                .then(function (doc) {
                    var storeID = doc.data().store;         
                    sessionStorage.setItem('storeID', storeID); // store the 'store' value from the user document to sessionStorage
                })
            }
    })
};

/**
 * Store the user's store name to sessionStorage
 * @param {*} storeID - the user's store ID (can be retrieved from session storage)
 */
function storageStoreName(storeID) {
    
    db.collection('stores').doc(storeID)    
    .get()                                      // READ the user's store document
    .then(function(doc){
        var store = doc.data().name;
        sessionStorage.setItem('store_name', store)     // store the store name to sessionStorage
    })

};


/**
 * Store the Maximum Occupancy for the user's store to sessionStorage
 */
function storageMaxOccupancy() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid)                              // the user's UID
                .get()                                      //READ
                .then(function (doc) {
                    var store = doc.data().store;           // point to the store document ID of the user

                    db.collection('stores').doc(store)      // look for the store document ID of the user in 'stores' collection
                        .get()                              // READ
                        .then(function (doc) {
                            var occupancy = doc.data().max_occupancy;           // point to the max_occupancy
                            sessionStorage.setItem('occupancy', occupancy)      // store max_occupancy to sessionStorage
                        })

                })
        }
    });

};

/**
 * Store the User's Name to sessionStorage.
 */
function storageUserName() {

    firebase.auth().onAuthStateChanged(function (user) {        // Check the user that's logged in
        if (user) {
            db.collection('users')
                .doc(user.uid)                                  // the user's UID
                .get()                                          //READ !!
                .then(function (doc) {
                    var name = doc.data().name;                 // point to user's name in the document
                    sessionStorage.setItem('name', name);       // store the user's name in sessionStorage
                })
            }
    })
};

/**
 * Store the user's email to sessionStorage.
 */
function storageUserEmail() {

    firebase.auth().onAuthStateChanged(function (user) {        // Check the user that is logged in
        if (user) {
            db.collection('users')
                .doc(user.uid)                                  // the user's UID
                .get()                                          //READ
                .then(function (doc) {
                    var email = doc.data().email;               // point to the user's email in the document
                    sessionStorage.setItem('email', email);     // store the user's email in sessionStorage
                })
            }
    })
};




// ---------------------------- WRITE BY DRAWING FROM SESSION STORAGE --------------------------------------
/*   
The following functions write by making use of drawing from sessionStorage.
This method of drawing information is much faster than reading from Firebase all the time for small tasks,
but requires that sessionStorage is updated when any changes are made to Firestore db.

*/


/**
 * Write the maximum occupancy to an element by drawing information from sessionStorage.
 * @param {*} elementID - the ID name of the element being written in
 */
function writeMaxOccupancy(elementID) {
    $(elementID).text(sessionStorage.getItem('occupancy'))  // get the element and add the text of max occupancy to it from sessionStorage
};


/**
 * Write the store name to an element by drawing information from sessionStorage.
 * @param {*} elementID - the ID name of the element being written in
 */
function writeStoreName(elementID) {

    let docID = sessionStorage.getItem('storeID')   // retrieve the storeID of the user from sessionStorage

    db.collection('stores').doc(docID)
    .get()                                          // READ the store document
    .then(function(doc){
        var store = doc.data().name;                // point to the name of the store
        $(elementID).text(store);                   // write the store name to the element
    })
};

/**
 * Write the user's name to a given element by drawing the information from sessionStorage.
 * @param {*} elementID - the ID name of the element being written in
 */
function writeUserName(elementID) {
    $(elementID).text(sessionStorage.getItem('name'))   
};

/**
 * Write the user's email to an element by drawing the information from sessionStorage
 * @param {*} elementID - the ID name of the element being written in
 */
function writeUserEmail(elementID) {
    $(elementID).text(sessionStorage.getItem('email'));
};



// ---------------------------- WRITE BY READING FROM FIRESTORE 'LIVE' WRITING --------------------------------------
/*   
The following functions write by checking the current authenticated user, then pulling information from the Firestore
based on the authentication.

This method of drawing information is slow, but accurate and is good for elements on a page that may change and be
updated, such as in /settings.html. I've elected to call it 'live' writing, since this is not as static as sessionStorage.

*/

/**
 * Write the user's name to an element by using Firebase authentication to find current user's information
 * @param {*} elementID - the ID name of the element being written in
 */
function writeUserNameLive(elementID) {
    firebase.auth().onAuthStateChanged(function (user) {    // check the current authenticated user
        if (user) {
            db.collection('users')
                .doc(user.uid)                              // the user's UID
                .get()                                      // READ user's document
                .then(function (doc) {
                    var n = doc.data().name;                // point to the name, look for name in db collection doc
                    $(elementID).text(n);                   // write the name to the element
                })
        }
    })
};

/**
 * Write the user's store name to an element by using Firebase authentication to find current user's information
 * @param {*} elementID - the ID name of the element being written in
 */
function writeLiveStoreName(elementID) {

    firebase.auth().onAuthStateChanged(function (user) {    // check the current authenticated user
        if (user) {
            db.collection('users')
                .doc(user.uid)                              // the user's UID
                .get()                                      // READ !!
                .then(function (doc) {
                    var store = doc.data().store;           // point to the store, look for name in db collection doc
                    $(elementID).text(store);               // write the store to the element

                })
        }
    })
};

/**
 * Write the user's store maximum occupancy to an element by using Firebase authentication to find current user's information
 * @param {*} elementID - the ID name of the element being written in
 */
function writeLiveMaxOccupancy(elementID) {

    firebase.auth().onAuthStateChanged(function (user) {    // check the current authenticated user
        if (user) {
            db.collection('users')
                .doc(user.uid)                              // the user's UID
                .get()                                      // READ !!
                .then(function (doc) {
                    var store = doc.data().store;           // point to the store ID

                    db.collection('stores').doc(store)      // using the store ID, search for the document in stores collection
                        .get()                              // READ
                        .then(function (doc) {
                            var occupancy = doc.data().max_occupancy;   // point to the store's maximum occupancy
                            $(elementID).text(occupancy);               // write the maximum occupancy to the element
                        })

                })
        }
    })

};



/* PREVIOUS READ FUNCTIONS */



// function writeUserEmail(elementID) {

//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             db.collection('users')
//                 .doc(user.uid) // the user's UID
//                 .get() //READ !!
//                 .then(function (doc) {
//                     // console.log(doc.data().name);
//                     var email = doc.data().email; // point to the name, look for name in db collection doc
//                     $(elementID).text(email);

//                 })
//         }
//     })

// }


