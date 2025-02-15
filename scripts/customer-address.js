import API from "./end-point.js";
import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";

export function renderAddressSection() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/customer-address.css";
    document.head.appendChild(link);

    const { token } = parseJwt();
    const mainContent = document.querySelector(".main-content");
    const containerHTML = `<div class="container"></div>`;
    mainContent.innerHTML = containerHTML;
    const container = document.querySelector('.container');

    function renderAddressPreview(address) {
        container.innerHTML = "";
        const addressPreviewHTML = `
        <div id="addressDisplay" class="address-display">
            <h2>Your Address</h2>
            <div class="address-card">
                <div class="address-info">
                    <p id="displayName" class="display-name">${address.name}</p>
                    <p id="displayPhone" class="display-phone">${address.phone}</p>
                    <p id="displayStreet" class="display-street">${address.street}</p>
                    <p><span id="displayCity">${address.city}</span>, <span id="displayState">${address.state}</span> <span id="displayZip">${address.pinCode}</span></p>
                </div>
                <button id="editButton" class="edit-btn">Edit Address</button>
            </div>
        </div>`
        container.innerHTML = addressPreviewHTML;
        const editButton = document.getElementById('editButton');
        editButton.addEventListener('click', () => {
            renderAddressForm(address);
        });
    }

    function renderAddressForm(address){
        container.innerHTML = "";
        const formHtml = `
        <form id="addressForm" class="form-container">
            <h2>Add Delivery Address</h2>
            <div class="form-group">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" required>
            </div>
            <div class="form-group">
                <label for="street">Street Address</label>
                <input type="text" id="street" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" required>
                </div>
                <div class="form-group">
                    <label for="state">State</label>
                    <input type="text" id="state" required>
                </div>
            </div>
            <div class="form-group">
                <label for="zipCode">PIN Code</label>
                <input type="text" id="zipCode" required>
            </div>
            <button type="button" class="submit-btn">Save Address</button>
        </form>`
        container.innerHTML = formHtml;

        function populateForm(address) {
            document.getElementById('fullName').value = address.name;
            document.getElementById('phone').value = address.phone;
            document.getElementById('street').value = address.street;
            document.getElementById('city').value = address.city;
            document.getElementById('state').value = address.state;
            document.getElementById('zipCode').value = address.pinCode;
        }
        
        populateForm(address);
        const form = document.querySelector('.submit-btn');
        const inputs = form.querySelectorAll('input');

        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.classList.remove('error');
                const errorMessage = e.target.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
        });

        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = `${value.slice(0, 3)}-${value.slice(3)}`;
                } else {
                    value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });

        const zipInput = document.getElementById('zipCode');
        zipInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
        });

        // Form submission
        form.addEventListener('click', async (e) => {
            const formData = {
                token,
                name: document.getElementById("fullName").value,
                phone: document.getElementById("phone").value,
                street: document.getElementById("street").value,
                city: document.getElementById("city").value,
                state: document.getElementById("state").value,
                pinCode: document.getElementById("zipCode").value,
            };

            const response = await fetch(`${API}/customer/update/address`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                showNotification("Wrong credential");
            }
            const res = await response.json();
            showNotification(res.message);
            renderAddressPreview(formData);

        });

    }

    async function getAddressInofrmation() {
        try {
            const response = await fetch(`${API}/customer/get/address?token=${token}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });
            return await response.json();
        } catch (error) {
            console.warn(error);
        }
    }

    getAddressInofrmation().then((response) => {
        console.log(response);
        if (response.name===null && response.city===null && response.pinCode===null) {
            renderAddressForm(response)
        } else {
            renderAddressPreview(response);
        }
    })

    function showError(element, message) {
        element.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentElement.appendChild(errorDiv);
    }

}