function sayHello() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // console.log(someone.uid)
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

