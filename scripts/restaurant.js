import "./restaurant-nav.js";
import "./footer.js";
import "./animation.js";
import { restaurantAddressInfo } from "./restaurent-orders.js";
import { loadRestaurantAddressAndUpdateInfo } from "./restaurent-address-info.js";
import { renderOverview } from "./restaurent-overview.js";
import { loadAddFoodSection } from "./restaurant-addfood.js";
import { renderMenuPage } from "./restaurant-menu.js";

document.getElementById("overview").classList.add("active");
renderOverview();

document.getElementById("overview").addEventListener('click', () => {
    document.getElementById("overview").classList.add("active");
    renderOverview();
    document.getElementById("addressAndInfo").classList.remove("active");
    document.getElementById("orders").classList.remove("active");
    document.getElementById("addfoodsection").classList.remove("active");
    document.getElementById("ourmenu").classList.remove("active");
});

document.getElementById("addressAndInfo").addEventListener('click', () => {
    document.getElementById("addressAndInfo").classList.add("active");
    loadRestaurantAddressAndUpdateInfo();
    document.getElementById("overview").classList.remove("active");
    document.getElementById("orders").classList.remove("active");
    document.getElementById("addfoodsection").classList.remove("active");
    document.getElementById("ourmenu").classList.remove("active");
});

document.getElementById("orders").addEventListener('click', () => {
    document.getElementById("orders").classList.add("active");
    restaurantAddressInfo();
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href.includes("restaurant-overview.css")) link.remove();
    });
    document.getElementById("addressAndInfo").classList.remove("active");
    document.getElementById("overview").classList.remove("active");
    document.getElementById("addfoodsection").classList.remove("active");
    document.getElementById("ourmenu").classList.remove("active");
})

document.getElementById("addfoodsection").addEventListener('click', () => {
    document.getElementById("addfoodsection").classList.add("active");
    loadAddFoodSection();
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href.includes("restaurant-menu.css")) link.remove();
    });
    document.getElementById("addressAndInfo").classList.remove("active");
    document.getElementById("orders").classList.remove("active");
    document.getElementById("overview").classList.remove("active");
    document.getElementById("ourmenu").classList.remove("active");
});

document.getElementById("ourmenu").addEventListener('click', () => {
    document.getElementById("ourmenu").classList.add("active");
    renderMenuPage();
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href.includes("restaurent-addfood.css")) link.remove();
    });
    document.getElementById("addressAndInfo").classList.remove("active");
    document.getElementById("orders").classList.remove("active");
    document.getElementById("addfoodsection").classList.remove("active");
    document.getElementById("overview").classList.remove("active");
});

export function loadRestaurantIdAndInfo(data) {
    try {
        console.log(data);
        document.querySelector(".restaurant-image-container").innerHTML = data.image === null ? `<img  class="restaurant-images" src="./assets/restaurant2.jpg" alt="">` : ` <img  class="restaurant-images" src="${data.image}" alt="">`;
        document.querySelector(".restaurant-id").innerHTML = data.restaurantId;
        document.querySelector(".status").innerHTML = data.isActive ? "Available" : "Closed";
        document.querySelector(".ratings").innerHTML = data.rating;
    } catch (error) {
        console.warn("not for mobile");
    }
}

export function extractRestaurantId(){
    return document.querySelector(".restaurant-id").innerHTML;
}


