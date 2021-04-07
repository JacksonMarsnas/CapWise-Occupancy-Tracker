/* TOAST FUNCTIONS */

var option = {
    animation: true,
    delay: 2000
};

function toasty(toast_id) {
    var toast = document.getElementById(toast_id);

    var toastElement = new bootstrap.Toast(toast, option);

    toastElement.show();

};


/* CURRENT DATE */

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


/* SESSION STORAGE */


function storageStoreDocId() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var storeID = doc.data().store;
                    sessionStorage.setItem('storeID', storeID);
                })
            }
    })
};

function storageStoreName(storeID) {
    
    db.collection('stores').doc(docID)
    .get()
    .then(function(doc){
        var store = doc.data().name;
        sessionStorage.setItem('store_name', store)
    })

};

function storageMaxOccupancy() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var store = doc.data().store; // point to the name, look for name in db collection doc

                    db.collection('stores').doc(store)
                        .get()
                        .then(function (doc) {
                            var occupancy = doc.data().max_occupancy;
                            sessionStorage.setItem('occupancy', occupancy)
                        })

                })
        }
    });

};


function storageUserName() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var name = doc.data().name;
                    sessionStorage.setItem('name', name);
                })
            }
    })
};

function storageUserEmail() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var email = doc.data().email;
                    sessionStorage.setItem('email', email);
                })
            }
    })
};


/* WRITE BY SESSION STORAGE (FAST, BUT REQUIRES THAT SESSION STORAGE IS UPDATED) */


function writeMaxOccupancy(elementID) {
    $(elementID).text(sessionStorage.getItem('occupancy'))
};


function writeStoreName(elementID) {

    let docID = sessionStorage.getItem('storeID')

    db.collection('stores').doc(docID)
    .get()
    .then(function(doc){
        var store = doc.data().name;
        $(elementID).text(store);
    })
};


function writeUserName(elementID) {
    $(elementID).text(sessionStorage.getItem('name'))
};


function writeUserEmail(elementID) {
    $(elementID).text(sessionStorage.getItem('email'));
};



/* WRITE BY DB SEARCH OF LOGGED IN USER (SLOW, BUT ACCURATE!) */


function writeUserNameLive(elementID) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var n = doc.data().name; // point to the name, look for name in db collection doc
                    $(elementID).text(n);
                })
        }
    })
};


function writeLiveStoreName(elementID) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var store = doc.data().store; // point to the name, look for name in db collection doc
                    $(elementID).text(store);

                })
        }
    })
};

function writeLiveMaxOccupancy(elementID) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var store = doc.data().store; // point to the name, look for name in db collection doc

                    console.log(store)
                    db.collection('stores').doc(store)
                        .get()
                        .then(function (doc) {
                            var occupancy = doc.data().max_occupancy;
                            $(elementID).text(occupancy);
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


