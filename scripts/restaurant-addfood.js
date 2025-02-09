import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import API from "./end-point.js";
import { extractRestaurantId } from "./restaurant.js";



export function loadAddFoodSection() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurent-addfood.css";
    document.head.appendChild(link);

    const addFoodHtml = `<div class="food-form">
        <form id="foodForm" class="food-form__form">
            <h2 class="food-form__title">Add Food Item</h2>
            <div class="food-form__group">
                <label class="food-form__label" for="itemName">Item Name</label>
                <input class="food-form__input" type="text" id="itemName" name="itemName" placeholder="Enter item name" required>
            </div>
            <div class="food-form__group">
                <label class="food-form__label" for="description">Description</label>
                <textarea class="food-form__textarea" id="description" name="description" placeholder="Enter item description" required></textarea>
            </div>
            <div class="food-form__group">
                <label class="food-form__label" for="price">Price</label>
                <input class="food-form__input food-form__input--price" type="number" id="price" name="price" placeholder="1000" required>
            </div>
            <div class="food-form__group">
                <label class="food-form__label" for="category">Category</label>
                <select class="food-form__select" id="category" name="category" required>
                    <option value="" disabled selected>Select a category</option>
                    <option value="Non Veg">Non Veg</option>
                    <option value="Veg">Veg</option>
                </select>
            </div>
            <div class="food-form__group">
                <label class="food-form__label" for="imagePath">Image URL</label>
                <input class="food-form__input food-form__input--url" type="url" id="imagePath" name="imagePath" placeholder="Enter image URL" required>
            </div>
            <button class="food-form__submit" id="add-food-btn" type="button">Add Food Item</button>
        </form>
        <div class="preview" id="previewContainer">
            <h3 class="preview__title">Preview</h3>
            <p class="preview__item"><strong class="preview__label">Name:</strong> <span class="preview__value" id="previewName"></span></p>
            <p class="preview__item"><strong class="preview__label">Description:</strong> <span class="preview__value" id="previewDescription"></span></p>
            <p class="preview__item"><strong class="preview__label">Price:</strong> ₹ <span class="preview__value" id="previewPrice"></span></p>
            <p class="preview__item"><strong class="preview__label">Category:</strong> <span class="preview__value" id="previewCategory"></span></p>
            <p class="preview__item"><strong class="preview__label">Image Preview</strong></p>
            <img id="previewImage" class="preview__image" alt="Food item preview">
        </div>
    </div>`;

    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = addFoodHtml;
    const foodForm = document.getElementById('foodForm');
    const addBtn = document.getElementById("add-food-btn");
    const previewContainer = document.getElementById('previewContainer');

    const previewName = document.getElementById('previewName');
    const previewDescription = document.getElementById('previewDescription');
    const previewPrice = document.getElementById('previewPrice');
    const previewCategory = document.getElementById('previewCategory');
    const previewImage = document.getElementById('previewImage');

    // preview as user types
    foodForm.addEventListener('input', (e) => {
        const formData = new FormData(foodForm);
        previewName.textContent = formData.get('itemName');
        previewDescription.textContent = formData.get('description');
        previewPrice.textContent = formData.get('price');
        previewCategory.textContent = formData.get('category');

        const imageUrl = formData.get('imagePath');
        if (imageUrl) {
            previewImage.src = imageUrl;
            previewContainer.classList.add('show');
        }
    });

    addBtn.addEventListener('click', async (e) => {
        addBtn.innerText="";
        addBtn.innerHTML=`<div class="loader"/>`
        e.preventDefault();

        const formData = new FormData(foodForm);
        const foodItem = {
            itemName: formData.get('itemName'),
            description: formData.get('description'),
            price: formData.get('price'),
            category: formData.get('category'),
            imagePath: formData.get('imagePath'),
            restaurantId: extractRestaurantId()
        };

        const { token } = parseJwt();
        try {
            const response = await fetch(`${API}/restaurant/addFoodItem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(foodItem)
            });

            const res =  await response.json();
            if (!response.ok) {
                showNotification(res.message); 
                return;
            }
            addBtn.innerHTML="";
            addBtn.innerText ='Add Food Item';
            
            showNotification('Food item added successfully!');
            foodForm.reset();
            previewContainer.classList.remove('show');
        } catch (error) {
            console.warn("Error occurred while adding food item");
        }
    });
}
