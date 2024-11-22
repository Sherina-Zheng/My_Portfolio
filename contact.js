emailjs.init('V8dFJyPyys7mOb2so'); 

{/* document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    emailjs.sendForm('service_nout6ds', 'template_l4hf8qr', this)
        .then(function(response) {
            alert('Message sent successfully!');
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            alert('Failed to send message. Please try again.');
            console.log('FAILED...', error);
        });
}); */}

document.getElementById("email-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const serviceID = "service_juokusa";
    const templateID = "template_gqhd6dq";

    // Send email using EmailJS
    emailjs.sendForm(serviceID, templateID, this)
        .then((response) => {
            console.log("SUCCESS!", response.status, response.text);
            alert("Message sent successfully!");
        })
        .catch((error) => {
            console.error("FAILED...", error);
            alert("Message failed to send. Please try again.");
        });
});

