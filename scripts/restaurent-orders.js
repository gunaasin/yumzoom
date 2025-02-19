
export function restaurantAddressInfo() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurent-order.css";
    document.head.appendChild(link);

    const ordersHtml = `
     <div class="container">
        <header>
            <h1>Order History</h1>
            <div class="filter-section">
                <select id="timeFilter">
                    <option value="all">All Time</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="year">Last Year</option>
                </select>
            </div>
        </header>

        <main id="orderList">
        </main>
    </div>

    <template id="orderTemplate">
        <div class="order-card">
            <div class="order-header">
                <div class="order-id"></div>
                <div class="order-status"></div>
            </div>
            <div class="order-content">
                <div class="restaurant-info">
                    <img class="restaurant-image" alt="Restaurant">
                    <div class="restaurant-details">
                        <h3 class="restaurant-name"></h3>
                        <p class="order-date"></p>
                    </div>
                </div>
                <div class="order-items"></div>
                <div class="order-footer">
                    <div class="delivery-address"></div>
                    <div class="order-total"></div>
                </div>
            </div>
        </div>
    </template>`;

    const mainContent = document.querySelector(".main-content");
    if (!mainContent) {
        console.error("Element with class 'main-content' not found!");
        return;
    }

    mainContent.innerHTML = ordersHtml;

    // Sample orders
    const orders = [
        {
            id: 'ORD-2024-001',
            date: '2024-03-15 14:30',
            food: {
                name: 'Pizza Palace',
                image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=120&h=120&fit=crop'
            },
            items: [
                { name: 'Margherita Pizza', quantity: 1, price: 150 },
                { name: 'Garlic Bread', quantity: 1, price: 40 },
                { name: 'Coke', quantity: 2, price: 90 }
            ],
            total: 280,
            status: 'Delivered',
            address: '123 Main St, City',
            rating: 5
        },
        {
            id: 'ORD-2024-002',
            date: '2024-03-14 19:45',
            food: {
                name: 'Burger House',
                image: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=120&h=120&fit=crop'
            },
            items: [
                { name: 'Margherita Pizza', quantity: 1, price: 150 },
                { name: 'Garlic Bread', quantity: 1, price: 40 },
                { name: 'Coke', quantity: 2, price: 90 }
            ],
            total: 280,
            status: 'Delivered',
            address: '456 Oak Ave, City',
            rating: 4
        },
        {
            id: 'ORD-2024-003',
            date: '2024-03-13 12:15',
            food: {
                name: 'Sushi Express',
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=120&h=120&fit=crop'
            },
            items: [
                { name: 'Margherita Pizza', quantity: 1, price: 150 },
                { name: 'Garlic Bread', quantity: 1, price: 40 },
                { name: 'Coke', quantity: 2, price: 90 }
            ],
            total: 280,
            status: 'Delivered',
            address: '789 Pine St, City',
            rating: 5
        }
    ];


    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Render order items
    const renderOrderItems = (items) => {
        return items.map(item => `
            <div class="order-item">
                <span>${item.quantity} x ${item.name}</span>
                <span>${item.price}</span>
            </div>
        `).join('');
    };

    // Render single order
    const renderOrder = (order) => {
        const template = document.getElementById('orderTemplate').content.cloneNode(true);
        template.querySelector('.order-id').textContent = `Order ${order.id}`;
        template.querySelector('.order-status').textContent = order.status;
        template.querySelector('.restaurant-image').src = order.food.image;
        template.querySelector('.restaurant-name').textContent = order.food.name;
        template.querySelector('.order-date').textContent = formatDate(order.date);
        template.querySelector('.order-items').innerHTML = renderOrderItems(order.items);
        template.querySelector('.delivery-address').textContent = order.address;
        template.querySelector('.order-total').textContent = `Total: ${order.total}`;
        return template;
    };

    const renderOrders = (orders) => {
        const orderList = document.getElementById('orderList');
        if (!orderList) {
            console.error("Element with id 'orderList' not found!");
            return;
        }
        orderList.innerHTML = '';
        orders.forEach(order => {
            orderList.appendChild(renderOrder(order));
        });
    };
    renderOrders(orders);
}
