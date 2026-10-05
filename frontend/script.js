const API = "http://localhost:3000/api";

const user = JSON.parse(localStorage.getItem("interiorUser"));

if (!user) {
    window.location.href = "login.html";
}


//  FURNITURE  

const furniture = {

    "Bedroom": [
        ["Bed", 15000, "🛏️"],
        ["Wardrobe", 12000, "🚪"],
        ["Side Table", 3000, "🪑"],
        ["Dressing Table", 8000, "🪞"],
        ["Study Table", 6000, "🖥️"],
        ["Chair", 2500, "💺"]
    ],

    "Living Room": [
        ["Sofa", 25000, "🛋️"],
        ["TV Unit", 12000, "📺"],
        ["Coffee Table", 5000, "🪑"],
        ["Bookshelf", 7000, "📚"],
        ["Arm Chair", 6000, "💺"],
        ["Floor Lamp", 2500, "💡"]
    ],

    "Kitchen": [
        ["Kitchen Cabinet", 20000, "🗄️"],
        ["Refrigerator", 30000, "🧊"],
        ["Dining Table", 15000, "🍽️"],
        ["Kitchen Island", 18000, "🏝️"],
        ["Microwave", 8000, "📦"],
        ["Chair", 2500, "💺"]
    ],

    "Bathroom": [
        ["Wash Basin", 7000, "🚰"],
        ["Mirror", 3000, "🪞"],
        ["Shower", 6000, "🚿"],
        ["Bathtub", 25000, "🛁"],
        ["Bathroom Cabinet", 8000, "🗄️"],
        ["Toilet", 7000, "🚽"]
    ],

    "Dining Room": [
        ["Dining Table", 15000, "🍽️"],
        ["Dining Chair", 2500, "💺"],
        ["Cabinet", 9000, "🗄️"],
        ["Sideboard", 10000, "🪑"],
        ["Pendant Light", 4000, "💡"]
    ],

    "Study Room": [
        ["Study Table", 6000, "🖥️"],
        ["Office Chair", 5000, "💺"],
        ["Bookshelf", 7000, "📚"],
        ["Desk Lamp", 2000, "💡"],
        ["Cabinet", 8000, "🗄️"]
    ]

};


let selected = [];


//  LOAD FURNITURE  

function updateFurniture() {

    const room = document.getElementById("room").value;
    const select = document.getElementById("furniture");

    select.innerHTML = "";

    furniture[room].forEach(item => {

        const option = document.createElement("option");

        option.value = item[0];
        option.textContent =
            `${item[2]} ${item[0]} - ₹${item[1].toLocaleString()}`;

        select.appendChild(option);

    });

}


//  ADD FURNITURE  

function addFurniture() {

    const room = document.getElementById("room").value;
    const name = document.getElementById("furniture").value;
    const quantity =
        Number(document.getElementById("quantity").value);

    const item = furniture[room].find(x => x[0] === name);

    if (!item) return;

    const existing = selected.find(x => x.name === name);

    if (existing) {
        existing.quantity += quantity;
    } else {
        selected.push({
            name: item[0],
            price: item[1],
            icon: item[2],
            quantity: quantity
        });
    }

    showFurniture();

}


//  DISPLAY FURNITURE  

function showFurniture() {

    const list = document.getElementById("furnitureList");

    if (selected.length === 0) {
        list.innerHTML =
            `<p class="empty-message">No furniture added yet.</p>`;
        updateTotal();
        return;
    }

    list.innerHTML = selected.map((item, index) => {

        const total = item.price * item.quantity;

        return `
            <div class="furniture-item">

                <div class="furniture-info">

                    <div class="furniture-icon">
                        ${item.icon}
                    </div>

                    <div>
                        <div class="furniture-name">
                            ${item.name} × ${item.quantity}
                        </div>

                        <div class="furniture-price">
                            ₹${total.toLocaleString()}
                        </div>
                    </div>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFurniture(${index})">
                    ×
                </button>

            </div>
        `;

    }).join("");

    updateTotal();

}


//  REMOVE FURNITURE  

function removeFurniture(index) {

    selected.splice(index, 1);

    showFurniture();

}


//  ROOM  

function updateRoom() {

    document.getElementById("currentRoom").textContent =
        document.getElementById("room").value;

    document.getElementById("currentStyle").textContent =
        document.getElementById("style").value;

    updateFurniture();

}


function updateBudget() {

    const budget =
        Number(document.getElementById("budget").value) || 0;

    document.getElementById("budgetAmount").textContent =
        "₹" + budget.toLocaleString();

    updateTotal();

}


function updateTotal() {

    const total = selected.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const budget =
        Number(document.getElementById("budget").value) || 0;

    const remaining = budget - total;

    document.getElementById("totalAmount").textContent =
        "₹" + total.toLocaleString();

    document.getElementById("remainingAmount").textContent =
        "₹" + remaining.toLocaleString();

}


//  NEW ROOM  

function newRoom() {

    selected = [];

    document.getElementById("budget").value = "";

    document.getElementById("room").selectedIndex = 0;

    document.getElementById("style").selectedIndex = 0;

    document.getElementById("currentRoom").textContent =
        "Bedroom";

    document.getElementById("currentStyle").textContent =
        "Modern";

    document.getElementById("budgetAmount").textContent = "₹0";
    document.getElementById("totalAmount").textContent = "₹0";
    document.getElementById("remainingAmount").textContent = "₹0";

    updateFurniture();
    showFurniture();

}


//  SAVE DESIGN  

async function saveDesign() {

    const room = document.getElementById("room").value;
    const style = document.getElementById("style").value;
    const budget =
        Number(document.getElementById("budget").value);

    if (!budget || selected.length === 0) {
        alert("Please enter budget and add furniture.");
        return;
    }

    const design = {

        userId: user.id,

        room: room,

        style: style,

        budget: budget,

        furniture: selected

    };


    try {

        const res = await fetch(API + "/designs", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(design)

        });

        const data = await res.json();

        alert(data.message);

        if (res.ok) {
            newRoom();
            showDesigns();
        }

    } catch (error) {

        alert("Server not connected.");

    }

}


//  MY DESIGNS  

async function showDesigns() {

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("viewPage")
        .classList.add("hidden");

    document.getElementById("myDesignsPage")
        .classList.remove("hidden");


    const list = document.getElementById("designList");

    list.innerHTML = "<p>Loading designs...</p>";


    try {

        const res = await fetch(
            API + "/designs?userId=" + user.id
        );

        const designs = await res.json();

        if (designs.length === 0) {
            list.innerHTML =
                "<p>No saved designs yet.</p>";
            return;
        }


        list.innerHTML = designs.map(design => {

            const total = design.furniture.reduce(
                (sum, item) =>
                    sum + item.price * item.quantity,
                0
            );

            return `
                <div class="design-card">

                    <h3>${design.room}</h3>

                    <p>Style: ${design.style}</p>

                    <p>Budget:
                        ₹${design.budget.toLocaleString()}
                    </p>

                    <p>Total:
                        ₹${total.toLocaleString()}
                    </p>

                    <div class="design-actions">

                        <button
                            class="view-btn"
                            onclick="viewDesign('${design._id}')">
                            View
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteDesign('${design._id}')">
                            Delete
                        </button>

                    </div>

                </div>
            `;

        }).join("");


    } catch (error) {

        list.innerHTML =
            "<p>Could not load designs.</p>";

    }

}


//  VIEW DESIGN  

async function viewDesign(id) {

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("myDesignsPage")
        .classList.add("hidden");

    document.getElementById("viewPage")
        .classList.remove("hidden");


    const box = document.getElementById("viewDesign");

    box.innerHTML = "<p>Loading...</p>";


    try {

        const res = await fetch(
            API + "/designs/" + id +
            "?userId=" + user.id
        );

        const design = await res.json();

        if (!res.ok) {
            box.innerHTML = "<p>Design not found.</p>";
            return;
        }


        const total = design.furniture.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


        box.innerHTML = `

            <h1>${design.room}</h1>

            <p>Style: ${design.style}</p>

            <p>Budget:
                ₹${design.budget.toLocaleString()}
            </p>

            <div class="view-furniture">

                <h2>Furniture</h2>

                ${design.furniture.map(item => `
                    <div class="view-furniture-item">
                        ${item.icon || "🪑"}
                        ${item.name}
                        × ${item.quantity}
                        - ₹${(
                            item.price * item.quantity
                        ).toLocaleString()}
                    </div>
                `).join("")}

            </div>

            <div class="budget-section">

                <div>
                    <span>Total Cost</span>
                    <strong>
                        ₹${total.toLocaleString()}
                    </strong>
                </div>

                <div>
                    <span>Remaining</span>
                    <strong>
                        ₹${(
                            design.budget - total
                        ).toLocaleString()}
                    </strong>
                </div>

            </div>
        `;


    } catch (error) {

        box.innerHTML =
            "<p>Could not load design.</p>";

    }

}


//  DELETE  

async function deleteDesign(id) {

    if (!confirm("Delete this design?")) return;


    try {

        const res = await fetch(
            API + "/designs/" + id +
            "?userId=" + user.id,
            {
                method: "DELETE"
            }
        );

        const data = await res.json();

        alert(data.message);

        if (res.ok) {
            showDesigns();
        }

    } catch (error) {

        alert("Could not delete design.");

    }

}


//  PAGE NAVIGATION  

function showHome() {

    document.getElementById("homePage")
        .classList.remove("hidden");

    document.getElementById("myDesignsPage")
        .classList.add("hidden");

    document.getElementById("viewPage")
        .classList.add("hidden");

}


function logout() {

    localStorage.removeItem("interiorUser");

    window.location.href = "login.html";

}


//  START  

updateFurniture();
updateBudget();