import API from "./end-point.js";
import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";


export function customerOrderSection() {
    const ordersSectionHtml = ` 
            <section class="recent-orders animationSecond">
                <div class="section-header">
                    <h2>Orders</h2>
                   <!-- <a href="#" class="view-all">View All</a> -->
                </div>
                <div class="order-list-container"></div>
                </section>`

    document.querySelector(".main-content").innerHTML = ordersSectionHtml;
    async function renderOrderList(order) {
        console.log(order)
        renderLiveMessage(order.orderId);
        const orderListHtml = `
            <div class="order-list">
                <div class="order-card">
                    <div class="order-header">
                        <span class="order-id">${order.orderId}</span>
                        <span class="order-status delivered">${order.status}</span>
                    </div>
                    <div class="restaurant-info">
                        ${order.orderItemDTOList.map(item => `
                            <div class="restaurant-item">
                                <img src="${item.foodImg}" alt="Restaurant">
                                <div>
                                    <h4>${item.name}</h4>
                                    <p>${item.originalAmount} X ${item.quantity} = ${item.totalAmount}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <div class="order-meta">
                            <span><i class="far fa-calendar"></i> ${order.oderDate}</span>
                            <span class="price-order">₹ ${order.totalAmount}</span>
                            <span>${order.paymentMode}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.querySelector(".order-list-container").insertAdjacentHTML('beforeend', orderListHtml);
    }




    async function getOrderList() {
        const { token } = parseJwt();

        try {
            const response = await fetch(`${API}/customer/orderlist?token=${token}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                showNotification("Server Busy");
                return;
            }

            const orders = await response.json();
            orders.reverse().forEach(order => renderOrderList(order));
        } catch (error) {
            console.error("Error fetching order list:", error);
        }
    }

    getOrderList();




    function renderLiveMessage(id) {
        const { token } = parseJwt();

        const socket = new SockJS("http://localhost:8080/ws");
        const stompClient = new StompJs.Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: "Bearer " + token
            },
            debug: function (str) {
                console.log(str); // Debugging logs
            },
            reconnectDelay: 5000 // Auto-reconnect after 5 seconds
        });
    
        stompClient.onConnect = function (frame) {
            console.log(" Connected to WebSocket!");
    
            // Subscribe to order updates
            stompClient.subscribe(`/topic/order/${id}`, function (message) {
                console.log(" Order Update:", message.body);
            });
        };
    
        stompClient.onStompError = function (frame) {
            console.error(" STOMP Error:", frame.headers['message']);
        };
    
        stompClient.activate(); // ✅ Correct way to connect
    }
    


    async function name() {
        const { token } = parseJwt();
        try {
            const response = await fetch(`${API}/test-websocket/ORDER_02161724_394`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const res = await response;
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    // setInterval(() => {
        name();   
    //     console.log("name called")
    // },5000)
    

}



















