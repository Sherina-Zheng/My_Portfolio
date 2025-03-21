// ======================
//  MUSHROOM API
// ======================
// Mushroom API Configuration
const MUSHROOM_CONFIG = {
    apiKey: 'vzXE1CVyQCHmxiv8haid9rRnP5Kz5MoycrcJgRxrFQbJHQift0', // Get from Kindwise dashboard
    endpoint: 'https://api.plant.id/v3/identification', // Updated endpoint
    details: 'common_names,description,edibility,habitat',
    language: 'en'
  };
  
  // Initialize Event Listeners
  document.addEventListener('DOMContentLoaded', function() {
    const mushroomBtn = document.getElementById('mushroom-btn');
    
    if (mushroomBtn) {
      mushroomBtn.addEventListener('click', uploadAndIdentifyMushroomID);
    } else {
      console.error('Mushroom button not found');
    }
  });
  
  // Mushroom Identification Handler
  async function uploadAndIdentifyMushroomID() {
    const photoInput = document.getElementById('photoInput');
    const statusDiv = document.getElementById('api-status');
    
    if (!photoInput.files.length) {
      showStatus('Please select a mushroom photo first!', 'warning');
      return;
    }
  
    try {
      showStatus('Analyzing mushroom...', 'info');
      
      const imageBase64 = await readFileAsBase64(photoInput.files[0]);
      const response = await axios.post(
        MUSHROOM_CONFIG.endpoint,
        {
          images: [imageBase64],
          similar_images: true,
          details: MUSHROOM_CONFIG.details,
          language: MUSHROOM_CONFIG.language
        },
        {
          headers: {
            "Api-Key": MUSHROOM_CONFIG.apiKey,
            "Content-Type": "application/json"
          }
        }
      );
  
      handleMushroomResponse(response.data);
      showStatus('Identification complete!', 'success');
  
    } catch (error) {
      console.error('API Error:', error);
      showStatus(`Error: ${error.response?.data?.message || 'Identification failed'}`, 'danger');
    }
  }
  
  // Helper Functions
  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Remove data URL prefix
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  function handleMushroomResponse(data) {
    const result = data.result.classification.suggestions[0];
    
    // Update DOM elements
    document.getElementById('mushroom-name-container').textContent = result.name;
    document.getElementById('probability-container').textContent = `${result.probability}% confidence`;
    document.getElementById('common-name-container').textContent = result.details.common_names?.join(', ') || 'Unknown';
    document.getElementById('description-container').textContent = result.details.description?.value || 'No description available';
    
    // Handle edibility
    const edibilityHTML = result.details.edibility 
      ? `<span class="edibility ${result.details.edibility.toLowerCase()}">${result.details.edibility}</span>`
      : 'Unknown';
    document.getElementById('mushroom-health-status-container').innerHTML = edibilityHTML;
  }
  
  function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('api-status');
    const statusMessage = document.getElementById('api-status-message');
  
    // Set message and alert type
    statusMessage.textContent = message;
    statusDiv.className = `alert alert-${type} alert-dismissible fade show`;
  
    // Show the status div
    statusDiv.style.display = 'block';
  
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusDiv.classList.remove('show');
      statusDiv.classList.add('fade');
      setTimeout(() => statusDiv.style.display = 'none', 300); // Wait for fade-out
    }, 5000);
  }
// document.addEventListener("DOMContentLoaded", function() {
//     const mushroomBtn = document.getElementById("mushroom-btn");
//     if (mushroomBtn) {
//         mushroomBtn.addEventListener('click', uploadAndIdentifyMushroomID);
//       } else {
//         console.error('Mushroom button not found');
//     }
// });

// function uploadAndIdentifyMushroomID() {
//     console.log("Mushroom API function called");
//     const photoInput = document.getElementById('photoInput');

//     if (photoInput.files.length === 0) {
//         alert("Please select your photo to identify.");
//         return;
//     }

//     const selectedFile = photoInput.files[0];
//     readFileAsBase64(selectedFile, function (base64Image) {
//         const apiKey = '25PFDaIDBNGvl4Q1YL0ICXj7pGYMwjvxdQtqwrblC82revCaaA';
//         const apiUrl = 'https://api.plant.id/v3/identification'; 

//         axios.post(apiUrl, {
//             "images": [base64Image],
//             "similar_images": true,
//             "details": "common_names,description" // Add mushroom-specific details
//         }, {
//             headers: {
//                 "Api-Key": apiKey,
//                 "Content-Type": "application/json"
//             }
//         })
//         .then(function (response) {
//             console.log('Response from Mushroom API:', response.data);
//             displayMushroomInfo(response.data, base64Image);
//         })
//         .catch(function (error) {
//             if (error.response) {
//                 alert(`Error: ${error.response.data.message || error.response.statusText}`);
//             } else if (error.request) {
//                 alert("No response received from the server. Please check your connection.");
//             } else {
//                 console.error('Error:', error);
//             }
//         }); 
//     }); 
// }

// function displayMushroomInfo(apiResponse, base64Image) {
//     // Update ALL mushroom-specific IDs:
//     const isMushroom = document.getElementById('isMushroom-container');
//     const healthStatus = document.getElementById('mushroom-health-status-container');
//     // In displayMushroomInfo()
//     const suggestion = apiResponse.result.classification.suggestions[0];
//     nameContainer.innerHTML = `<strong>Name:</strong> ${suggestion.name}`;
//     probabilityContainer.innerHTML = `<strong>Probability:</strong> ${suggestion.probability}%`;

//     // Add mushroom-specific fields:
//     const isMushroomContainer = document.getElementById('isMushroom-container');
//     isMushroomContainer.innerHTML = `<strong>Is Mushroom:</strong> ${apiResponse.result.is_mushroom}`; // Hypothetical field

// }
