
let attemps = 0;
const form = document.getElementById('loginForm');//get login form element
const trn = document.getElementById('trn');// User trn input element
const Message = document.getElementById('Message');//element to show any message
var UsersArray = [];//declare userlist Array

if (localStorage.getItem("RegistrationData") !== null) {//if User List is not null
    UsersArray = JSON.parse(localStorage.getItem("RegistrationData"));//Get User List from local storage
}

form.addEventListener("submit", function (event) {//add function to submit button in form
    event.preventDefault();//prevent default form actions
    const usertrn = trn.value;//trn value as a string
    trnNUM = trn.value.replace(/[\(\)\-\' ']/g, '');//trn value as a number
    const userpassword = document.getElementById('password').value;//password user entered

    if (isNaN(trnNUM)) {//check if trn is valid
        trn.value = '';
        displayMessage("TRN  is Invalid", "red");
        trn.style.borderColor = "red";
    }
    else {

        checkPassword(usertrn, userpassword);//check if password matches user and redirect to homepage

        attemps++;//increseae number of invalid attempts
    }

    /* Question 1 b.iii a visitor is given three (3) attempts to enter a correct trn and password. 
    If login is successful, redirect the user to the product catalog. 
    Otherwise, redirect the user to an error/account locked page.*/
    if (attemps == 3) {//maximum number of invalid attempts reached
        window.location.href = "./webpages/errorPage.html";//redirect to erro page

    }
});


trn.addEventListener("keydown", (e) => {//format Trn input on key press
    if (e.key === "Backspace" || e.key === "Delete") return;
    //add a dash (-) every third number
    if (e.target.value.length === 3) {
        trn.value = trn.value + "-";
    }
    if (e.target.value.length === 7) {
        trn.value = trn.value + "-";
    }
});

//display a message to the user
function displayMessage(message, color) {//takes message as string and color of message
    Message.innerHTML = message;
    Message.style.color = color;
}

// Question 1 b.ii validate this login data by checking the currently entered trn and password
// against data associated with the localStorage key called, RegistrationData. 
function checkPassword(trnNUm, pass) {//check if password matches trn

    for (let index = 0; index < UsersArray.length; index++) {//iterate list of user

        if (UsersArray[index].trn === trnNUm && UsersArray[index].password === pass) {
            //if user is found and password mathces
            displayMessage("Login Successfull", "green");
            trn.style.borderColor = "silver";
            localStorage.setItem("currentUser", index);//save index of logged in user
            setTimeout(() => {//wait 1 second the go to home page
                window.location.href = "./webpages/homePage.html";
            }, 1000);

            return;//close function
        }
        else {
            //if user is not found or password is invalid display error message
            displayMessage("Login Unsuccesfull", "red");
            trn.style.borderColor = "red";
        }
    }
}