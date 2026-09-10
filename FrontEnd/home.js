// To verify that "works" exist in localStorage

let allworks = JSON.parse(window.localStorage.getItem("allworks"));

if (!allworks) {
  getWorks();
} else {
  generateWorks(allworks);
}

// To fetch "works" from API and store in localStorage
async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    window.localStorage.setItem("allworks", JSON.stringify(works));
    allworks = works;
    generateWorks(works);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}

// Generate gallery works
function generateWorks(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;
    figure.appendChild(imageElement);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}

// Fetch and generate category filter buttons

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    window.localStorage.setItem("allbtn", JSON.stringify(categories));
    generateCategoryButtons(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
getCategories();
// Generate filter buttons and attach functionality 
function generateCategoryButtons(categories) {
     const filterSection = document.querySelector(".filtres");
      filterSection.innerHTML = "";

// Now crreat "tous btn"

      const btnTous = document.createElement("button"); 
      btnTous.classList.add("filter-btns", "tous-btn"); 
      btnTous.innerText = "Tous"; 
      btnTous.addEventListener("click", () => { setActiveButton(btnTous);
         generateWorks(allworks); 
        });

        filterSection.appendChild(btnTous); 
        setActiveButton(btnTous); 
        generateWorks(allworks);

        // Create buttons for categories
         categories.forEach((category) => { const btn = document.createElement("button");
             btn.classList.add("filter-btns");
              btn.innerText = category.name; 
              btn.addEventListener("click", () => { setActiveButton(btn);
                 const filteredWorks = allworks.filter( (work) => work.category?.name === category.name );

                generateWorks(filteredWorks); 
            });

            filterSection.appendChild(btn);
         });
         }

         // Set style for active buttons
       function setActiveButton(activeButton) {
    document.querySelectorAll(".filter-btns").forEach((btn) => {
        btn.classList.remove("active");
    });

    activeButton.classList.add("active");
}



                


