// Sample username and password
const sampleUsername = "user123";
const samplePassword = "password123";

// Login form submission handling
let attempts = 0;

document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === sampleUsername && password === samplePassword) {
        alert("Login successful! Redirecting to products page...");
        window.location.href = "products.html"; // Redirect to products page
    } else {
        attempts++;
        document.getElementById('errorMessage').innerText = "Invalid username or password.";
        
        if (attempts >= 3) {
            alert("Too many failed attempts. Redirecting to error page...");
            window.location.href = "error.html"; // Create this page separately
            // Optionally disable the login form here
            document.getElementById('loginForm').querySelector('input[type="submit"]').disabled = true;
        }
    }
});

// Checkout functionality
document.getElementById('checkoutButton').addEventListener('click', function() {
    const selectedServices = document.querySelectorAll('.service-checkbox:checked');
    
    if (selectedServices.length === 0) {
        alert("Please select at least one service before checking out.");
        return; // Exit if no services are selected
    }
    
    let totalCost = 0;
    
    let invoiceDetails = 'Selected Services:\n';
    
    selectedServices.forEach(service => {
        const serviceCost = parseFloat(service.dataset.cost);
        totalCost += serviceCost;
        invoiceDetails += `- ${service.parentElement.querySelector('h3').innerText}: $${serviceCost.toFixed(2)}\n`;
        
        // Uncheck after adding to invoice
        service.checked = false; 
    });
    
    const tax = totalCost * 0.1; // Assuming a tax rate of 10%
    
    invoiceDetails += `Subtotal: $${totalCost.toFixed(2)}\n`;
    invoiceDetails += `Tax (10%): $${tax.toFixed(2)}\n`;
    
    const totalAmount = totalCost + tax;
    
    invoiceDetails += `Total Amount Due: $${totalAmount.toFixed(2)}`;
    
   // Store invoice data in local storage to retrieve on the invoice page
   localStorage.setItem('invoiceData', JSON.stringify({
       date: new Date().toLocaleDateString(),
       services: Array.from(selectedServices).map(service => ({
           name: service.parentElement.querySelector('h3').innerText,
           cost: parseFloat(service.dataset.cost)
       })),
       subtotal: totalCost,
       tax,
       totalAmount // Ensure this is included
   }));
   
   // Redirect to the invoice page
   window.location.href = "invoice.html";
});

// Load invoice data on the invoice page
window.onload = function() {
   const invoiceData = JSON.parse(localStorage.getItem('invoiceData'));
   
   if (invoiceData) {
       let invoiceHTML = `<h3>Invoice Date: ${invoiceData.date}</h3>`;
       invoiceHTML += `<h4>Selected Services:</h4><ul>`;
       
       invoiceData.services.forEach(service => {
           invoiceHTML += `<li>${service.name}: $${service.cost.toFixed(2)}</li>`;
       });
       
       const subtotal = invoiceData.subtotal.toFixed(2);
       const tax = invoiceData.tax.toFixed(2);
       const totalAmount = invoiceData.totalAmount.toFixed(2); // Ensure this is accessed correctly
       
       invoiceHTML += `</ul>`;
       invoiceHTML += `<p>Subtotal: $${subtotal}</p>`;
       invoiceHTML += `<p>Tax (10%): $${tax}</p>`;
       invoiceHTML += `<p>Total Amount Due: $${totalAmount}</p>`; // Displaying the total amount
       
       document.getElementById('invoiceDetails').innerHTML = invoiceHTML;

       // Clear local storage after displaying the invoice
       localStorage.removeItem('invoiceData');
   } else {
       document.getElementById('invoiceDetails').innerText = "No invoice data available.";
   }
};