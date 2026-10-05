const API = "http://localhost:3000/api";


// LOGIN

document.getElementById("loginForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;


    const res = await fetch(API + "/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })

    });

    const data = await res.json();


    if (res.ok) {

        localStorage.setItem(
            "interiorUser",
            JSON.stringify(data.user)
        );

        window.location.href = "index.html";

    } else {

        document.getElementById("loginMessage")
            .textContent = data.message;

    }

});


// SIGNUP

document.getElementById("signupForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const name =
        document.getElementById("signupName").value;

    const email =
        document.getElementById("signupEmail").value;

    const password =
        document.getElementById("signupPassword").value;


    const res = await fetch(API + "/signup", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            email,
            password
        })

    });

    const data = await res.json();

    document.getElementById("signupMessage")
        .textContent = data.message;

});


// SHOW SIGNUP

function showSignup() {

    document.getElementById("loginBox")
        .classList.add("hidden");

    document.getElementById("signupBox")
        .classList.remove("hidden");

}


// SHOW LOGIN

function showLogin() {

    document.getElementById("signupBox")
        .classList.add("hidden");

    document.getElementById("loginBox")
        .classList.remove("hidden");

}