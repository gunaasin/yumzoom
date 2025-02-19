import { loadRestaurantAddressAndUpdateInfo } from "./restaurent-address-info.js";


const nav = document.querySelector('.restaurant-nav');
let sideNavVisible = false;
function BigNav() {
    nav.innerHTML = ` 
    <div class="logo animationFirst">
        <img src="./assets/logo.png" alt="logo" class="yumzoom"> 
        <i class="fa-solid fa-xmark"></i>
        <h3 id="restaurant-name">YumZoom Restaurant</h3>
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


export function loadRestaurantName(name){
   try{
    document.getElementById('restaurant-name').innerHTML = name ? name : "YumZoom Restaurant";
   }catch(error){
    console.warn('Not for mobile');
   }
}

function SmallNav() {
    nav.innerHTML = ` 
        <a href="https://gunamurugesan.vercel.app/" class="logo "><img src="./assets/logo.png" alt="logo"></a>

        <div class="nav-icons ">
            <i id="toggole-btn"class="fa-solid fa-bars"></i>
        </div>
        <div class="side-nav">
            <div class="side-nav-icons">
                <p><i class="fa-solid fa-gear"></i></p>
            </div>

              <div class="side-nav-links">
                <a href="" class="">Home</a>
                <a href="" class="">Address</a>
                <a href="" class="">Orders</a>
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
