const editBtn = document.getElementById("myBtn");
 const modal = document.getElementById("modal-container"); 
 const addModal = document.getElementById("addModal");


 modal.addEventListener("command", function (event) {

    if (event.command === "--open-add-modal") {
        modal.close();
        addModal.showModal();
        event.stopPropagation();

    }

});
document.addEventListener("command", function (event) {

    if (event.command === "--back-to-gallery") {

        addModal.close();
        modal.showModal();

        generateModalWorks(allworks);

    }

});
// To open modal when Modifier is clicked and view all existing works
editBtn.addEventListener("click", function () {
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

// To be able to delete a project
        deleteBtn.appendChild(trashIcon); 
        deleteBtn.addEventListener("click", function () {
            deleteWork(work.id);
        });

        figure.appendChild(image); 
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    }); 
}

async function deleteWork(workId) {

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(
            `http://localhost:5678/api/works/${workId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (response.ok) {

            // Remove the work from our list
            // Update localStorage
            allworks = allworks.filter((work) => work.id !== workId);

            localStorage.setItem("allworks", JSON.stringify(allworks));
            generateWorks(allworks);
            generateModalWorks(allworks);

        } else {

            alert("Une erreur est survenue lors de la suppression.");
        }

    } catch (error) {

        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
    }
}


// Close modal when clicking outside
modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.close();
    }
});
//To go back when arrow and x is clicked
document.addEventListener("command", function (event) { 
    if (event.command === "--back-to-gallery") { 
        addModal.close();
         modal.showModal(); 
         generateModalWorks(allworks);
         } 
        });

        addModal.addEventListener("command", function (event) {
            
    if (event.command === "--back-to-gallery") {

        addModal.close();
        modal.showModal();
        generateModalWorks(allworks);

    }
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

        // Now send the new photo to the API
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        // If the photo was added correctly
        if (response.ok) {

            const newWork = await response.json();
            newWork.category = {
                id: category
            };
            allworks.push(newWork);

            localStorage.setItem("allworks", JSON.stringify(allworks));

            generateWorks(allworks);
            generateModalWorks(allworks);
            addForm.reset();
            previewImage.src = "./assets/icons/picture.png";
            addModal.close();
            modal.showModal();

        } else {

            alert("Une erreur est survenue lors de l'ajout de la photo.");
        }

    } catch (error) {

        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
    }
});


