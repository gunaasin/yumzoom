import API from "./end-point.js";
import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import { loadRestaurants, restaurantGrid } from "./home.js";

const searchInput = document.getElementById('search');
const suggestionsBox = document.getElementById('suggestions');

let typingTimer;
const delay = 500; // Adjust delay time (in milliseconds)
const { token } = parseJwt();

searchInput.addEventListener('input', () => {
    clearTimeout(typingTimer); // Reset the timer on every key press

    typingTimer = setTimeout(async () => {
        const query = searchInput.value.trim();
        if (query.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }
        const response = await fetch(`${API}/get/home/suggestions?keyword=${query}`, {
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
    if (e.key === "Enter") {
        getResaults(searchInput.value);
    }
});

async function getResaults(keyQuery) {
    try {
        const response = await fetch(`${API}/get/resultBySuggestion?keyword=${keyQuery}`, {
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
        if (result) {
            if (result[0].restaurantId) {
                restaurantGrid.innerHTML = "";
                result.forEach((item) => {
                    loadRestaurants(item);
                })
            } else if (result[0].category) {
                window.location = `/menu?f=${encodeURIComponent(btoa(JSON.stringify(result)))}`;
            }
        }

    } catch (error) {
        console.error("sumthing when wrong");
    }
}