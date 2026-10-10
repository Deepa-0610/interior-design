const API = "https://interior-design-at73.onrender.com/api";


// ================= LOGIN =================

document.getElementById("loginForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;


    try {

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

    } catch (error) {

        document.getElementById("loginMessage")
            .textContent = "Server not connected.";

    }

});


// ================= SIGNUP =================

document.getElementById("signupForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const name =
        document.getElementById("signupName").value;

    const email =
        document.getElementById("signupEmail").value;

    const password =
        document.getElementById("signupPassword").value;


    try {

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


        if (res.ok) {

            document.getElementById("signupForm").reset();

            setTimeout(showLogin, 1500);

        }

    } catch (error) {

        document.getElementById("signupMessage")
            .textContent = "Server not connected.";

    }

});


// ================= SHOW SIGNUP =================

function showSignup() {

    document.getElementById("loginBox")
        .classList.add("hidden");

    document.getElementById("signupBox")
        .classList.remove("hidden");

    document.getElementById("signupBox")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================= SHOW LOGIN =================

function showLogin() {

    document.getElementById("signupBox")
        .classList.add("hidden");

    document.getElementById("loginBox")
        .classList.remove("hidden");

    document.getElementById("loginBox")
        .scrollIntoView({
            behavior: "smooth"
        });

}
