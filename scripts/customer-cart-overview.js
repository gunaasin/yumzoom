import API from "./end-point.js";
import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import { customerOrderSection } from "./customer-orders.js";


export function cartAndOverviewSection() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/cart.css";
    document.head.appendChild(link);

    const cartItemsAndOverviewHTML = `

        <h1 class="cart-title">Your Cart</h1>
        <div class="cart-content">
            <div class="cart-items animationFour"></div>
            <div class="cart-summary animationFive">
            </div>
        </div>`

    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = cartItemsAndOverviewHTML;
    const cartitemContainer = document.querySelector(".cart-items");
    const checkoutContainer = document.querySelector(".cart-summary");

    function loadCartItems(item) {
        const cartItemHtml =
            `<div class="cart-item" data-id="${item.id}">
                <div class="item-info">
                    <div class="veg-indicator ${item.category === "Veg" ? "veg" : " non-veg"}"></div>
                    <h3>${item.foodName}</h3>
                    <p class="restaurant">${item.restaurantName}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="item-price">₹ ${item.price}</div>
            </div>`
        cartitemContainer.innerHTML += cartItemHtml;
    }

    document.addEventListener("click", async (event) => {
        if (event.target.classList.contains("increase") || event.target.classList.contains("decrease")) {
            const cartItem = event.target.closest(".cart-item");
            const itemId = cartItem.dataset.id;
            const quantityROOT = cartItem.querySelector(".quantity");
            let quantity = parseInt(quantityROOT.textContent);
            const isIncrease = event.target.classList.contains("increase");
            quantity = isIncrease ? quantity + 1 : quantity - 1;
            try {
                const response = await fetch(`${API}/customer/updatecart/${itemId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity }),
                });
                if (!response.ok) {
                    showNotification("somthing when wrong");
                    return;
                }
                const message = await response.json();
                showNotification(message[1]);
                callingFunction();
            } catch (error) {
                console.error(error);
                window.location = "/";
            }
        }
    })


    function callingFunction() {
        loadCart().then((response) => {
            cartitemContainer.innerHTML = "";
            checkoutContainer.innerHTML = "";
            let totalPrice = 0;
            if (response[0] === "Cart is Empty") {
                showNotification(response[0]);
                emptyCart();
            } else {
                response.forEach(element => {
                    totalPrice += element.price;
                    loadCartItems(element);
                });
                loadCheckOut(totalPrice);
            }
        });
    }

    function loadCheckOut(price) {
        const checkoutHtml =
            `       <h2>Bill Details</h2>
                <div class="summary-item">
                    <span>Item Total</span>
                    <span>₹ ${price}</span>
                </div>
                <div class="summary-item">
                   <span ${price>500 ? "class='free'": "" }> Delivery Fee</span>
                    <span ${price>500 ? "class='free'": "" }>₹40</span>
                </div>
                <div class="summary-item">
                    <span>Platform Fee</span>
                    <span>₹5</span>
                </div>
                <div class="summary-item">
                    <span>GST 12%</span>
                    <span>₹${(price * 12)/ 100}</span>
                </div>
                <div class="summary-total">
                    <span>To Pay</span>
                    <span>₹ ${(price + 5) + (price>500 ? 0 : 40) + ((price * 12)/ 100)} </span>
                </div>

                 <div class="payment-method">
                    <label class="payment-category" for="category">Payemt Method</label><br>
                    <select class="food-form__select" id="category" name="category" required>
                        <option value="" disabled selected>Select a Method</option>
                        <option value="CARD">Card</option>
                        <option value="CASH_ON_DELIVERY">Cash On Delivery</option>
                    </select>
                </div>
                <button class="checkout-btn">
                Proceed to Checkout</button>`
        checkoutContainer.innerHTML += checkoutHtml



        document.querySelector(".checkout-btn").addEventListener("click", async (event) => {

            const metaData = {
                token,
                paymentMode: document.getElementById("category").value
            }
            if(metaData.paymentMode===""){
                showNotification("Select Payment Option");
                return;
            }
            try {
                event.target.innerHTML="";
                event.target.innerHTML = `<div class="loader"/>`;
                const response = await fetch(`${API}/customer/placeOrder`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(metaData),
                });
                if (!response.ok) {
                    showNotification("somthing when wrong");
                    return;
                }
                event.target.innerHTML = `<div class="loader"/>`;
                event.target.innerHTML="Order Process";
                const message = await response.json();
                showNotification(message.message);
                window.location=message.sessionUrl;
                    if(message.status==="CART"){
                        customerOrderSection();
                    }
            } catch (error) {
                console.error(error);
            }
        })
    }



    const { token } = parseJwt();
    async function loadCart() {
        try {
            const response = await fetch(`${API}/customer/getCartList?token=${token}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) {
                showNotification("Something went wrong");
            }
            return await response.json();
        } catch (error) {
            console.warn(error);
            showNotification("Something went wrong");
            window.location = "/";
        }
    }

    function emptyCart() {
        const empty = `
            <div class="empty-cart">
                <p>Empty Cart</p>
            </div>`
        cartitemContainer.innerHTML += empty;
    }

    loadCart().then((response) => {
        let totalPrice = 0;
        if (response[0] === "Cart is Empty") {
            showNotification(response[0]);
            emptyCart();
        } else {
            response.forEach(element => {
                totalPrice += element.price;
                loadCartItems(element);
            });
            loadCheckOut(totalPrice);
        }
    });





}