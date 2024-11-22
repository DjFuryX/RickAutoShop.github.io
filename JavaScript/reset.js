
const form = document.getElementById('reset');// get reset form
const trn = document.getElementById('trn');//get trn input element
var UsersArray = [];//declare userlist as an Arra

if (localStorage.getItem("RegistrationData") !== null) {//if User List is not null
    UsersArray = JSON.parse(localStorage.getItem("RegistrationData"));//Get User List from local storage
}

form.addEventListener("submit", function (event) {//add function to submit button in form
    event.preventDefault();//prevent default form actions

    let password = document.getElementById('password').value //password user entered
    let trnNUm = trn.value.replace(/[\(\)\-\' ']/g, '');//trn value as a number and remove dashes

    if (isNaN(trnNUm)) {//if the trn is a invalid number
        trn.value = '';//clear input
        displayMessage("TRN  is Invalid", "red");
        trn.style.borderColor = "red";
    }
    else {

        setPassword(trn.value, password);//function update user information with the new password
        setTimeout(() => {
            window.location.href = "../index.html"//redirects to the login page
        }, 1000);
    }

});

trn.addEventListener("keydown", (e) => {//format Trn input
    if (e.key === "Backspace" || e.key === "Delete") return;
    //add a dash (-) every third numbe
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

/*Question 1 b.vi Reset Password hyperlink (used to allow the user to change their
    password that is associated with the localStorage key called, RegistrationData by matching their trn*/

function setPassword(trnString, pass) {//takea trn as a string and new password
    for (let index = 0; index < UsersArray.length; index++) {//iterates the user list
        if (UsersArray[index].trn === trnString) {//if trn is found 
            //update user password
            UsersArray[index].password = pass;
            //save to local storage
            localStorage.setItem("RegistrationData", JSON.stringify(UsersArray));
            //format trn input stylet
            trn.style.borderColor = "silver";
            displayMessage("User Found Password Updated", "green");
            return;//end function
        }
        else {
            //display error message if user is not found
            displayMessage("User Not found", "red");
            trn.style.borderColor = "red";
        }

    }
}
