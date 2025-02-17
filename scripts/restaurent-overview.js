import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import API ,{ W_API }  from "./end-point.js";
import { loadRestaurantName } from "./restaurant-nav.js";
import { loadRestaurantIdAndInfo, extractRestaurantId } from "./restaurant.js";


export function renderOverview() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurant-overview.css";
    document.head.appendChild(link);

    const overviewHtml = `
    <div class="dashboard">
        
                <main class="main-content">
                    <div class="content-grid">
                        <section class="orders-section">
                            <div class="section-header">
                                <h2>Incoming Orders</h2>
                                <div class="filter-buttons">
                                    <button class="filter-btn active" data-filter="all">All</button>
                                    <button class="filter-btn" data-filter="new">New</button>
                                    <button class="filter-btn" data-filter="preparing">Preparing</button>
                                    <button class="filter-btn" data-filter="ready">Ready</button>
                                </div>
                            </div>
                            <div class="orders-container" id="orders-list">
                                <!-- Orders will be inserted here by JavaScript -->
                            </div>
                        </section>
        
                        <div class="side-sections">

                            <section class="popular-items-section">
                                <h2>Popular Items</h2>
                                <div id="popular-items" class="popular-items-list">
                                    <!-- Popular items will be inserted here -->
                                </div>
                            </section>
        
                            <section class="revenue-section">
                                <h2>Weekly Revenue</h2>
                                <div class="chart-container">
                                    <div class="chart-grid">
                                        <div class="chart-y-axis">
                                            <span>3k</span>
                                            <span>2k</span>
                                            <span>1k</span>
                                            <span>0</span>
                                        </div>
                                        <div id="revenue-chart" class="chart">
                                            <!-- Chart bars will be inserted here -->
                                        </div>
                                        <div class="chart-x-axis">
                                            <span>Mon</span>
                                            <span>Tue</span>
                                            <span>Wed</span>
                                            <span>Thu</span>
                                            <span>Fri</span>
                                            <span>Sat</span>
                                            <span>Sun</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>`

    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = " ";
    mainContent.innerHTML = overviewHtml;


    const popularItems = [
        { name: 'Margherita Pizza', orders: 145 },
        { name: 'Pasta Carbonara', orders: 98 },
        { name: 'Caesar Salad', orders: 87 },
        { name: 'Tiramisu', orders: 76 },
        { name: 'Grilled Salmon', orders: 65 }
    ];

    const weeklyRevenue = [10, 40, 50, 10, 30, 20, 50];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


    function getActionButtons(order) {
        switch (order.status.toLowerCase()) {
            case 'new':
                return `<button class="action-btn btn-accept" data-order-id="${order.orderId}">Accept Order</button>`;
            case 'preparing':
                return `<button class="action-btn btn-ready" data-order-id="${order.orderId}">Mark as Ready</button>`;
            case 'ready':
                return `<button class="action-btn btn-complete" data-order-id="${order.orderId}">Complete Order</button>`;
            default:
                return '';
        }
    }

    let restaurantId;

    const { token, email } = parseJwt();
    function renderRestaurantInforamtion() {
        async function getRestaurantInformation() {
            try {
                const response = await fetch(`${API}/restaurant/information?token=${token}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok && response.status === 403) {
                    showNotification("session expired");
                    window.location = "/";
                }
                return await response.json();
            } catch (error) {
                console.warn("sumting is wrong :(");
            }
        }

        getRestaurantInformation().then((data) => {
            if (!data.name) showNotification("Please Update restaurant Inforamtion !!");
            initDashboard(data);
            loadRestaurantIdAndInfo(data);
            loadRestaurantName(data.name);
            restaurantId = data.restaurantId;
        })
    }

    renderRestaurantInforamtion();

    //  render popular items
    function renderPopularItems() {
        const popularItemsList = document.getElementById('popular-items');
        popularItemsList.innerHTML = popularItems.map(item => `
            <div class="popular-item">
                <span>${item.name}</span>
                <strong>${item.orders} orders</strong>
            </div>
        `).join('');
    }

    //  revenue chart
    function renderRevenueChart() {
        const chart = document.getElementById('revenue-chart');
        const maxRevenue = Math.max(...weeklyRevenue);

        chart.innerHTML = weeklyRevenue.map((revenue, index) => {
            const height = (revenue / maxRevenue) * 100;
            return `
                <div class="chart-bar" 
                     style="height: ${height}%" 
                     title="${days[index]}: ${revenue}">
                </div>
            `;
        }).join('');
    }


    function addOrderEventListeners() {
        document.querySelectorAll(".btn-accept").forEach(button => {
            button.addEventListener("click", () => updateOrderStatus(button.dataset.orderId, 'preparing'));
        });

        document.querySelectorAll(".btn-ready").forEach(button => {
            button.addEventListener("click", () => updateOrderStatus(button.dataset.orderId, 'ready'));
        });

        document.querySelectorAll(".btn-complete").forEach(button => {
            button.addEventListener("click", () => completeOrder(button.dataset.orderId));
        });
    }

    const ordersContainer = document.querySelector('.orders-container');
    async function simulateNewOrders(restaurantId) {
        if (!restaurantId) return;
        renderLiveMessage(restaurantId);
        try {
            const response = await fetch(`${API}/restaurant/get/orders?id=${restaurantId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                console.error("Failed to fetch orders", response);
                return;
            }

            const res = await response.json();
            if (!res.length === 0) {
                showNotification('New order received!');
            }
            console.log(res);
            ordersContainer.innerHTML = "";
            const fragment = document.createDocumentFragment();
            res.reverse().forEach(order => {
                console.log(order);
                const orderCard = document.createElement('div');
                orderCard.classList.add('order-card');

                orderCard.innerHTML = `
                    <span class="order-status status-${order.status.toLowerCase()}">${order.status.toLowerCase()}</span>
                    <div class="order-info">
                        <span>${order.orderId}</span>
                        ${order.foodList.map(food => `<p>${food.itemName} &nbsp;&nbsp; <i class="fa-solid fa-xmark"></i> &nbsp;&nbsp; 1</p>`).join('')}
                        <div class="order-meta">
                            <small>now</small>
                        </div>
                    </div>
                    <div class="order-actions">
                        ${getActionButtons(order)}
                    </div>`;
                fragment.appendChild(orderCard);

            });
            ordersContainer.appendChild(fragment);
            addOrderEventListeners();
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    function initDashboard({ restaurantId }) {
        renderPopularItems();
        renderRevenueChart();
        simulateNewOrders(restaurantId);
    }

    async function updateOrderStatus(orderId, newStatus) {
        try {
            const response = await fetch(`${API}/restaurant/update/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (!response.ok) {
                console.log(response);
                return;
            }

            ordersContainer.innerHTML = "";
            showNotification(`Order #${orderId} is now ${newStatus}`);
            simulateNewOrders(restaurantId);
        } catch (error) {
            console.log(error);
        }
    }

    function renderLiveMessage(restaurantId) {
        const socket = new SockJS(W_API);
        const stompClient = new StompJs.Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000
        });

        stompClient.onConnect = function (frame) {
            console.log("✅ Connected to WebSocket!");
            console.log(restaurantId , "this one for restaurant id")
            stompClient.subscribe(`/topic/rest_orders/${restaurantId}`, function (message) {
                console.log("📩 Order Update: " ,message.body);
            if(message.body){
                simulateNewOrders(restaurantId);
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

    


}
