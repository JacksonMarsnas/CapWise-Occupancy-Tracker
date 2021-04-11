storageUserName()
writeUserNameLive('#user-name');


document.getElementById('submit-btn').addEventListener("click", function () {

    let store_name = document.getElementById('store-name').value
    let store_occupancy = document.getElementById('occupancy').value
    let all_staff_info = document.getElementById('staff').value.split(',')

    if (store_name.length >= 1 && all_staff_info.length >= 1 && store_occupancy != 0) {
        writeStore();
    } else {
        toasty('toasty-failure');
    }

});

function writeStore() {

    let store_name = document.getElementById('store-name').value
    let all_staff_info = document.getElementById('staff').value.split(',')
    let staff_data = {}

    for (i = 0; i < all_staff_info.length; i++) {
        let staff_info = all_staff_info[i].split("=");
        let staff_name = staff_info[0];
        let staff_email = staff_info[1];

        staff_data[staff_name] = staff_email
    }

    db.collection("stores").add({
            name: store_name,
            max_occupancy: document.getElementById('occupancy').value,
            staff: staff_data
        }).then(function (docRef) {

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    let userRef = db.collection('users').doc(user.uid) // the user's UID

                    userRef.update({
                        store: docRef.id
                    })
                }
            })

        }).then(function () {
            console.log('Everything saved!');
            window.location.assign('./main.html');
        })
        .catch(function (err) {
            console.log(err);
            toasty('toasty-failure');
        })
};