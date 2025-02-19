const nav = document.querySelector('.nav');
let sideNavVisible = false;
function BigNav() {
    nav.innerHTML = ` 
    <a href="/home" class="logo animationFirst"><img src="./assets/logo.png" alt="logo"></a>
    <div class="nav-links">
      <a href="home" class="active animationSecond">Home</a>
      <a href="home#restaurants" class="animationSecond">Restaurants</a>
      <a href="user" class="animationThree">Orders</a>
    </div>
    <div class="nav-icons animationFive">
      <a href="user"><i class="fas fa-shopping-cart"></i></a>
      <a href="user"><i class="fas fa-user"></i>
      <a href="user"><i class="fa-solid fa-gear"></i></a>
    </div>`;
}

function SmallNav() {
    nav.innerHTML = ` 
        <a href="home" class="logo "><img src="./assets/logo.png" alt="logo"></a>

        <div class="nav-icons ">
            <i id="toggole-btn"class="fa-solid fa-bars"></i>
            
        </div>
        <div class="side-nav">
            <div class="side-nav-icons">
                <a href="user"><i class="fas fa-shopping-cart"></i></a>
                <a href="user"><i class="fas fa-user"></i>
                <a href="user"><i class="fa-solid fa-gear"></i></a>
            </div>
            <div class="side-nav-links">
                <a href="home" class="">Home</a>
                <a href="home#restaurants" class="">Restaurants</a>
                <a href="user" class="">Orders</a>
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



window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".nav");
    if (window.scrollY > 200) {
      navbar.classList.add("scrolled");  
    } else {
      navbar.classList.remove("scrolled"); 
    }
  });