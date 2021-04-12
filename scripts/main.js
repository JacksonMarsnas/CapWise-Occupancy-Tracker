// ---------------------- ON WINDOW LOAD, RUN MAIN() ----------------------------


window.onload = main

function main() {

    /* Store the user's name, email, store document ID, and maximum occupancy of the store
        to sessionStorage for quick access throughout the session. Functions from capwise_functions.js
    */
    storageUserName();
    storageUserEmail();
    storageStoreDocId();
    storageMaxOccupancy();

    // Welcome the user to the main page
    writeUserNameLive('#user-name');

    // Draw the Google Chart of occupancy data in the past week
    google.charts.load('current', {
        'packages': ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

}


/**
 * Draw the Google chart. For the reason that our application does not have enough fake,
 * collected data over time, the data is hardcoded as an example. :)
 * 
 * Code taken from Google's drawChart documentation.
 */
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