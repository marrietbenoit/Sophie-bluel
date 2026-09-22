const editBtn = document.getElementById("myBtn");

const closeBtn = document.getElementById("close");
const modal = document.getElementById("modal-container");


// To open modal when Modifier is clicked and view all existing works
editBtn.addEventListener("click", function (event) {
    event.preventDefault();

    modal.showModal();

    generateModalWorks(allworks);
});

function generateModalWorks(works) { 
    const modalGallery = document.querySelector(".modal-gallery"); 
    modalGallery.innerHTML = ""; 

    works.forEach((work) => {
        const figure = document.createElement("figure");
        const image = document.createElement("img"); 

        image.src = work.imageUrl;
        image.alt = work.title; 

        const deleteBtn = document.createElement("button"); 
        deleteBtn.classList.add("trash-box"); 

        const trashIcon = document.createElement("img"); 
        trashIcon.src = "./assets/icons/trash.svg"; 
        trashIcon.alt = "Supprimer"; 

        deleteBtn.appendChild(trashIcon); 
        figure.appendChild(image); 
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    }); 
}


// Close modal
closeBtn.addEventListener("click", function () {
    modal.close();
});


// Close modal when clicking outside
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.close();
    }
});


// Now to add photos from library ect...
const addPhotoBtn = document.getElementById("modal-btn");
const addModal = document.getElementById("addModal");

addPhotoBtn.addEventListener("click", function () {
    modal.close();
    addModal.showModal();
});


// Close add modal
const addCloseBtn = document.querySelector(".add-close");

addCloseBtn.addEventListener("click", function () {
    addModal.close();
});

addModal.addEventListener("click", function (event){
    if (event.target === addModal) {
        addModal.close();
    }
});
// Back to the first modal
const backBtn = document.querySelector(".back");

backBtn.addEventListener("click", function () {
    addModal.close();
    modal.showModal();
});


// to add chosen image to preview box
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");

fileInput.addEventListener("change", function () {

    const file = fileInput.files[0];

    if (file) {
        previewImage.src = URL.createObjectURL(file);
    }

});


// To get categories in dropdown (samme as for our projects btns)
const categorySelect = document.getElementById("category");

async function getModalCategories() {
    const response = await fetch("http://localhost:5678/api/categories");

    const categories = await response.json();

    console.log(categories);
    categories.forEach((category) => {

        const option = document.createElement("option");
        option.textContent = category.name;
        option.value = category.id;
        categorySelect.appendChild(option);

    });
}

getModalCategories();

// To add new photo to works
const addForm = document.querySelector("#addModal form");

addForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // get the info from our form
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const file = document.getElementById("fileInput").files[0];

    // To get the token saved when logging in (lets API know we logged in)
    const token = localStorage.getItem("token");

    // To create the info being sent to the API
    const formData = new FormData();

    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);


    try {

        //Now send the new photo to the API
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });


        // If the photo was added correctly
        //add the new photo to our list
        //close modal and update projects
       if (response.ok) {

    const newWork = await response.json();
    
    allworks.push(newWork);
    localStorage.setItem("allworks", JSON.stringify(allworks));
    generateWorks(allworks);
    addModal.close();
    modal.showModal();
    generateModalWorks(allworks);

    // Reset form andpreview image
    addForm.reset();
    previewImage.src = "./assets/icons/picture.png";

} else {

    alert("Une erreur est survenue lors de l'ajout de la photo.");
}

    } catch (error) {

        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
    }
});

//Now to