

//Question 1. User Authentication (LocalStorage)

const form = document.getElementById('register');//get register form
const Message = document.getElementById('Message');//element to show any messag
const phone = document.getElementById('phone');//input for user phone number
const trn = document.getElementById('trn');//input got user trn


/*Question 1 a. vi.
store registration information (ie. first name, last name, date of birth, gender, phone number,
email, tax registration number (trn), password, date of registration, cart{}, invoices[]) 
as a JavaScript object*/

//User object that stores all information on a customer
const User = {
    trn: "",
    firstName: "",
    lastname: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    /*Question 2 e. i 2. Shopping cart must include
    product details along with the taxes, discounts, subtotal and current total cost.*/
    cart: {
        servicelist: [],
        totalDiscount: 0,
        totalTax: 0,
        subTotal: 0,
        total: 0
    },
    invoices: []
};

var UsersArray = [];//declare userlist as an Array
if (localStorage.getItem("RegistrationData") !== null) {//if User List is not null
    UsersArray = JSON.parse(localStorage.getItem("RegistrationData"));//Get User List from local storage
}

form.addEventListener("submit", function (event) {//add function to submit button in form
    event.preventDefault();//prevent default form action

    //assign values from the form to the user array
    User.firstName = document.getElementById('fname').value;
    User.lastname = document.getElementById('lname').value;
    User.dob = document.getElementById('dob').value
    User.gender = document.querySelector('input[name="gender"]:checked').value;
    User.phone = document.getElementById('phone').value;
    User.email = document.getElementById('email').value
    User.password = document.getElementById('password').value
    User.trn = document.getElementById("trn").value
    //convert trn to a number and remove dashes
    trnNum = trn.value.replace(/[\(\)\-\' ']/g, '');


    if (isNaN(User.phone.replace(/[\(\)\-\' ']/g, ''))) {//check if phone number is valid
        phone.value = '';
        displayMessage("Telephone number is Invalid", "red");
        phone.style.borderColor = "red";
    }
    else {
        phone.style.borderColor = "silver";

        if (isNaN(trnNum)) {//check if trn is a valid number
            trn.value = '';
            displayMessage("TRN  is Invalid", "red");
            trn.style.borderColor = "red";
        }
        else {
            if (checkTRN(User.trn)) {//check if trn exist in the local storage
                UsersArray.push(User);//add user object to User list array

                /*Question 1 a. vi.
                Each registration record must be appended to localStorage key called 
                RegistrationData using JavaScript (as an array of objects.) */

                localStorage.setItem("RegistrationData", JSON.stringify(UsersArray));//store in local storage
                displayMessage("User is now Registered", "green");//display message
                //wait 1 second
                setTimeout(() => {
                    window.location.href = "../index.html"//rediret to login page
                }, 1000);
            }
        }
    }
});


phone.addEventListener("keydown", (e) => {//format Phone Number input
    if (e.key === "Backspace" || e.key === "Delete") return;
    // format number as 0(000)000-0000
    if (e.target.value.length === 1) {
        phone.value = phone.value + " (";
    }
    if (e.target.value.length === 6) {
        phone.value = phone.value + ") ";
    }
    if (e.target.value.length === 11) {
        phone.value = phone.value + " - ";
    }

});

//Question 1 a. v. trn  must be of length and in the format (000-000-000).
trn.addEventListener("keydown", (e) => {//format Trn input
    if (e.key === "Backspace" || e.key === "Delete") return;

    if (e.target.value.length === 3) {
        trn.value = trn.value + "-";
    }
    if (e.target.value.length === 7) {
        trn.value = trn.value + "-";
    }
});

//takes message as string and color of message
function displayMessage(message, color) {//takes message as string and color of message
    Message.innerHTML = message;
    Message.style.color = color;
}

//Question 1 a. iv. visitor must be over 18 years old to register. Calculate using JavaScript
function validateAge(dob) {
    let currentDate = new Date();//get current date
    let bornDate = new Date(dob.value);//create ne Date from user input

    //date is stored in miliseconds so to convert to years we divide
    //by the number of milliseconds in a year  3.1536E+10
    let age = Math.floor((currentDate - bornDate) / 3.1536E+10);//calculate users Age

    if (age < 18) {//if user is under 18 prevent login
        displayMessage("User must be 18 or Older to enter", "red");
        dob.value = null;
    }
    else {//user can login
        displayMessage("User is " + age + " Years old", "green");
    }
    //change input style based on the user age
    dob.style.borderColor = (age < 18) ? "red" : "silver";
}

function checkTRN(userTrn) {//Ensure TRN is unique
    let unique = true;//boolean to track if the trn is unique

    //Question 1 a. v. trn is unique;
    for (let index = 0; index < UsersArray.length; index++) {//iterate User list
        if (UsersArray[index].trn === userTrn) {//if the trn is found user already exist
            unique = false;//unique is set to false
        }
    }

    if (unique) {//format input style 
        displayMessage("New User", "green");
        trn.style.borderColor = "silver";

    }
    else {//if trn is not unique then clear trn input and format style
        displayMessage("User is Already Registered", "red");
        trn.value = null;
        trn.style.borderColor = "red";
    }

    return unique;//return boolean
}
