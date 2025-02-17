import "./delivery-agent-nav.js";
import "./footer.js";
import { parseJwt } from "./parseValue.js";
import API, { W_API } from "./end-point.js";
import { showNotification } from "./notification.js";



document.addEventListener('DOMContentLoaded', () => {
    const orderContainer = document.querySelector(".delivery");
    const statusInfo = document.querySelector('.sidebar__status');
    const sidebarName = document.querySelector('.sidebar__name');
    const img = document.querySelector(".sidebar__profile-img");
    const header = document.querySelector('.header');


    function renderCurrentOrder(object){
        const orderHtml = `
        <h2 class="delivery__title">Current Delivery</h2>
        <div class="delivery__card">
            <div class="delivery__header">
                <span class="delivery__order-id">#${object.orderId}</span>
                <span class="delivery__status delivery__status--in-progress">${object.status ==="OUT_FOR_DELIVERY" ? "In Progress":"Delivered" }</span>
            </div>
            <div class="delivery__locations">
                <div class="delivery__location">
                    <i class="fas fa-store"></i>
                    <div class="delivery__location-details">
                    <h4>Pickup Location</h4>
                    <p>${object.pickupLocation}</p>
                </div>
            </div>
            <div class="delivery__location">
                <i class="fas fa-map-marker-alt"></i>
                <div class="delivery__location-details">
                    <h4>Delivery Location</h4>
                    <p>${object.deliveryLocation}</p>
                </div>
            </div>
        </div>
            <div class="delivery__actions">
                <button class="delivery__btn delivery__btn--primary">
                    <i class="fas fa-check"></i>
                    Complete Delivery
                </button>
                    <button class="delivery__btn delivery__btn--secondary">
                    <i class="fas fa-phone"></i>
                    Contact Customer
                </button>
            </div>
        </div>`

        orderContainer.innerHTML =  orderHtml;
    }
    

  

    function renderUserinfo(info) {
        statusInfo.className = `sidebar__status sidebar__status--${info.status.toLowerCase()}`;
        statusInfo.innerText = info.status;
        sidebarName.innerText = info.name;
        img.src = `https://ui-avatars.com/api/?name=${info.name}&background=random`

        const statusAndRatingHTML = `
            <div class="header__status">
                <select class="header__status-select" id="deliveryStatus">
                    <option value="offline">Offline</option>
                    <option value="Online">Online</option>
                    <option value="busy">Busy</option>
                </select>
            </div>
            <div class="header__stats">
                <div class="header__stat">
                    <i class="fas fa-star"></i>
                    <span>4.8</span>
                </div>
            </div>`
        header.innerHTML = statusAndRatingHTML;
        const statusSelect = document.getElementById("deliveryStatus");
        statusSelect.value = info.status.toLowerCase();
    }


    const { token } = parseJwt();
    async function getAgentInfo() {
        try {
            const response = await fetch(`${API}/get/agent/info?token=${token}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("sumthing wrong");
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }

    getAgentInfo().then((info) => {
        renderUserinfo(info);
        renderLiveMessage();
    })

    async function getResentOrder() {
        try {
            const response = await fetch(`${API}/get/resent/orders?token=${token}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("sumthing wrong");
            const res = await response.json();
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    async function confirmOrder(orderId) {
        const data = {
            orderId,
            token
        }
        try {
            const response = await fetch(`${API}/accept/order`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error("sumthing wrong");
            }
            const res = await response.json();
            renderCurrentOrder(res);
            
        } catch (error) {
            console.log(error);
        }
    }

    function renderPopupNewOrder(message) {
        const notificationDiv = document.createElement("div");
        notificationDiv.className = "notification";
        notificationDiv.id = "notification";
        notificationDiv.innerHTML = `
            <svg class="bell" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
             New Order Arrived
            <button id="acceptOrder" data-id="${message}"> Accept Order</button>
        `;

        document.body.appendChild(notificationDiv);
        notificationDiv.classList.add('show');

        document.getElementById("acceptOrder").addEventListener("click", (event) => {
            const orderId = event.target.dataset.id;
            confirmOrder(orderId);
            showNotification("Order Accepted! " + orderId);
        });

        setTimeout(() => {
            notificationDiv.remove();
        }, 10000);
    }

    function renderLiveMessage() {
        const socket = new SockJS(W_API);
        const stompClient = new StompJs.Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000
        });

        stompClient.onConnect = function (frame) {
            console.log("✅ Connected to WebSocket!");
            stompClient.subscribe(`/topic/new_order`, function (message) {
                console.log("📩 Order Update: ", message.body);
                if (message.body) {
                    renderPopupNewOrder(message.body)
                }
            });
        };
        stompClient.onWebSocketClose = (event) => {
            console.error("❌ WebSocket closed:", event);
        };
        stompClient.onWebSocketError = (event) => {
            console.error("⚠ WebSocket error:", event);
        };
        stompClient.activate();
    }

    const orders = [];

    function renderOrders() {
        const ordersList = document.getElementById('ordersList');
        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-item__info">
                    <span class="order-item__id">${order.id}</span>
                    <span class="order-item__address">${order.address}</span>
                </div>
                <span class="order-item__status order-item__status--${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
        `).join('');
    }

    const completeDeliveryBtn = document.querySelector('.delivery__btn--primary');
    completeDeliveryBtn.addEventListener('click', () => {
        const deliveryCard = document.querySelector('.delivery__card');
        deliveryCard.style.opacity = '0.5';
        setTimeout(() => {
            showNotification('Delivery completed successfully!');
            deliveryCard.style.opacity = '1';
        }, 500);
    });

    const contactCustomerBtn = document.querySelector('.delivery__btn--secondary');
    contactCustomerBtn.addEventListener('click', () => {
        showNotification('Calling customer...');
    });

    renderOrders();
});