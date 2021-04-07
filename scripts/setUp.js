storageUserName()
writeUserNameLive('#user-name');

let store_name = document.getElementById('store-name').value

let all_staff_info = document.getElementById('staff').value.split(',')

let staff_data = {}

var option = {
    animation: true,
    delay: 2000
};

function toasty(toast_id) {
    var toast = document.getElementById(toast_id);

    var toastElement = new bootstrap.Toast(toast, option);

    toastElement.show();

};

document.getElementById('submit-btn').addEventListener("click", function () {

    if (store_name.length >= 1 && all_staff_info.length >= 1) {
        writeStore();
    } else {
        console.log('hey')
        toasty('toasty-failure');
    }

});

function writeStore() {


    for (i = 0; i < all_staff_info.length; i++) {
        let staff_info = all_staff_info[i].split("=");
        let staff_name = staff_info[0];
        let staff_email = staff_info[1];

        staff_data[staff_name] = staff_email
    }


    db.collection("stores").doc(store_name).set({
            name: store_name,
            max_occupancy: document.getElementById('occupancy').value,
            staff: staff_data

        }).then(function () {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    let userRef = db.collection('users').doc(user.uid) // the user's UID

                    userRef.update({
                        store: store_name
                    })

                }
            })
        }).then(function () {
            console.log('Everything saved!');
            window.location.assign('./main.html');
        })
        .catch(function (err) {
            console.log('no');
            toasty('toasty-failure');
        })

};