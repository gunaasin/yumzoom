import API from "./end-point.js";
import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import { extractRestaurantId } from "./restaurant.js";
export function loadRestaurantAddressAndUpdateInfo() {
    
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurentInformation.css";
    document.head.appendChild(link);
    const addressHtml = ` 
           <form id="restaurantForm" class="restaurant-form">
                <div class="form-group animationThree">
                    <label for="name" class="form-label">Restaurant Name</label>
                    <input type="text" id="name" name="name" class="form-input"  required>
                </div>
    
                <div class="form-group animationFour">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input type="tel" id="phone" name="phone" class="form-input" required>
                </div>
    
                <div class="form-group animationFive">
                    <label for="cusineType" class="form-label">Cuisine Type</label>
                    <select id="cusineType" name="cusineType" class="form-select" required>
                        <option value="">Select cuisine type</option>
                        <option value="indian">Indian</option>
                        <option value="italian">Italian</option>
                        <option value="chinese">Chinese</option>
                        <option value="mexican">Mexican</option>
                        <option value="japanese">Japanese</option>
                        <option value="mediterranean">Mediterranean</option>
                        <option value="thai">Thai</option>
                        <option value="french">French</option>
                    </select>
                </div>
    
                <div class="form-group animationSix">
                    <label for="isActive" class="form-label">Restaurant Status</label>
                    <div class="status-toggle">
                        <input type="checkbox" id="isActive" name="isActive" class="status-checkbox" checked>
                        <span class="status-label">Active for Orders</span>
                    </div>
                </div>

                <div class="form-group animationSix">
                    <label for="imag" class="form-label">Image Path</label>
                    <input type="text" id="imagePath" name="imag" class="form-input" required>
                </div>
    
                <button type="button" class="address-toggle animationSix" >
                    <span class="address-toggle__text">Update Address</span>
                    <span class="address-toggle__icon">▼</span>
                </button>
    
                <div class="address-section" id="addressSection">
                    <div class="form-group ">
                        <label for="street" class="form-label">Street Address</label>
                        <input type="text" id="street" name="street" class="form-input"  required>
                    </div>
    
                    <div class="form-group">
                        <label for="city" class="form-label">City</label>
                        <input type="text" id="city" name="city" class="form-input"  required>
                    </div>
    
                    <div class="form-group">
                        <label for="state" class="form-label">State</label>
                        <input type="text" id="state" name="state" class="form-input"  required>
                    </div>
    
                    <div class="form-group">
                        <label for="pinCode" class="form-label">Pin Code</label>
                        <input type="text" id="pinCode" name="pinCode" class="form-input" required>
                    </div>
                </div>
    
                <button type="button" id="submit-info" class="submit-button animationSix">Update Restaurant Details</button>
           </form>`

    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = "";
    mainContent.innerHTML = addressHtml;
    const submitInfobtn = document.getElementById("submit-info");
    const {token} = parseJwt();
    const restaurantForm = document.getElementById("restaurantForm");

    submitInfobtn.addEventListener('click', async() => {
        const formData = {
            restaurantId: extractRestaurantId(),
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            cusineType: document.getElementById('cusineType').value,
            isActive: document.getElementById('isActive').checked,
            image: document.getElementById('imagePath').value,
            addressRequestDTO: {
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pinCode: document.getElementById('pinCode').value
            }
        };

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            showNotification('Please enter a valid 10-digit phone number');
            return;
        }

        const pinCodeRegex = /^\d{6}$/;
        if (!pinCodeRegex.test(formData.addressRequestDTO.pinCode)) {
            showNotification('Please enter a valid 6-digit pin code');
            return;
        }

        try{
            const response = await fetch(`${API}/restaurant/updateRestaurantInfo`,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            if(!response.ok){
                console.warn(`exception in ${response}`);
                return;
            }
            const res = await response.json();
            showNotification(res.message);
            location.reload();
            restaurantForm.reset();
        }catch(error){
            console.warn("exception in address update info");
        }

        document.getElementById('addressSection').classList.remove('show');
        document.querySelector('.address-toggle').classList.remove('active');
        console.log("information")
    });



    document.getElementById('phone').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 10);
    });

    document.getElementById('pinCode').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 6);
    });

    document.querySelector(".address-toggle").addEventListener('click', () => {
        const addressSection = document.getElementById('addressSection');
        const toggleButton = document.querySelector('.address-toggle');

        addressSection.classList.toggle('show');
        toggleButton.classList.toggle('active');
    });


}