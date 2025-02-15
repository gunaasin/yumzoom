import { cartAndOverviewSection } from "./customer-cart-overview.js";
import { parseJwt } from "./parseValue.js";
import { customerInformationSection } from "./customer-information.js";
import { customerOrderSection } from "./customer-orders.js";
import { renderAddressSection } from "./customer-address.js";

cartAndOverviewSection();
document.querySelector('.Overview').classList.add("active");

document.querySelectorAll(".Overview, .Settings, .Order, .Addresses").forEach(btn => {
    btn.addEventListener('click', (event) => {
        document.querySelectorAll(".Overview, .Settings, .Order, .Addresses").forEach(button => {
            button.classList.remove('active');
        });

        event.target.classList.add("active");
        if (event.target.classList.contains("Overview")) {
            cartAndOverviewSection();
        } else if (event.target.classList.contains("Settings")) {
            customerInformationSection();
        } else if (event.target.classList.contains("Order")) {
            customerOrderSection();
        } else if (event.target.classList.contains("Addresses")) {
            renderAddressSection();
        }
    })
})

const { email } = parseJwt();
document.querySelector(".user-email").innerHTML = email;
