import "./delivery-agent-nav.js";
import "./footer.js";



document.addEventListener('DOMContentLoaded', () => {
    // Sample orders data
    const orders = [
        {
            id: 'ORD-2023-1233',
            address: '789 Pine St, City',
            status: 'completed',
            timestamp: '2023-05-15 14:30'
        },
        {
            id: 'ORD-2023-1232',
            address: '321 Oak St, City',
            status: 'cancelled',
            timestamp: '2023-05-15 13:15'
        },
        {
            id: 'ORD-2023-1231',
            address: '654 Maple St, City',
            status: 'completed',
            timestamp: '2023-05-15 12:00'
        }
    ];

    // Render orders list
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

    // Handle delivery status change
    const deliveryStatus = document.getElementById('deliveryStatus');
    deliveryStatus.addEventListener('change', (e) => {
        const status = e.target.value;
        // Update the UI based on status
        document.querySelector('.sidebar__status').className = 
            `sidebar__status sidebar__status--${status}`;
    });

    // Handle delivery completion
    const completeDeliveryBtn = document.querySelector('.delivery__btn--primary');
    completeDeliveryBtn.addEventListener('click', () => {
        const deliveryCard = document.querySelector('.delivery__card');
        deliveryCard.style.opacity = '0.5';
        setTimeout(() => {
            alert('Delivery completed successfully!');
            deliveryCard.style.opacity = '1';
        }, 500);
    });

    // Handle customer contact
    const contactCustomerBtn = document.querySelector('.delivery__btn--secondary');
    contactCustomerBtn.addEventListener('click', () => {
        alert('Calling customer...');
    });

    // Initialize orders list
    renderOrders();
});