
let newInvoiceNumber;

window.onload = function () {
    const page = document.getElementsByTagName('body')[0].id;
      //generate  invoice number
    newInvoiceNumber= generateInvoiceNumber();
    if (page === 'checkoutPage') {
        displayCartSummary();
    }
};

//  Display the cart summary
function displayCartSummary() {
    const userIndex = localStorage.getItem("currentUser");
    const userArray = JSON.parse(localStorage.getItem("RegistrationData"));
    const currentUser = userArray[userIndex];

    const invoiceTable = document.getElementById('Invoice');
    const cartItems = currentUser.cart.servicelist;
    let subtotal = 0, totalTax = 0, totalDiscount = 0;

    // Clear previous items in the invoice table
    invoiceTable.innerHTML = "";
    //Create Table Header
    const header = document.createElement('tr');
    header.innerHTML= `
        <tr>
        <th>Name</th>
        <th>Cost</th>
        <th>Discount</th>
        <th>Tax</th>
        </tr>
    `;
    invoiceTable.appendChild(header);

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.cost}</td>
            <td>$${item.discount}</td>
            <td>$${item.tax}</td>
        `;
        invoiceTable.appendChild(row);

        subtotal += item.cost;
        totalTax += item.tax;
        totalDiscount += item.discount;
    });

    // Display totals
    document.getElementById('subTotal').innerText = `$${subtotal}`;
    document.getElementById('totalTax').innerText = `$${totalTax}`;
    document.getElementById('totalDiscount').innerText = `$${totalDiscount}`;
    document.getElementById('GrandTotal').innerText = `$${(subtotal + totalTax) - totalDiscount}`;

    // Display the current date
    const date = new Date().toLocaleDateString();
    document.getElementById('date').innerText = date;

    //Display TRN
    document.getElementById('trn').innerHTML=currentUser.trn;

    //Display Invoice Number
    document.getElementById("invoiceNumber").innerHTML=newInvoiceNumber;
}

// Confirm checkout
function confirmCheckout() {
    const userIndex = localStorage.getItem("currentUser");
    const userArray = JSON.parse(localStorage.getItem("RegistrationData"));
    const currentUser = userArray[userIndex];
    
    const invoiceData = {
        company: "Rick's Auto Shop",
        date: new Date().toLocaleDateString(),
        shippingDetails: {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            amountPaid: document.getElementById('amount').value
        },
        invoiceNumber: newInvoiceNumber,
        trn: currentUser.trn,
        items: currentUser.cart.servicelist,
        subtotal: document.getElementById('subTotal').innerText,
        totalTax: document.getElementById('totalTax').innerText,
        totalDiscount: document.getElementById('totalDiscount').innerText,
        grandTotal: document.getElementById('GrandTotal').innerText
    };

    // Append the invoice to the user's invoice array
    currentUser.invoices.push(invoiceData);

    // Store all invoices in localStorage under AllInvoices key
    let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
    allInvoices.push(invoiceData);
    localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

    // Clear the cart
    currentUser.cart.servicelist = [];
    currentUser.cart.total = 0;
    currentUser.cart.subTotal = 0;
    currentUser.cart.totalDiscount = 0;
    currentUser.cart.totalTax = 0;

    // Update localStorage
    userArray[userIndex] = currentUser;
    localStorage.setItem("RegistrationData", JSON.stringify(userArray));

    // Display message 
    displayEmailMessage();

    // Redirect to home page or confirmation page
    alert("Checkout successful! Your invoice has been saved.");
    window.location.href = "homePage.html";
}

//  Generate a unique invoice number
function generateInvoiceNumber() {
    return `INV-${Math.floor(Math.random() * 1000000)}`;
}

// Display message for email sent confirmation
function displayEmailMessage() {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = "Your invoice has been sent to your email.";
}

// Cancel checkout
function cancelCheckout() {
    window.location.href = "cartPage.html";
}
