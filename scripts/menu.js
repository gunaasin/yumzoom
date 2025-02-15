import "./navbar.js";
import "./footer.js";
import "./animation.js";
import { parseJwt } from "./parseValue.js";
import API from "./end-point.js";
import { showNotification } from "./notification.js";

const foodGrid = document.querySelector(".food-grid");
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("res");
const { token } = parseJwt();



function remderMenus(item) {
    const menuHtml = `
        <div class="food-card headline">
            <div class="food-info">
                <div class="food-info-container">
                    <div class="left-food-container">
                        <div class="food-header">
                            <div class="veg-indicator ${item.category === "Veg" ? "veg" : "non-veg"}"></div>
                            <h2 class="food-title">${item.itemName}</h2>
                        </div>
                        <p class="food-cuisine">${item.description}</p>
                        <div class="food-rating">
                            <span class="rating-badge">${item.rating} ★</span>
                            <span>${item.restaurantName ? item.restaurantName : "17 mins"}</span>
                        </div>
                        <div class="delivery-info">
                            <span class="price">₹ ${item.price} for one</span>
                        </div>

                        <div class="cart-add-section">
                            <button class="cart-button" data-id="${item.id}">
                                <span class="add">Add to cart</span>
                                <span class="added">Added</span>
                                <i class="fas fa-shopping-cart"></i>
                                <i class="fas fa-box"></i>
                            </button>
                        </div>
                    </div>
                    <div class="right-food-container">
                        <img src="${item.imagePath}" alt="${item.itemName}" class="food-image">
                    </div>
                </div>
            </div>
        </div>`;

    foodGrid.insertAdjacentHTML("beforeend", menuHtml);
    const newButton = foodGrid.querySelector(`.cart-button[data-id="${item.id}"]`);
    newButton.addEventListener('click', (event) => {
        event.currentTarget.classList.add('clicked');
        const itemId = event.currentTarget.getAttribute("data-id");
        console.log(itemId)
        addToCartFunction(itemId);

    });
}


async function addToCartFunction(id) {

    const addToCartProduct = {
        productId: id,
        token,
        quantity: 1
    }
    try {
        const response = await fetch(`${API}/customer/addtocart`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(addToCartProduct)
        })
        if (!response.ok) {
            showNotification("Sumthing when wrong");
            return;
        }
        const result = await response.json();
        showNotification(result.message);
    } catch (error) {
        console.error(error);
    }
}



async function loadAllFooditem(id) {
    try {
        const response = await fetch(`${API}/get/menus?restaurantId=${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            if (response.status === 403) {
                console.warn("Server is under maintenance");
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching food items:", error.message);
    }
}

const params = new URLSearchParams(window.location.search);
if (params.has("f")) {
    const items = JSON.parse(atob(decodeURIComponent(params.get('f'))));
    if (items) {
        items.forEach(remderMenus);
    }
} else {
    loadAllFooditem(id).then((items) => {
        if (items) {
            items.forEach(remderMenus);
        }
    });
}


// search only for food
const searchInput = document.getElementById('input');
const suggestionsBox = document.getElementById('suggestions');
let typingTimer;
const delay = 500; // Adjust delay time (in milliseconds)

searchInput.addEventListener('input', () => {
    clearTimeout(typingTimer); // Reset the timer on every key press
    typingTimer = setTimeout(async () => {
        const query = searchInput.value.trim();
        if (query.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        const response = await fetch(`${API}/get/menu/suggestions?keyword=${query}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const suggestions = await response.json();
        showSuggestions(suggestions);
    }, delay);
});

function showSuggestions(suggestions) {
    suggestionsBox.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }
    suggestions.forEach((item) => {
        const div = document.createElement('div');
        div.textContent = item;
        div.classList.add('suggestion-item');
        div.addEventListener('click', () => selectSuggestion(item));
        suggestionsBox.appendChild(div);
    });
    suggestionsBox.style.display = 'block';
}

function selectSuggestion(value) {
    searchInput.value = value;
    suggestionsBox.style.display = 'none';
    getResaults(value);
}

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && searchInput.value !== "") {
        suggestionsBox.style.display = 'none';
        getResaults(searchInput.value);
    }
});

const foodContainer = document.querySelector(".loding-space");

const loderHtml = `
<div class="loader-main">
<div class="loader"></div></div>
`

async function getResaults(keyQuery) {
    foodGrid.innerHTML = "";
    foodContainer.innerHTML = loderHtml;
    try {
        const response = await fetch(`${API}/get/menuBySuggestion?keyword=${keyQuery}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        if (!response.ok) {
            showNotification("sumthing when wrong");
            return;
        }
        let result = [];
        result = await response.json();
        searchInput.value = "";
        foodContainer.innerHTML = "";
        result.forEach(remderMenus);
    } catch (error) {
        console.error("sumthing when wrong");
    }
}