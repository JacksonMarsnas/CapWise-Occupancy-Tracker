// ---------------------------------Modal Feature-----------------------------------
// Select modal for marketing's add promotion page
var modal = document.getElementById("myModal");

// Select button that opens the add promotion modal
var btn = document.getElementById("add-button");

// Get the <span> element that closes the add promotion modal
var span = document.getElementsByClassName("close")[0];

// Open add promotion modal when user clicks on button
btn.onclick = function () {
    modal.style.display = "block";
};

// Close modal when user clicks on the close button
span.onclick = function () {
    modal.style.display = "none";
    document.forms['modal-form'].reset();
};

// Close modale when user clicks anywhere outside of the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.forms['modal-form'].reset();
    };
};


// ---------------------------------Filter Feature-----------------------------------


/**
 * Show all widget
 * Parameter item: a string that represents a class name
 * Return: None
 */
function filterSelection(item) {
    var x, i;
    x = document.getElementsByClassName("promo-card"); 
    if (item == "all") item = "";
    // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
        RemoveClass(x[i], "show");
        if (x[i].className.indexOf(item) > -1) AddClass(x[i], "show");
    };
};
filterSelection("all")


/** 
* Add class to widget class
* Parameter element: index of desired class location
* Paramater name: name of the newly added class
* Return: None
*/
function AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        };
    };
};


/**
* Remove class from widget
* Paramater element: index of the class that needs to be removed
* Paramter element: name of class to remove
* Return: None
*/
function RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        };
    };
    element.className = arr1.join(" ");
};


// Add show to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("filter-btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("show");
        console.log(current);
        current[0].className = current[0].className.replace(" show", "");
        this.className += " show";
    });
};


// ---------------------------------Firebase Codes-----------------------------------


// Get form value
// Parameter id: id of the html element
function getInputVal(id) {
    return document.getElementById(id).value;
};


// Listen to the submit button
document.getElementById('form-submit-button').addEventListener("click", function (event) {
    event.preventDefault();
    submitForm();
    close_popup();
});


/**
 * Push add new promotion form to firebase
 * No parameters or return
 */
function submitForm() {
    //get collection
    var formRef = db.collection("promotions");
    //get values
    var promoName = getInputVal('promo-name');
    var promoDescription = getInputVal('promo-description');
    var startDate = getInputVal('promo-date-start');
    var endDate = getInputVal('promo-date-end');
    //add to db
    formRef.add({
        timestamp: Date(),
        promotion: promoName,
        description: promoDescription,
        start: startDate,
        end: endDate
    })
        .then(function (docRef) {
            //create new widget, this gives faster result
            createWidget(promoName, promoDescription, startDate, endDate);
        });
};


/**
 * Close form after submission
 * No parameters or return
 */
function close_popup() {
    let popup = document.getElementById('myModal');
    modal.style.display = "none";
};


// ---------------------------------Add widget after form submission-----------------------------------


/**
 * Get records from firebse (used for page load)
 * No parameters or return
 */
function widgetQuery() {
    db.collection("promotions") //reads from collection "promotion"
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                //get values from db
                var promoName = doc.data().promotion;
                var promoDescription = doc.data().description;
                var promoStart = doc.data().start;
                var promoEnd = doc.data().end;
                createWidget(promoName, promoDescription, promoStart, promoEnd, doc.id);
            });
        })
};


/**
* Filter widget tabs based on date
* Parameter start: promotion start date
* Parameter end: promotion end date
* Return: a string of either "future", "current" or "archive"
*/
function filterDate(start, end) {
    let today = new Date().toISOString().slice(0, 10);
    let tag = "";
    if (start > today && end > today) {
        tag = "future"
    } else if (start < today && end < today) {
        tag = "archive"
    } else {
        tag = "current"
    }
    return tag
};


/**
* Get daily count data
* Parameter promoStart: promotion start date
* Parameter promoEnd: promotion end date
* Return: a string that states the traffic performance
*/
function getTrafficData(promoStart, promoEnd) {
    return db.collection("daily") //read colelction "daily"
        .get()
        .then(function (snap) {
            let listOfCount = [];
            let numOfDay = 0;
            let pStart = new Date(promoStart);
            let pEnd = new Date(promoEnd);
            let dayBefore = new Date(pStart); // clone from pStart
            dayBefore.setDate(dayBefore.getDate() - 1); // minus one day
            let previousDayCount = 0;

            snap.forEach(function (doc) {
                let dbDate = new Date(doc.get("date"));

                if (pStart <= dbDate && dbDate <= pEnd) { //if dates are within promotion start or end, push to list
                    listOfCount.push(parseInt(doc.get("end_total")))
                    numOfDay += 1
                };
                if (dayBefore.getDate() == dbDate.getDate()) { //get count number for the date before promotion start
                    previousDayCount = parseInt(doc.get("end_total"))
                };
            });
            console.log(`list of count ${listOfCount} ${typeof (listOfCount)}, previousDC ${previousDayCount}, number of days ${numOfDay}`)
            let trafficStr = trafficCalculation(numOfDay, listOfCount, previousDayCount);
            return trafficStr
        })
};


/**
 * Calculate traffic performance
 * Parameter numOfDay: an integer that represents the number of days of the promotion
 * Parameter listOfCount: a list with elements that represent the daily count number
 * Parameter previousDayCount: an integer that represents the count for the day before promotion start date
 * Return: a string that states the traffic performance
 */
function trafficCalculation(numOfDay, listOfCount, previousDayCount) {
    let sumOfDays = listOfCount.reduce((a, b) => a + b, 0);
    let countAve = sumOfDays / numOfDay;
    let result = countAve / previousDayCount;
    console.log(`sumOfDays ${sumOfDays}, countAve ${countAve}, result ${result}`)
    if (result >= 1) {
        return `Traffic +${result.toFixed(2) * 100}%`;
    } else if (result < 1) {
        return `Traffic -${result.toFixed(2) * 100}%`;
    } else {
        return `No traffic data yet`
    }
}


/** 
 * Format date output
 * Parameter date: a date in ISO format
 * Return: date format in MONTH - DAY
*/
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


/**
 * Create close button
 * Parameter docID: Firebase document ID
 * Return: button element
 */
function make_close_btn(docID) {
    //create close button
    let close_btn = document.createElement('button');   
    close_btn.setAttribute('type', 'button');           
    close_btn.setAttribute('class', 'btn-close');

    //listen to click
    close_btn.addEventListener('click', function () {   

        db.collection('promotions').doc(docID) // search for collection "promotions" and a specific document id
            .delete()                                              
            .then(function(){
                console.log('Delete from db successful.')                      
                close_btn.parentNode.parentNode.remove();           
            }).catch(function(err){
                console.log('Delete unsuccessful', err)
            })
    })
    return close_btn
};


/**
 * Create widget
 * Parameter promoName: a string of the promotion name
 * Parameter promoDescription: a string of the promotion description
 * Parameter promoStart: a date of the promotion start
 * Parameter promoEnd: a date of the promotion end
*/
function createWidget(promoName, promoDescription, promoStart, promoEnd, docID) {
    getTrafficData(promoStart, promoEnd)
        .then(function (trafficText) {
            //create new div
            let newDiv = document.createElement("div");
            newDiv.setAttribute("class", `promo-card show ${filterDate(promoStart, promoEnd)}`);

            //refer to close button
            let close_btn = make_close_btn(docID);             

            //create new element for new promotion name
            promoNameTextNode = document.createTextNode(promoName);
            promoNamePara = document.createElement("div");
            promoNamePara.setAttribute("class", "promo-title");
            promoNamePara.appendChild(promoNameTextNode);

            //create new element for new promotion description
            promoDescriptionTextNode = document.createTextNode(promoDescription);
            promoDescriptionPara = document.createElement("div");
            promoDescriptionPara.appendChild(promoDescriptionTextNode);

            //create new element for dates
            promoStartTextNode = document.createTextNode(format_date(promoStart) + " to ");
            promoStartDateSpan = document.createElement("span");
            promoStartDateSpan.appendChild(promoStartTextNode);
            promoEndTestNode = document.createTextNode(format_date(promoEnd));
            promoEndDateSpan = document.createElement("span");
            promoEndDateSpan.appendChild(promoEndTestNode);

            //create new element for traffic
            console.log(`this is trafficText ${trafficText}`)
            console.log(`promoStart ${promoStart} promoEnd ${promoEnd}`)
            trafficTextNode = document.createTextNode(trafficText); //call get traffic data
            trafficLine = document.createElement("div");
            trafficLine.appendChild(trafficTextNode);

            //create aside
            newAside = document.createElement("aside")
            newAside.setAttribute("class", "promo-info")

            //append elements into aside
            newAside.append(close_btn, promoNamePara, promoDescriptionPara, promoStartDateSpan, promoEndDateSpan, trafficLine)
            newDiv.appendChild(newAside)

            //append delete button into new div
            

            //append aside into new div
            $('#perf').append(newDiv)
        })
};
widgetQuery();


/*
* Refresh page
* Parameter time: interval between each refresh
*/
function refresh(time) {
    location.reload();
};
