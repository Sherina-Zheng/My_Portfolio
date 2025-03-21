// ======================
//  SHARED HELPER FUNCTION
// ======================
function readFileAsBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

// ======================
//  PLANT HEALTH API
// ======================
function uploadAndIdentifyPlantID(){
    console.log("Plant Health API function called");
    // Retreive the photo from the frontend.
    const photoInput = document.getElementById('photoInput');
   
    // If no photoes are selected, this alerts users to upload a photo.
    if(photoInput.files.length === 0){
        alert("Please select your photo to identify.");
        return;
    }

    // Select the first file from the files array of an input element.
    const selectedFile = photoInput.files[0];

    // Create a new file reader object so that we can read the contents of the file.
    const reader = new FileReader ();

    // Set up the event handler for the onload for the file reader object.
    // The onload event is triggered when the reading operation of the fileis completed.
    reader.onload = function (e) {

        // Store the base64Image in a variable
        const base64Image = e.target.result;
        console.log('base64Image',base64Image);

        // Store all the variables for the API call
        const apiKey = 'vzXE1CVyQCHmxiv8haid9rRnP5Kz5MoycrcJgRxrFQbJHQift0';
        const latitude = 49.207;
        const longitude = 16.608;
        const health = 'all';
        const similarImages = true;
        const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods,treatment,cause'
        const language = 'en'
        const apiUrlPlantID = `https://plant.id/api/v3/identification?details=${details}&language=${language}`;
       
        // Making the first API call with the base64 image
        axios.post(apiUrlPlantID, {
            "images":[base64Image],
            "latitude": latitude,
            "longitude": longitude,
            "health": health,
            "similar_images": similarImages
        },{
            headers:{
                "Api-Key": apiKey,
                "Content-Type": "application/json"
            }
        })
    // This is the pending state of the promise
    .then(function(response) {
        console.log('Response from Plant ID API',response.data);
        displayPlantIDInfo(response.data, base64Image);
    })
    // Error state of promise
    .catch(function(error) {
        alert(`Error: ${error.response.data} ❌❌❌`);
        console.error('Error:',error);
    });
};

// Read the selected file as a data URL which is a base64 encoded representation of the file's content.
reader.readAsDataURL(selectedFile);
    }
function displayPlantIDInfo(plantIdResponse,base64Image){
    // ========================================
    //  VARIABLE TO STORE THE FIRST SUGGESTION
    // ========================================
    const plantIdClassification =plantIdResponse.result.classification;
    const plantIdDisease = plantIdResponse.result.disease;
    const plantIdIsHealthy = plantIdResponse.result.is_healthy;
    const plantIdIsPlant = plantIdResponse.result.is_plant;

    // =======================
    //   PLANT REVIEW IMAGE
    // =======================
    // Grab the preview image element from the front plantidentifier.html
    const previewImage = document.getElementById('previewImage')
    // Set the image HTML src attribute to the preview image we uploaded on the plantidentifier.html file
    previewImage.src = base64Image


    // ==============
    //   PLANT NAME
    // ==============
    // GRAB the HTML for the plant title container.
    const plantNameContainer = document.getElementById('plant-name-container');
    // Create a new <p> tag element for the plant title.
    const plantNameElement = document.createElement('p');
    // Add the name of the plant to the innerHTML of the <p> tag we created.
    plantNameElement.innerHTML = `<strong> Name: </strong> ${plantIdClassification.suggestions[0].name}`;
    // Append the new divwe created to the api result container that we grabbed from our html.
    plantNameContainer.appendChild(plantNameElement);


    // =================
    //   SIMILAR IMAGE
    // =================
    // Grab the similar image from the API response.
    const plantSimilarImage = plantIdClassification.suggestions[0].similar_images[0].url;
    // Grab the HTML where the image will be placed.
    const similarImageHTML = document.getElementById('plant-similar-image');
    // Set the image HTML src attribute to the image.
    similarImageHTML.src = plantSimilarImage;


    // =================
    //   PROBABILITY
    // =================
    // Grab the probability score from the API response.
    const probabilityOfPlant = plantIdClassification.suggestions[0].probability;
    // Grab the HTML where the probability is going to be placed.
    const probabilityNameContainer = document.getElementById('probability-container');
    // Create a new <p> tag element for the probability text.
    const probabilityNameElement = document.createElement('p');
    // Add the probability text to the innerHTML of the new <p> tag created.
    probabilityNameElement.innerHTML = `<strong> Probability: </strong> ${probabilityOfPlant}`;
    // Append the new div we created to the probabilityNameContainer we grabbed from our html.
    probabilityNameContainer.appendChild(probabilityNameElement);


    // =================
    //   IS PLANT
    // =================
    // Grab the 'is plant' boolean value from the API response.
    const isPlant = plantIdIsPlant.binary;
    // Grab the HTML where the plant boolean will be placed.
    const isPlantContainer = document.getElementById('isPlant-container');
    // Create a new <p> tag element for the is_plant boolean.
    const isPlantElement = document.createElement('p');
    // Check if the image submitted is a plant, if not, alert the user.
    if (isPlant === false){
        alert('The picture submitted is not a plant. ❌❌❌ Please give it another try.');
        window.location.reload();
    }
    // Add the boolean text to the innerHTML of the new <p> tag we created.
    isPlantElement.innerHTML = `<strong>Is Plant:</strong>${isPlant}`;
    // Append the new div we created to the isPlantContainer we created.
    isPlantContainer.appendChild(isPlantElement);


    // =================
    //   COMMON NAME
    // =================
    // Grab the first common name from the API response.
    const commonName = plantIdClassification.suggestions[0].details.common_names[0];
    // Grab the HTML where the common name will be placed.
    const commonNameContainer = document.getElementById('common-name-container');
    // Create a new <p> tag element for the common name text.
    const commonNameElement = document.createElement('p');
    // Add the common name text to the inner HTML of the new <p> tag we created.
    commonNameElement.innerHTML = `<strong>Common Name:</strong> ${commonName}`;
    // Append the new div we created to the comonNameContainer we created.
    commonNameContainer.appendChild(commonNameElement);


    // =================
    //   DESCRIPTION
    // =================
    // Grab value from API response.
    const plantDescription = plantIdClassification.suggestions[0].details.description.value;
    // Grab container from front end.
    const descriptionContainer = document.getElementById('description-container');
    // Create a new <p> tag element for the description text.
    const descriptionElement = document.createElement('p');
    // Add the description text to the inner HTML of the new <p> tag we created.
    descriptionElement.innerHTML = `<strong>Description:</strong> ${plantDescription}`;
    // Append the new div we created to the container we grabbed from the HTML.
    descriptionContainer.appendChild(descriptionElement);


    // =======================
    //   PLANT HEALTH STATUS
    // =======================
    // Grab value from API response.
    const plantHealthStatus = plantIdIsHealthy.binary;
    // Grab container from front end.
    const plantHealthStatusContainer = document.getElementById('plant-health-status-container');
    // Create a new <p> tag element for the plantHealthStatus text.
    const plantHealthStatusElement = document.createElement('p');
    // Add the text to the inner HTML of the new <p> tag we created.
    plantHealthStatusElement.innerHTML = `<strong>Is Plant Healthy:</strong> ${plantHealthStatus}`;
    // Append the new div we created to the container we grabbed from the HTML.
    plantHealthStatusContainer.appendChild(plantHealthStatusElement);
 

    // =============================
    //   SIMILAR IMAGE WITH DISEASE
    // =============================
    // Grab the similar image from API response.
    const plantSimilarImageWithDisease = plantIdDisease.suggestions[0].similar_images[0].url;
    // Grab the HTML where image will be placed.
    const similarImageWithDiseaseHTML = document.getElementById('plant-similar-image-with-disease');
    // Set the image HTML src attribute to the image
    similarImageWithDiseaseHTML.src = plantSimilarImageWithDisease;


    // ======================================
    // DISEASE NAME
    // ======================================
    //Grab value from API Response
    const plantDiseaseName = plantIdDisease.suggestions[0].name;
    //Grab container from front end
    const plantDiseaseNameContainer = document.getElementById('plant-disease-name-container');
    //create a new p tag element
    const plantDiseaseNameElement = document.createElement('p');
    //add the text to the inner html of the new p tag we created
    plantDiseaseNameElement.innerHTML = `<strong> Disease: </strong> ${plantDiseaseName}`;
    //append the new div we created to the container we grabbed from our html
    plantDiseaseNameContainer.appendChild(plantDiseaseNameElement);

   
    // ======================================
    //  DISEASE PROBABILITY
    // ======================================
    // Grab value from API response
    const plantDiseaseProbability = plantIdDisease.suggestions[0].probability;
    // Grab container from the front end HTML
    const plantDiseaseProbabilityContainer = document.getElementById('plant-disease-probability');
    // create a new <p> tag element
    const plantDiseaseProbabilityElement = document.createElement('p');
    // add text to the innerHTML of the new <p> tag we created
    plantDiseaseProbabilityElement.innerHTML = `<strong>Disease Probability:</strong> ${plantDiseaseProbability}`;
    // append the new div we created to the container we grabed from our html
    plantDiseaseProbabilityContainer.appendChild(plantDiseaseProbabilityElement);


    // ======================================
    //  DISEASE DESCRIPTION
    // ======================================
    // Grab value from API response
    const plantDiseaseDescription = plantIdDisease.suggestions[0].details.description;
    // Grab container from the front end HTML
    const plantDiseaseDescriptionContainer = document.getElementById('plant-disease-description');
    // create a new <p> tag element
    const plantDiseaseDescriptionElement = document.createElement('p');
    // add text to the innerHTML of the new <p> tag we created
    plantDiseaseDescriptionElement.innerHTML = `<strong>Disease Description:</strong> ${plantDiseaseDescription}`;
    // append the new div we created to the container we grabed from our html
    plantDiseaseDescriptionContainer.appendChild(plantDiseaseDescriptionElement);


    // ======================================
    //  DISEASE TREATMENT [SAVE THE BEST FOR LAST USE A LOOP IN THE API FOR TREATMENTS]
    // ======================================
    // Grab value from API response
    const plantDiseaseTreatment = plantIdDisease.suggestions[0].details.treatment;
    // Grab container from the front end HTML
    const plantDiseaseTreatmentContainer = document.getElementById('plant-disease-treatment');
    // create a new <p> tag element
    const plantDiseaseTreatmentElement = document.createElement('p');

    // Do a check if the plant is dead and the object is empty we let the user know that there is no treatment avaiable for dead plants
    if (Object.keys(plantDiseaseTreatment).length === 0) {
        // add text to the innerHTML of the new <p> tag we created
        plantDiseaseTreatmentElement.innerHTML = `<strong>Disease Treatment:</strong> No treatment available`;
        // append the new div we created to the container we grabed from our html
        plantDiseaseTreatmentContainer.appendChild(plantDiseaseTreatmentElement);
    }
    // loop through the object and map keys to values
    // then attach them to the HTML container
    for (const key in plantDiseaseTreatment) {
        // if the object has a key value pair
        if (plantDiseaseTreatment.hasOwnProperty(key)) {
        // create a variable and store the value of each key on each iteration
        const plantDiseaseTreatmentValues = plantDiseaseTreatment[key].map(value => `<li>${value}</li>`).join('');
        // create a variable that mathces the key with the values and wrap them in HTML
        const plantDiseaseTreatmentText = `<strong>Disease Treatment ${key}:</strong> <ul>${plantDiseaseTreatmentValues}</ul>`;
        // append the text of the key value pairs into the HTML container
        plantDiseaseTreatmentContainer.innerHTML += plantDiseaseTreatmentText;
        }
    }
}




