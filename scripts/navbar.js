
const nav = document.querySelector('.nav');
let sideNavVisible = false;
function BigNav() {
    nav.innerHTML = ` 
    <a href="index.html" class="logo animationFirst"><img src="./assets/logo.png" alt="logo"></a>
    <div class="nav-links">
      <a href="index.html" class="active animationSecond">Home</a>
      <a href="index.html#restaurants" class="animationSecond">Restaurants</a>
      <a href="login.html" class="animationThree">Orders</a>
    </div>
    <div class="nav-icons animationFive">
      <input class="search-bar " id="search-bar" type="text" placeholder="Search for restaurants or cuisines...">
      <i id="search-icon" class="fa-solid fa-magnifying-glass"></i>
      <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
      <a href="user.html"><i class="fas fa-user"></i>
      <a href=""><i class="fa-solid fa-gear"></i></a>
    </div>`;
}

function SmallNav() {
    nav.innerHTML = ` 
        <a href="index.html" class="logo "><img src="./assets/logo.png" alt="logo"></a>

        <div class="nav-icons ">
            <input class="search-bar " id="search-bar" type="text" placeholder="Search for restaurants ...">
             
            <i id="search-icon" class="fa-solid fa-magnifying-glass"></i>
            <i id="toggole-btn"class="fa-solid fa-bars"></i>
            
        </div>
        <div class="side-nav">
            <div class="side-nav-icons">
                <a href="cart.html"><i class="fas fa-shopping-cart"></i></a>
                <a href="user.html"><i class="fas fa-user"></i>
                <a href="login.html"><i class="fa-solid fa-gear"></i></a>
            </div>
            <div class="side-nav-links">
                <a href="index.html" class="">Home</a>
                <a href="index.html#restaurants" class="">Restaurants</a>
                <a href="login.html" class="">Orders</a>
            </div>
        </div>`;

    const toggoleBtn = document.getElementById('toggole-btn');
    const sideNav = document.querySelector('.side-nav');
    toggoleBtn.addEventListener('click', function () {
        if (sideNav.style.right === '-500px') {
            sideNav.style.right = '0';
            sideNavVisible = true; 
        } else {
            sideNav.style.right = '-500px';
            sideNavVisible = false;
        }
    });

    document.addEventListener('click', function (event) {
        const isClickInside = sideNav.contains(event.target) || toggoleBtn.contains(event.target);
        if (!isClickInside && sideNavVisible) {
            sideNav.style.right = '-500px';
            sideNavVisible = false; 
        }
    });
}


function renderNavbar() {
    if (window.innerWidth > 768) {
        BigNav();
    } else {
        SmallNav();
    }
}

renderNavbar();
window.addEventListener('resize', renderNavbar);

document.addEventListener('DOMContentLoaded', function () {
    const searchIcon = document.getElementById('search-icon');
    const searchBar = document.getElementById('search-bar');
    const searchBtn = document.getElementById('search-btn');

    searchIcon.addEventListener('click', function () {
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