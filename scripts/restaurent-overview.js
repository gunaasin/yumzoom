import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import API from "./end-point.js";
import {loadRestaurantName} from "./restaurant-nav.js";
import {loadRestaurantIdAndInfo} from "./restaurant.js";


export function renderOverview() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurant-overview.css";
    document.head.appendChild(link);

    const overviewHtml = `<div class="dashboard">
        
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
                                            <span>$3k</span>
                                            <span>$2k</span>
                                            <span>$1k</span>
                                            <span>$0</span>
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

    let mockOrders = [
        { id: 1, table: 5, items: ['Margherita Pizza', 'Caesar Salad'], status: 'new', time: '2 min ago', total: 32.50 },
        { id: 2, table: 3, items: ['Pasta Carbonara', 'Tiramisu'], status: 'new', time: '5 min ago', total: 28.75 },
        { id: 3, table: 8, items: ['Grilled Salmon', 'House Wine'], status: 'preparing', time: '8 min ago', total: 45.00 }
    ];

    const popularItems = [
        { name: 'Margherita Pizza', orders: 145 },
        { name: 'Pasta Carbonara', orders: 98 },
        { name: 'Caesar Salad', orders: 87 },
        { name: 'Tiramisu', orders: 76 },
        { name: 'Grilled Salmon', orders: 65 }
    ];

    const weeklyRevenue = [2150, 1850, 2300, 1950, 2450, 2600, 2150];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    function getActionButtons(order) {
        switch (order.status) {
            case 'new':
                return `
                    <button class="action-btn btn-accept" onclick="updateOrderStatus(${order.id}, 'preparing')">
                        Accept Order
                    </button>
                `;
            case 'preparing':
                return `
                    <button class="action-btn btn-ready" onclick="updateOrderStatus(${order.id}, 'ready')">
                        Mark as Ready
                    </button>
                `;
            case 'ready':
                return `
                    <button class="action-btn btn-complete" onclick="completeOrder(${order.id})">
                        Complete Order
                    </button>
                `;
            default:
                return '';
        }
    }

    // Function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Function to update order status
    function updateOrderStatus(orderId, newStatus) {
        const order = mockOrders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            showNotification(`Order #${orderId} is now ${newStatus}`);
            renderOrders();
        }
    }

    // Function to complete and remove order
    function completeOrder(orderId) {
        mockOrders = mockOrders.filter(o => o.id !== orderId);
        showNotification(`Order #${orderId} completed`);
        renderOrders();
    }

    // Function to render orders
    function renderOrders() {
        const ordersContainer = document.getElementById('orders-list');
        ordersContainer.innerHTML = mockOrders.map(order => `
            <div class="order-card">
                <span class="order-status status-${order.status}">${order.status}</span>
                <div class="order-info">
                    <strong>Table ${order.table}</strong>
                    <p>${order.items.join(', ')}</p>
                    <div class="order-meta">
                        <small>${order.time}</small>
                        <strong>${formatCurrency(order.total)}</strong>
                    </div>
                </div>
                <div class="order-actions">
                    ${getActionButtons(order)}
                </div>
            </div>
        `).join('');
    }


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
                    window.location="/";
                }
                return await response.json();
            } catch (error) {
                console.warn("sumting is wrong :(");
            }
        }

        getRestaurantInformation().then((data) => {
            loadRestaurantIdAndInfo(data);
            loadRestaurantName(data.name);
        })
    }

    renderRestaurantInforamtion();

    // Function to render popular items
    function renderPopularItems() {
        const popularItemsList = document.getElementById('popular-items');
        popularItemsList.innerHTML = popularItems.map(item => `
            <div class="popular-item">
                <span>${item.name}</span>
                <strong>${item.orders} orders</strong>
            </div>
        `).join('');
    }

    // Function to render revenue chart
    function renderRevenueChart() {
        const chart = document.getElementById('revenue-chart');
        const maxRevenue = Math.max(...weeklyRevenue);

        chart.innerHTML = weeklyRevenue.map((revenue, index) => {
            const height = (revenue / maxRevenue) * 100;
            return `
                <div class="chart-bar" 
                     style="height: ${height}%" 
                     title="${days[index]}: ${formatCurrency(revenue)}">
                </div>
            `;
        }).join('');
    }

    // Function to handle filter buttons
    function initializeFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;
                if (filter === 'all') {
                    renderOrders();
                } else {
                    const filteredOrders = mockOrders.filter(order => order.status === filter);
                    const ordersContainer = document.getElementById('orders-list');
                    ordersContainer.innerHTML = filteredOrders.map(order => `
                        <div class="order-card">
                            <span class="order-status status-${order.status}">${order.status}</span>
                            <div class="order-info">
                                <strong>Table ${order.table}</strong>
                                <p>${order.items.join(', ')}</p>
                                <div class="order-meta">
                                    <small>${order.time}</small>
                                    <strong>${formatCurrency(order.total)}</strong>
                                </div>
                            </div>
                            <div class="order-actions">
                                ${getActionButtons(order)}
                            </div>
                        </div>
                    `).join('');
                }
            });
        });
    }

    // Simulate new incoming orders
    function simulateNewOrders() {
        setInterval(() => {
            const newOrderChance = Math.random();
            if (newOrderChance > 0.7) {
                const newOrder = {
                    id: Date.now(),
                    table: Math.floor(Math.random() * 20) + 1,
                    items: ['Margherita Pizza', 'Caesar Salad'],
                    status: 'new',
                    time: 'just now',
                    total: 32.50
                };
                mockOrders.unshift(newOrder);
                renderOrders();
                showNotification('New order received!');
            }
        }, 10000);
    }

    function initDashboard() {
        renderOrders();
        renderPopularItems();
        renderRevenueChart();
        initializeFilterButtons();
        simulateNewOrders();
    }
    initDashboard();
    document.addEventListener('DOMContentLoaded', initDashboard);
}
