// ======================
//  INSECT API
// ======================
function uploadAndIdentifyInsectID() {
    console.log("Insect API function called");
    const photoInput = document.getElementById('photoInput');

    if (photoInput.files.length === 0) {
        alert("Please select your photo to identify.");
        return;
    }

    const selectedFile = photoInput.files[0];
    readFileAsBase64(selectedFile, function (base64Image) {
        const apiKey = 'Z8cB2d1XKPNQUMrBO0tkRalMZgqsZC1uJDzES3MH9TrsG8z5Up';
        const apiUrl = 'https://api.plant.id/v3/identification'; // Updated endpoint

        axios.post(apiUrl, {
            "images": [base64Image],
            "similar_images": true,
            "details": "common_names,description" // Add insect-specific details
        }, {
            headers: {
                "Api-Key": apiKey,
                "Content-Type": "application/json"
            }
        })
        .then(function (response) {
            console.log('Response from Insect API:', response.data);
            displayInsectInfo(response.data, base64Image);
        })
        .catch(function (error) {
            if (error.response) {
                alert(`Error: ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                alert("No response received from the server. Please check your connection.");
            } else {
                console.error('Error:', error);
            }
        }); // Fixed closing parentheses
    }); // Added missing closing parenthesis
}

function displayInsectInfo(apiResponse, base64Image) {
    // Update IDs to match insect HTML
    const previewImage = document.getElementById('previewImage');
    const nameContainer = document.getElementById('insect-name-container');
    const probabilityContainer = document.getElementById('probability-container');

    if (previewImage && nameContainer && probabilityContainer) {
        previewImage.src = base64Image;
        nameContainer.innerHTML = `<strong>Name:</strong> ${apiResponse.result.classification.suggestions[0].name}`;
        probabilityContainer.innerHTML = `<strong>Probability:</strong> ${apiResponse.result.classification.suggestions[0].probability}%`;
    } else {
        console.error("One or more DOM elements not found!");
    }
}

// Event Listeners 
document.getElementById("mushroom-btn").addEventListener("click", uploadAndIdentifyMushroomID);
document.getElementById("insect-btn").addEventListener("click", uploadAndIdentifyInsectID);
