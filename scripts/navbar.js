
const nav = document.querySelector('.nav');
nav.innerHTML = ` 
    <a href="index.html" class="logo animationFirst"><img src="./assets/logo.png" alt="logo"></a>
    <div class="nav-links">
      <a href="#" class="active animationSecond">Home</a>
      <a href="index.html#restaurants" class="animationSecond">Restaurants</a>
      <a href="#" class="animationThree">Orders</a>
      <a href="#" class="animationFour">Contact</a>
    </div>
    <div class="nav-icons animationFive">
      <input class="search-bar " id="search-bar" type="text" placeholder="Search for restaurants or cuisines...">
      <i id="search-icon" class="fa-solid fa-magnifying-glass"></i>
      <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
      <a href="user.html"><i class="fas fa-user"></i>
      <i class="fa-solid fa-gear"></i>
    </div>`;

document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-icon');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');

    searchIcon.addEventListener('click', function() {
        if (searchBar.style.display === 'none' || searchBar.style.display === '') {
            searchBar.style.display = 'block';
            searchIcon.classList.add('active-btn');
            searchIcon.style.color = '#ff6b6b';

        } else {
            searchBar.style.display = 'none';
            searchIcon.classList.remove('active-btn');
            searchIcon.style.color = 'black';
        }
    });
});