const form = document.getElementById("loginForm");


// To submit the login form
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // To get the email and password entered by the user
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // To put the email and password together
    const info = {
        email: email,
        password: password
    };


    try {

        // To send the login information to the API
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
        });


        // If the login is correct
        //save the token and go back to the home page
        if (response.ok) {

            const data = await response.json();

            localStorage.setItem("token", data.token);
            window.location.href = "index.html";

        } else {

            alert("E-mail ou mot de passe incorrect");
        }

    } catch (error) {

        // to let me know ifthere is a problem with my connection
        console.error("Erreur :", error);
        alert("Une erreur est survenue.");
    }
});