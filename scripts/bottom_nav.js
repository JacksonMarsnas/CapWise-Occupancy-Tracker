/*  Select page button  */

/* for COUNT */

if (window.location.pathname == "/counter.html") {
    var count_nav_button = document.getElementById('count-nav-btn')
    count_nav_button.style.backgroundColor = '#7868E6'

    document.getElementById('count-icon').style.filter = 'invert()'
    document.querySelector('#count-nav-btn p').style.filter = 'invert()'
}


/* for MARKETING */

if (window.location.pathname == "/marketing.html") {
    var count_nav_button = document.getElementById('marketing-nav-btn')
    count_nav_button.style.backgroundColor = '#7868E6'

    document.getElementById('marketing-icon').style.filter = 'invert()'
    document.querySelector('#marketing-nav-btn p').style.filter = 'invert()'
}


/* for SCHEDULING */


if (window.location.pathname == "/scheduling.html") {
    var count_nav_button = document.getElementById('scheduling-nav-btn')
    count_nav_button.style.backgroundColor = '#7868E6'

    document.getElementById('scheduling-icon').style.filter = 'invert()'
    document.querySelector('#scheduling-nav-btn p').style.filter = 'invert()'
}



/* TEMPLATE */

// if (window.location.pathname == "PATH") {
//     var count_nav_button = document.getElementById('DIV ID')
//     count_nav_button.style.backgroundColor = '#7868E6'

//     document.getElementById('SVG ICON ID').style.filter = 'invert()'
//     document.querySelector('#DIV-ID p').style.filter = 'invert()'
// }