
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

    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ['Day', 'Count'],
            ['1', 30],
            ['2', 32],
            ['3', 44],
            ['4', 53],
            ['5', 21],
            ['6', 55],
            ['7', 60],
        ]);

        var options = {
            title: 'Past Week Traffic',
            legend: {
                position: 'bottom'
            },
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }

