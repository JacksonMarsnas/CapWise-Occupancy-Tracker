/* Provide user specific name to #user-name */

function sayHello() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users')
                .doc(user.uid) // the user's UID
                .get() //READ !!
                .then(function (doc) {
                    // console.log(doc.data().name);
                    var n = doc.data().name; // point to the name, look for name in db collection doc
                    $('#user-name').text(n);
                })
        }
    })
};

window.onload = sayHello();

function toasty(toast_id) {
    var toast = document.getElementById(toast_id);

    var toastElement = new bootstrap.Toast(toast, option);

    toastElement.show();

}