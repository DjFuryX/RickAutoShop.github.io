
let UsersArray = [];//declare userlist Array
if (localStorage.getItem("RegistrationData") !== null) {//if User List is not null
    UsersArray = JSON.parse(localStorage.getItem("RegistrationData"));//Get User List from local storage
}

const currentUser = localStorage.getItem("currentUser") || null;//index of cuurent user logged in

window.onload = function () {
    const page = document.getElementsByTagName('body')[0].id;
    if (page === 'statspage') {
        ShowUserFrequency();
        ShowInvoices()
        GetUserInovices()
    }
};

function ShowUserFrequency() {

    let GenderChart = document.getElementById("GenderChart");
    //control chart bar height
    const MaxBarHeight = 180;
    const MinBarHeight = 20;
    //array of total for each gender
    const genderdata = [0, 0, 0]


    for (let index = 0; index < UsersArray.length; index++) {//iterate list of user
        //count total for each gender 
        if (UsersArray[index].gender === "Male") {
            genderdata[1]++;
        } if (UsersArray[index].gender === "Female") {
            genderdata[0]++;
        } if (UsersArray[index].gender === "Other") {
            genderdata[2]++;
        }

    }

    //add a bar for each total in the array
    genderdata.forEach(Total => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = scale(Total,genderdata) + "px";
        bar.innerHTML = Total;
        GenderChart.append(bar);
    });

    //scales bar height 
    function scale(unscaledNum,values) {
        var min=Math.min.apply(null, values);
        var max=Math.max.apply(null,values);

        //ensure the bar falls within the minimun and maximum height
        return (MaxBarHeight - MinBarHeight) * (unscaledNum - min) / (max - min) + MinBarHeight;
    }



    /* JavaScript for Charts */
    let currentDate = new Date();//get current date
    // Initialize counters forand age groups
    const ageGroupCounts = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

    // Loop through the user data and populate the counts
    UsersArray.forEach(user => {
        let bornDate = new Date(user.dob);//create ne Date from user input
        // Count age groups
        
        //age is not stored in Userdata use the dob to calculate
        const age = Math.floor((currentDate - bornDate) / 3.1536E+10);//calculate users Age;

        if (age >= 18 && age <= 25) {
            ageGroupCounts["18-25"]++;
        } else if (age >= 26 && age <= 35) {
            ageGroupCounts["26-35"]++;
        } else if (age >= 36 && age <= 50) {
            ageGroupCounts["36-50"]++;
        } else if (age > 50) {
            ageGroupCounts["50+"]++;
        }
    });

    

    // Create Age Group Chart
    const ageContainer = document.getElementById('AgeChart');//get body of age chart
    //Create a bar for each age group
    Object.keys(ageGroupCounts).forEach(ageGroup => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = scale(ageGroupCounts[ageGroup],Object.values(ageGroupCounts)) + "px";
        bar.innerHTML = ageGroupCounts[ageGroup];
        //add bar to chart body
        ageContainer.appendChild(bar);
    });

};

/* JavaScript for Charts and Invoices */

//show all invoices stored in the local storage Allinvoice
function ShowInvoices() {
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    //get user value to search for
    const searchQuery = document.getElementById("searchAllInvoices").value.trim().toLowerCase();

    //find search query in the allInvoice and add to the Flitered invoice array
    const filteredInvoices = searchQuery
        ? allInvoices.filter(invoice =>
            invoice.trn.toLowerCase().includes(searchQuery) ||
            invoice.invoiceNumber.toLowerCase().includes(searchQuery))
        : allInvoices;
    //get body of invoice table
    const tableBody = document.getElementById("invoicesTable");
    //clear the table body
    tableBody.innerHTML = "";
    
    //add each invoice to the table
    filteredInvoices.forEach(invoice => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${invoice.invoiceNumber}</td>
            <td>${invoice.trn}</td>
            <td>${invoice.date}</td>
            <td>${invoice.grandTotal}</td>
        `;
        tableBody.appendChild(row);
    });

    // log the invoices found
    console.log(filteredInvoices);
}

function GetUserInovices() {
    let userTRN = UsersArray[currentUser].trn;
    const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    userInvoice = [];
    const invoiceNum = document.getElementById("searchUserInvoices").value || "novalue";

    if (invoiceNum === "novalue") {//SHow all invoices  for current User
        userInvoice = allInvoices.filter(invoice => invoice.trn.includes(userTRN));
    }
    else {//filer byy customer inoice number
        userInvoice = allInvoices.filter(invoice => invoice.invoiceNumber === invoiceNum);
    }

    const tableBody = document.getElementById("userInvoicesTable");
    tableBody.innerHTML = "";

    userInvoice.forEach(invoice => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${invoice.invoiceNumber}</td>
            <td>${invoice.trn}</td>
            <td>${invoice.date}</td>
            <td>${invoice.grandTotal}</td>
        `;
        tableBody.appendChild(row);
    });
}

