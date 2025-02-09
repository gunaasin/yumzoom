import { showNotification } from "./notification.js";
export function loadRestaurantAddressAndUpdateInfo() {
    

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurentInformation.css"; 
    document.head.appendChild(link);
    const addressHtml = ` 
           <form id="restaurantForm" class="restaurant-form" onsubmit="handleSubmit(event)">
                <div class="form-group animationThree">
                    <label for="name" class="form-label">Restaurant Name</label>
                    <input type="text" id="name" name="name" class="form-input" placeholder="Enter restaurant name" required>
                </div>
    
                <div class="form-group animationFour">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input type="tel" id="phone" name="phone" class="form-input" placeholder="Enter 10-digit phone number" required>
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

                <div class="custom-file-upload animationSix">
                    <label for="imagePath" class="upload-label">
                        <span id="fileName">Choose a file</span>
                        <button type="button" class="upload-btn">Browse</button>
                    </label>
                    <input type="file" id="imagePath" name="imagePath" class="hidden-file-input" accept="image/*">
                    <div class="image-preview-container" id="imagePreview">
                        <img id="previewImage" class="image-preview" src="" alt="Preview" style="display: none;">
                        <span class="image-preview-text">No image selected</span>
                    </div>
                </div>
    
    
                <button type="button" class="address-toggle animationSix" >
                    <span class="address-toggle__text">Update Address</span>
                    <span class="address-toggle__icon">▼</span>
                </button>
    
                <div class="address-section" id="addressSection">
                    <div class="form-group ">
                        <label for="street" class="form-label">Street Address</label>
                        <input type="text" id="street" name="street" class="form-input" placeholder="Enter street address" required>
                    </div>
    
                    <div class="form-group">
                        <label for="city" class="form-label">City</label>
                        <input type="text" id="city" name="city" class="form-input" placeholder="Enter city" required>
                    </div>
    
                    <div class="form-group">
                        <label for="state" class="form-label">State</label>
                        <input type="text" id="state" name="state" class="form-input" placeholder="Enter state" required>
                    </div>
    
                    <div class="form-group">
                        <label for="pinCode" class="form-label">Pin Code</label>
                        <input type="text" id="pinCode" name="pinCode" class="form-input" placeholder="Enter 6-digit pin code" required>
                    </div>
                </div>
    
                <button type="submit" class="submit-button animationSix">Update Restaurant Details</button>
           </form>`

    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = " ";
    mainContent.innerHTML = addressHtml;

    function handleSubmit(event) {
        event.preventDefault();

        const formData = {
            restaurantId: document.getElementById('restaurantId').value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            cusineType: document.getElementById('cusineType').value,
            isActive: document.getElementById('isActive').checked,
            imagePath: document.getElementById('imagePath').files[0]?.name || '',
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
        if (!pinCodeRegex.test(formData.address.pinCode)) {
            showNotification('Please enter a valid 6-digit pin code');
            return;
        }

        // Log the form data (in a real application, you would send this to a server)
        console.log('Restaurant Update Data:', formData);

        showNotification(`Information updated successfully!`)

        // Reset the form
        // event.target.reset();

        // Hide address section after form submission
        document.getElementById('addressSection').classList.remove('show');
        document.querySelector('.address-toggle').classList.remove('active');

        // Reset image preview
        document.getElementById('previewImage').style.display = 'none';
        document.querySelector('.image-preview-text').style.display = 'block';

        console.log("information")
    }



    // Add phone number validation on input
    document.getElementById('phone').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 10);
    });

    // Add pin code validation on input
    document.getElementById('pinCode').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 6);
    });


    // Handle image preview
    document.getElementById("imagePath").addEventListener('click', (event) => {
        const file = event.target.files[0];
        const previewImage = document.getElementById('previewImage');
        const previewText = document.querySelector('.image-preview-text');

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                previewText.style.display = 'none';
            }
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = 'none';
            previewText.style.display = 'block';
        }
    })

    // Toggle address section
    document.querySelector(".address-toggle").addEventListener('click', () => {
        const addressSection = document.getElementById('addressSection');
        const toggleButton = document.querySelector('.address-toggle');

        addressSection.classList.toggle('show');
        toggleButton.classList.toggle('active');
    });


}