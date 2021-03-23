//---MODAL FEATURE---//
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

//---FILTER FEATURE---//
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
// //Firebase reference collection
// var InputRef = firebase.database().ref('promotions');
var InputRef = db.collection('promotions');


//function to get form value
function getInputVal(id){
    return document.getElementById(id).value;
}

//Form Submission
document.getElementById('add-promo-form').addEventListener("submit", function(event) {
    event.preventDefault();

    //Get Values
    var promoName = getInputVal('promo-name')
    var promoDescription = getInputVal('promo-description')
    var startDate = getInputVal('promo-date-start')
    var endDate = getInputVal('promo-date-end')
    
    //Save form input
    saveInput(pname, description, start, end)
});

//function to save form inputs to firebase
function saveInput(pname, description, start, end) {
    var newInputRef = InputRef.push();
    newInputRef.set({
        pname: promoName,
        description: promoDescription,
        start: startDate,
        end: endDate
    });
}

// Reference tutorial:
// https://www.youtube.com/watch?v=PP4Tr0l08NE

// function submitForm() {
//     var formRef = db.collection("promotions")

//     formRef.add({
//             timestamp: Date(),
//             recipients: document.getElementById('recipient').value,
//             message: document.getElementById('notify-message').value
//         }).then(function () {
//             toasty('toasty-success');
//         })
//         .catch(function (error) {
//             toasty('toasty-failure');
//         })
// };