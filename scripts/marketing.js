// ---------------------------------Modal Feature-----------------------------------
// Get modal
var modal = document.getElementById("myModal");

// Get button that opens the modal
var btn = document.getElementById("add-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ---------------------------------Filter Feature-----------------------------------
filterSelection("all") // Execute the function and show all columns
function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("promo-card");
    if (c == "all") c = "";
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
        RemoveClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) AddClass(x[i], "show");
    }
}

// Show filtered elements
function AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
}

// Hide elements that are not selected
function RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}

// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("filter-btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("show");
        console.log(current);
        current[0].className = current[0].className.replace(" show", "");
        this.className += " show";
    });
}

// ---------------------------------Firebase Codes-----------------------------------

//function to get form value
function getInputVal(id) {
    return document.getElementById(id).value;
}

//function to listen submit button
document.getElementById('form-submit-button').addEventListener("click", function (event) {
    event.preventDefault();
    submitForm();
    close_popup();
});

//push form to firebase
function submitForm() {
    var formRef = db.collection("promotions")
    //get values
    var promoName = getInputVal('promo-name')
    var promoDescription = getInputVal('promo-description')
    var startDate = getInputVal('promo-date-start')
    var endDate = getInputVal('promo-date-end')
    //add to db
    formRef.add({
        timestamp: Date(),
        promotion: promoName,
        description: promoDescription,
        start: startDate,
        end: endDate
    })
        .then(function (docRef) {
            //create new widget, faster result
            createWidget(promoName, promoDescription, startDate, endDate);
        });
};

//function close popup
function close_popup() {
    let popup = document.getElementById('myModal')
    popup.style.display = ('none')
}

// ---------------------------------Add widget after form submission-----------------------------------

//Get records from firebase (use for page load)
function widgetQuery() {
    db.collection("promotions")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                //get values from db
                var promoName = doc.data().promotion;
                var promoDescription = doc.data().description;
                var promoStart = doc.data().start;
                var promoEnd = doc.data().end;
                createWidget(promoName, promoDescription, promoStart, promoEnd);
            });
        })
}

const dateReformat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

//Filter tabs based on dates
function filterDate(start, end) {
    let today = new Date().toISOString().slice(0, 10)
    let tag = ""
    if (start > today && end > today) {
        tag = "future"
    } else if (start < today && end < today) {
        tag = "archive"
    } else {
        tag = "current"
    }
    return tag
}

//get date count data
function getTrafficData(promoStart, promoEnd) {
    return db.collection("daily")
        .get()
        .then(function (snap) {
            let listOfCount = []
            let numOfDay = 0
            let pStart = new Date(promoStart)
            let pEnd = new Date(promoEnd)
            let dayBefore = new Date(pStart) // clone from pStart
            dayBefore.setDate(dayBefore.getDate() - 1) // minus one day
            let previousDayCount = 0;

            snap.forEach(function (doc) {
                let dbDate = new Date(doc.get("date"))

                if (pStart <= dbDate && dbDate <= pEnd) {
                    listOfCount.push(parseInt(doc.get("end_total")))
                    numOfDay += 1
                }
                if (dayBefore.getDate() == dbDate.getDate()) {
                    previousDayCount = parseInt(doc.get("end_total"))
                }
            });

            console.log(`list of count ${listOfCount} ${typeof (listOfCount)}, previousDC ${previousDayCount}, number of days ${numOfDay}`)
            let trafficStr = trafficCalculation(numOfDay, listOfCount, previousDayCount)

            console.log(`this is the return of getTrafficData ${trafficStr}`)
            console.log(trafficStr)
            return trafficStr
        })
}

//traffic calculation
function trafficCalculation(numOfDay, listOfCount, previousDayCount) {
    console.log(listOfCount)
    let sumOfDays = listOfCount.reduce((a, b) => a + b, 0)
    let countAve = sumOfDays / numOfDay
    let result = countAve / previousDayCount
    console.log(`sumOfDays ${sumOfDays}, countAve ${countAve}, result ${result}`)
    if (result >= 1) {
        return `Traffic +${result * 100}%`;
    } else if (result < 1) {
        return `Traffic -${result * 100}%`;
    } else {
        return `insufficient data`
    }
}

function format_date(date) {
    formatDate = new Date(date);
    var mmm = formatDate.getMonth();
    var dd = formatDate.getDate();

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

    return (mmm + '-' + dd)
}

function createWidget(promoName, promoDescription, promoStart, promoEnd) {
    //create new div
    newDiv = document.createElement("div");
    newDiv.setAttribute("class", `promo-card show ${filterDate(promoStart, promoEnd)}`);

    //create new elements for new promotion name
    promoNameTextNode = document.createTextNode(promoName);
    promoNamePara = document.createElement("p");
    promoNamePara.setAttribute("class", "promo-title");

    promoNamePara.appendChild(promoNameTextNode);
    //create new elements for new promotion description
    promoDescriptionTextNode = document.createTextNode(promoDescription);
    promoDescriptionPara = document.createElement("p");
    promoDescriptionPara.appendChild(promoDescriptionTextNode);
    
    //create new elements for dates
    promoStartTextNode = document.createTextNode(format_date(promoStart) + " to ");
    promoStartDateSpan = document.createElement("span");
    promoStartDateSpan.appendChild(promoStartTextNode);
    promoEndTestNode = document.createTextNode(format_date(promoEnd));
    promoEndDateSpan = document.createElement("span");
    promoEndDateSpan.appendChild(promoEndTestNode);

    getTrafficData(promoStart, promoEnd)
        .then(function (trafficText) {
            trafficTextNode = document.createTextNode(trafficText); //call get traffic data
            trafficLine = document.createElement("p");
            trafficLine.appendChild(trafficTextNode);
            trafficLine.setAttribute("class", "traffic")

            //create aside
            newAside = document.createElement("aside")
            newAside.setAttribute("class", "promo-info")

            //append elements into aside
            newAside.append(promoNamePara, promoDescriptionPara, promoStartDateSpan, promoEndDateSpan, trafficLine)

            // newAside.append(promoNamePara, promoDescriptionPara, promoStartDateSpan, promoEndTestNode, trafficLine)
            newDiv.appendChild(newAside)

            //append aside into new div
            $('#perf').append(newDiv)
        })
}
widgetQuery();

//refresh page
function refresh(time) {
    location.reload();
    // setTimeout(location.reload.bind(location), 3000)
}
