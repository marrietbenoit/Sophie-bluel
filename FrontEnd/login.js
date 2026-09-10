


const form = document.getElementById("loginForm");


form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const info = {
        email: email,
        password: password
    };
   


    try {
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
        });

        if (response.ok) {
           
            const data = await response.json();

            localStorage.setItem("token", data.token);

            window.location.href = "index.html";
        
        } else {
            alert("E-mail ou mot de passe incorrect");
        }

    } catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
    }
});



