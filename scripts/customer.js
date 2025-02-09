const customerHtml = `
        <aside class="sidebar">
            <div class="user-info animationFirst">
                <img src="./assets/user.png" alt="User Photo">
                <h2>Shiva</h2>
                <p class="user-email">shiva@gmail.com</p>
            </div>
            <ul class="sidebar-menu">
                <li class="active animationFirst" ><i class="fas fa-home"></i> Overview</li>
                <li class="animationSecond"><i class="fas fa-history"></i> Order History</li>
                <li class="animationThree"><i class="fas fa-heart"></i> Favorites</li>
                <li class="animationFour"><i class="fas fa-address-book"></i> Addresses</li>
                <li class="animationFive"><i class="fas fa-credit-card"></i> Payment Methods</li>
                <li class="animationSix"><i class="fas fa-cog"></i> Settings</li>
            </ul>
        </aside>

        <main class="main-content">
            <section class="stats-section">
                <div class="stat-card animationSecond">
                    <i class="fas fa-shopping-bag"></i>
                    <div class="stat-info">
                        <h3>Total Orders</h3>
                        <p>48</p>
                    </div>
                </div>
                <div class="stat-card animationThree">
                    <i class="fas fa-heart"></i>
                    <div class="stat-info">
                        <h3>Favorite Places</h3>
                        <p>12</p>
                    </div>
                </div>
                <div class="stat-card animationFour">
                    <i class="fas fa-award"></i>
                    <div class="stat-info">
                        <h3>Reward Points</h3>
                        <p>850</p>
                    </div>
                </div>
            </section>

            <section class="recent-orders animationSecond">
                <div class="section-header">
                    <h2>Recent Orders</h2>
                    <a href="#" class="view-all">View All</a>
                </div>
                <div class="order-list">
                    <div class="order-card">
                        <div class="order-header">
                            <span class="order-id">#12345</span>
                            <span class="order-status delivered">Delivered</span>
                        </div>
                        <div class="restaurant-info">
                            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Restaurant">
                            <div>
                                <h3>Pizza Paradise</h3>
                                <p>2x Margherita Pizza, 1x Coke</p>
                            </div>
                        </div>
                        <div class="order-footer">
                            <div class="order-meta">
                                <span><i class="far fa-calendar"></i> Today, 2:30 PM</span>
                                <span>₹ 32.50</span>
                            </div>
                        </div>
                    </div>

                    <div class="order-card">
                        <div class="order-header">
                            <span class="order-id">#12344</span>
                            <span class="order-status delivered">Delivered</span>
                        </div>
                        <div class="restaurant-info">
                            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd" alt="Restaurant">
                            <div>
                                <h3>Burger House</h3>
                                <p>1x Classic Burger, 1x Fries</p>
                            </div>
                        </div>
                        <div class="order-footer">
                            <div class="order-meta">
                                <span><i class="far fa-calendar"></i> Yesterday</span>
                                <span>₹ 18.99</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="favorite-restaurants animationSecond">
                <div class="section-header">
                    <h2>Favorite Restaurants</h2>
                    <a href="#" class="view-all">View All</a>
                </div>
                <div class="restaurant-grid">
                    <div class="restaurant-card">
                        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591" alt="Pizza Paradise">
                        <div class="restaurant-details">
                            <h3>Pizza Paradise</h3>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>4.8</span>
                            </div>
                            <p>Italian • Pizza</p>
                        </div>
                    </div>
                    <div class="restaurant-card">
                        <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd" alt="Burger House">
                        <div class="restaurant-details">
                            <h3>Burger House</h3>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>4.5</span>
                            </div>
                            <p>American • Burgers</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        `

const dashbordContainer = document.querySelector(".dashboard-container");
dashbordContainer.innerHTML=customerHtml;

