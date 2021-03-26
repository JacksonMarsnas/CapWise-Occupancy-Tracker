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
    .then(function(docRef) {
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
function widgetQuery(){
    db.collection("promotions")
    .get()
    .then(function(snap){
        snap.forEach(function(doc) {
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
    year:  'numeric',
    month: 'long',
    day:   'numeric',
});

function createWidget(promoName, promoDescription, promoStart, promoEnd) {
    //create new div
    newDiv = document.createElement("div");
    newDiv.setAttribute("class", "promo-card all show");
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
    promoStartTextNode = document.createTextNode(promoStart + " to ");
    promoStartDateSpan = document.createElement("span");
    promoStartDateSpan.appendChild(promoStartTextNode);
    promoEndTestNode = document.createTextNode(promoEnd);
    promoEndDateSpan = document.createElement("span");
    promoEndDateSpan.appendChild(promoEndTestNode);
    //create new elements for traffic...need to include traffic calculation

    //create aside
    newAside = document.createElement("aside")
    newAside.setAttribute("class", "promo-info")
    //append elements into aside
    newAside.append(promoNamePara, promoDescriptionPara, promoStartDateSpan, promoEndTestNode)
    newDiv.appendChild(newAside)
    //append aside into new div
    $('#perf').append(newDiv)
}
widgetQuery();

//refresh page
function refresh(time) {
    location.reload();
    // setTimeout(location.reload.bind(location), 3000)
}
