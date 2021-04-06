

/* Provide user specific name to #user-name */

function writeUserName(elementID) {
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

function toasty(toast_id) {
    var toast = document.getElementById(toast_id);

    var toastElement = new bootstrap.Toast(toast, option);

    toastElement.show();

}

function writeMaxOccupancy(elementID) {

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

}

function writeStoreName(elementID) {

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
}

function writeUserEmail(elementID) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var email = doc.data().email; // point to the name, look for name in db collection doc
                    $(elementID).text(email);

                })
        }
    })

}

