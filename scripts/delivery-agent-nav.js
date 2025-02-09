import { loadRestaurantAddressAndUpdateInfo } from "./restaurent-address-info.js";


const nav = document.querySelector('.delivery-agent-nav');
let sideNavVisible = false;
function BigNav() {
    nav.innerHTML = ` 
    <div class="logo animationFirst">
        <img src="./assets/logo.png" alt="logo" class="yumzoom"> 
    </div>

     <div class="nav-icons animationFive">
      <i class="fas fa-user"></i>
      <a href=""><i class="fa-solid fa-gear"></i></a>
    </div>
    `;

    document.querySelector(".fa-user").addEventListener('click',()=>{
        console.log("hello")
        document.getElementById("addressAndInfo").classList.add("active");
        loadRestaurantAddressAndUpdateInfo();
        document.getElementById("overview").classList.remove("active");
        document.getElementById("orders").classList.remove("active");
    });
}

function SmallNav() {
    nav.innerHTML = ` 
        <a href="index.html" class="logo "><img src="./assets/logo.png" alt="logo"></a>

        <div class="nav-icons ">
            <i id="toggole-btn"class="fa-solid fa-bars"></i>
        </div>
        <div class="side-nav">
            <div class="side-nav-icons">
                <p><i class="fa-solid fa-gear"></i></p>
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

    document.querySelector(".fa-gear").addEventListener('click',()=>{
        document.getElementById("addressAndInfo").classList.add("active");
        loadRestaurantAddressAndUpdateInfo();
        document.getElementById("overview").classList.remove("active");
        document.getElementById("orders").classList.remove("active");
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
