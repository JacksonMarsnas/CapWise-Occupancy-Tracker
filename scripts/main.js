window.onload = writeUserName('#user-name')

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


storageUserName();
storageUserEmail();
storageStoreName();
storageMaxOccupancy();