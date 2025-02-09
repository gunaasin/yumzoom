import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";
import { extractRestaurantId } from "./restaurant.js";
import API from "./end-point.js";

export function renderMenuPage() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/restaurant-menu.css";
    document.head.appendChild(link);

    const menuHtml = `
 <div class="food-list">
                <h2 class="food-list__title">Food Items</h2>
                <div class="food-list__grid" id="foodGrid"></div>
            </div>

            <!-- Modal Overlay -->
            <div class="modal" id="foodModal">
                <div class="modal__content">
                    <div class="food-form">
                        
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ff6b6b" fill-opacity="0.3" d="M0,96L80,106.7C160,117,320,139,480,176C640,213,800,267,960,282.7C1120,299,1280,277,1360,266.7L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>
                        <img src="./assets/food.png" alt="" class="food-img">
                        <h2 class="food-form__title" id="formTitle">Add Food Item</h2>
                        <form id="foodForm" class="food-form__form">
                            <input type="hidden" id="foodId" name="foodId">
                            <div class="food-form__group">
                                <label class="food-form__label" for="itemName">Item Name</label>
                                <input class="food-form__input" type="text" id="itemName" name="itemName"
                                    placeholder="Enter item name" required>
                            </div>

                            <div class="food-form__group">
                                <label class="food-form__label" for="description">Description</label>
                                <textarea class="food-form__textarea" id="description" name="description"
                                    placeholder="Enter item description" required></textarea>
                            </div>

                            <div class="food-form__group">
                                <label class="food-form__label" for="price">Price</label>
                                <input class="food-form__input food-form__input--price" type="number" id="price"
                                    name="price" placeholder="1000" required>
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
                                <input class="food-form__input food-form__input--url" type="url" id="imagePath"
                                    name="imagePath" placeholder="Enter image URL" required>
                            </div>

                            <div class="food-form__buttons">
                                <button class="food-form__submit" id="submit_form" type="button">Save Food Item</button>
                                <button class="food-form__cancel" type="button" id="cancelBtn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;

    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = " ";
    mainContent.innerHTML = menuHtml;

    const foodForm = document.getElementById('foodForm');
    const foodModal = document.getElementById('foodModal');
    const addFoodBtn = document.getElementById('addFoodBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const formTitle = document.getElementById('formTitle');
    const foodGrid = document.getElementById('foodGrid');


    let foodItems = [];
    const { token } = parseJwt();

    async function renderFoodItems() {
        try {
            const response = await fetch(`${API}/restaurant/getAllFood?id=${extractRestaurantId()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                return new Error("incorrect credentials");
            }
            return await response.json();
        } catch (error) {
            console.warn("sumting is wrong :(", error);
        }
    }

    renderFoodItems().then((res) => {
        foodItems = res;
        foodGrid.innerHTML = '';
        res.forEach((item , index) => {
            const foodCard = createFoodCard(item , index  );
            foodGrid.appendChild(foodCard);
        });
    });

    // Create a food card element
    function createFoodCard(item , index) {
        const card = document.createElement('div');
        let i = 0;
        card.className = 'food-card';
        card.innerHTML = `
            <img src="${item.imagePath}" alt="${item.itemName}" class="food-card__image">
            <div class="food-card__content">
            <div class="veg-indicator ${item.category==="Veg" ? "veg" : "non-veg"}"></div>
                <h3 class="food-card__title">${item.itemName}</h3>
                <p class="food-card__description">${item.description}</p>
                <p class="food-card__price">₹ ${item.price}</p>
                <button class="food-card__edit" data-index="${index}">Edit Item</button>
            </div>
        `;
        return card;
    }

    function showModal() {
        foodModal.classList.add('show');
    }

    function hideModal() {
        foodModal.classList.remove('show');
        foodForm.reset();
        document.getElementById('foodId').value = '';
        formTitle.textContent = 'Add Food Item';
    }

    // back to load the data in the form
    function fillFormWithData(item) {
        document.getElementById('itemName').value = item.itemName;
        document.getElementById('description').value = item.description;
        document.getElementById('price').value = item.price;
        document.getElementById('category').value = item.category;
        document.getElementById('imagePath').value = item.imagePath;
    }

    cancelBtn.addEventListener('click', () => {
        hideModal();
    });

    // Close modal when clicking outside
    foodModal.addEventListener('click', (e) => {
        if (e.target === foodModal) {
            hideModal();
        }
    });

    // Edit food item
    let itemId = 0 ;
    foodGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('food-card__edit')) {
            const index = e.target.dataset.index;
            const item = foodItems[index];
            itemId = item.id;
            document.getElementById('foodId').value = index;
            formTitle.textContent = 'Edit Food Item';
            fillFormWithData(item);
            showModal();
        }
    });


    // Form submission
    const submission = document.getElementById("submit_form");
    submission.addEventListener('click', (e) => {
        e.preventDefault();

        console.log(itemId);
        const formData = new FormData(foodForm);
        const foodItem = {
            foodId: itemId,
            itemName: formData.get('itemName'),
            description: formData.get('description'),
            price: formData.get('price'),
            category: formData.get('category'),
            imagePath: formData.get('imagePath'),
            restaurantId: extractRestaurantId()
        };
        console.log(token)
        console.log(foodItem);

        async function postUpdateProduct(foodItem) {
            submission.innerText="";
            submission.innerHTML=`<div class="loader"/>`
            try {
                const response = await fetch(`${API}/restaurant/updateFoodItem`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(foodItem)
                });
                if (!response.ok) {
                    return new Error("incorrect credentials");
                }
                return;
                
            } catch (error) {
                console.warn("sumting is wrong :(", error);
            }
        }

        postUpdateProduct(foodItem).then(()=>{
            showNotification("Food Item Updated");
            submission.innerText="Save Food Item";
            submission.innerHTML="";
            renderFoodItems().then((res) => {
               foodItems = res;
               foodGrid.innerHTML = '';
               res.forEach((item) => {
                   const foodCard = createFoodCard(item);
                   foodGrid.appendChild(foodCard);
               });
           });
        });
        renderFoodItems();
        hideModal();
    });

    renderFoodItems();

}