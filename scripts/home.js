import "./navbar.js"
import "./footer.js"
import "./animation.js";
import { parseJwt } from "./parseValue.js";
import API from "./end-point.js";
import { showNotification } from "./notification.js";
import "./search.js";


const { token } = parseJwt();
export const restaurantGrid = document.querySelector(".restaurant-grid");
export function loadRestaurants(info) {
    const restaurantHtml = `
        <a  href="menu.html?res=${info.restaurantId}" class="restaurant-card autoshow">
          <img
           src="${info.image===null? "./assets/restaurant2.jpg" : info.image}"
            alt="Restaurant-img">
          <div class="restaurant-info">
            <h3>${info.name===null ? "Yum Zoom Restaurant" : info.name}</h3>
            
            <div class="rating">
                <i class="fas fa-star"></i><span>${info.rating}</span>
            </div>
            <p>${info.cusineType  ? info.cusineType : "Any"}</p>
            <p>30-45 min • Free delivery</p>
          </div>
        </a>
    `
    restaurantGrid.innerHTML += restaurantHtml;
}


const loderHtml = `
<div class="loader-main">
<div class="loader"></div></div>
`
async function getAllRestaurant() {
restaurantGrid.innerHTML = loderHtml ;
    try {
        const response = await fetch(`${API}/get/eatinghouse`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        if (!response.ok && response.status === 403) {
            showNotification("server is under maintanace");
            window.location = "/";
            return;
        }

        return await response.json();
        l
    } catch (error) {
        console.warn("sumting happend");
    }
}


getAllRestaurant().then((listOfRestarant) => {
    restaurantGrid.innerHTML ="";
    listOfRestarant.forEach(info => {
        loadRestaurants(info);
    });
})







