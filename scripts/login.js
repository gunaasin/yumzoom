const welcome = document.querySelector(".welcome");
const welcomeLogin = document.querySelector(".welcome-login");
const form = document.querySelector("#form");
import API from "./end-point.js";
import {showNotification} from "./notification.js";
import { parseJwt } from "./parseValue.js";

const signInHTML = `
    <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input type="email" id="email" name="email" class="form-input" required>
    </div>
    <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" name="password" class="form-input" required>
    </div>
    <button id="signin" class="submit-button" type="button">Sign In</button>
    <a href="#" class="forgot-password">Forgot your password?</a>
    <button id="createAccount" class="swith">Create an account</button>
`;

const signUpHTML = `
    <div class="user-type-container">
        <div class="user-type-option">
            <input type="radio" name="userType" id="user" value="CUSTOMER" class="user-type-input" checked>
            <label for="user" class="user-type-label">Customer</label>
        </div>
        <div class="user-type-option">
            <input type="radio" name="userType" id="restaurant" value="RESTAURANT" class="user-type-input">
            <label for="restaurant" class="user-type-label">Restaurant</label>
        </div>
        <div class="user-type-option">
            <input type="radio" name="userType" id="deliveryman" value="DELIVERY_AGENT" class="user-type-input">
            <label for="deliveryman" class="user-type-label">Delivery Agent</label>
        </div>
    </div>
    <div class="name-fields">
        <div class="form-group">
            <label for="userName" class="form-label">User Name</label>
            <input type="text" required id="userName" name="userName" class="form-input" >
        </div>
        <div class="form-group">
            <label for="Name" class="form-label">Name</label>
            <input type="text"  required id="Name" name="Name" class="form-input" >
        </div>
    </div>
    <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input type="email" required id="email" name="email" class="form-input" >
    </div>
        <div class="form-group">
        <label for="mobile" class="form-label">Mobile</label>
        <input type="tel" required id="mobile" name="mobile" class="form-input" >
    </div>
    <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" required id="password" name="password" class="form-input"  
                
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters">
    </div>
    <div class="terms">
        <input type="checkbox"  required id="terms" name="terms" >
        <label for="terms">I agree to the <a href="">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
    </div>
    <button id="signup" class="submit-button" type="button">Create Account</button>
    <br>
    <br>
    <button class="swith already" id="alreadyAccountIsthere">Already have an account ? Sign in</button>
`;

const logo = `
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 11h.01"></path>
    <path d="M11 15h.01"></path>
    <path d="M16 16h.01"></path>
    <path d="M2 16l20 6-6-20A20 20 0 0 0 2 16"></path>
</svg>`;


// pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 

function loadSignInForm() {
    welcome.innerHTML = "Welcome Back";
    welcomeLogin.innerHTML = "Sign in to continue";
    form.innerHTML = signInHTML;

    const createAccount = document.getElementById("createAccount");
    if (createAccount) {
        createAccount.addEventListener("click", () => {
            loadSignUpForm();
        });
    }


    const signinBTN = document.getElementById("signin");
    signinBTN.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password= document.getElementById('password').value;
        const signupdata = {
            email,
            password
        }

        async function postSignIn(signupdata) {
            signinBTN.innerHTML = "";
            signinBTN.innerHTML = `<div class="loader"/>`;
            try{
                const response = await fetch(`${API}/signin`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(signupdata)
                });

                if(!response.ok){
                    showNotification("Enter correct Credentials !!")
                }
                const data = await response.json();
                if(!response.ok){
                    showNotification(data.message);
                    return;
                }else{
                    signinBTN.innerHTML = "Sign in";
                    signinBTN.innerHTML = "";
                    localStorage.setItem("key", JSON.stringify(data));
                    const {role} = parseJwt();
                    if(role==="RESTAURANT"){
                        
                        window.location="/restaurant";
                    }else if(role==="DELIVERY_AGENT"){
                        window.location="/agent";
                    }else{
                        window.location="/home";
                    }
                }

            }catch(error){
               throw new Error("wrong credentials");
            }
        }

        postSignIn(signupdata);
    })



}

function loadSignUpForm() {
    welcome.innerHTML = "Welcome";
    welcomeLogin.innerHTML = "Create an account";
    form.innerHTML = signUpHTML;

    const alreadyAccountIsthere = document.getElementById("alreadyAccountIsthere");
    if (alreadyAccountIsthere) {
        alreadyAccountIsthere.addEventListener("click", () => {
            loadSignInForm();
        });
    }

    function getSelectedUserType() {
        return document.querySelector('input[name="userType"]:checked').value;
    }

    getSelectedUserType();
    const radioButtons = document.querySelectorAll('input[name="userType"]');
    radioButtons.forEach(radio => { radio.addEventListener('change', getSelectedUserType); });

    const signUPBTN  = document.getElementById("signup");
    signUPBTN.addEventListener("click", (event) => {
     
        event.preventDefault(); 
        const role = getSelectedUserType();
        const username = document.getElementById("userName").value;
        const name = document.getElementById("Name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("mobile").value;
        const password = document.getElementById("password").value;
        const signupData = {
            name,
            username,
            password,
            email,
            phone,
            role
        };
        async function postSignUp(signupData) {
            signUPBTN.innerText = "";
            signUPBTN.innerHTML = `<div class="loader"/>`;
            try {
                const response = await fetch(`${API}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(signupData)
                });
                if (!response.ok) {
                    throw new Error("sumthing wrong");
                }else{
                    signUPBTN.innerHTML = "";
                    signUPBTN.innerText = "signUp" ;
                    loadSignInForm();
                }

                return await response.json();
            } catch (error) {
                console.error(error, "in post sing in");
            }
        }
        postSignUp(signupData).then((res)=>{
            showNotification(res.message);
        }).catch((error)=>{
            console.log(error);
        })
    })
}

loadSignInForm();

const loginBtn = document.getElementById('loginBtn');
const loginPopup = document.getElementById('loginPopup');


loginBtn.addEventListener("click", () => {
    loginPopup.style.display = 'flex';
});

window.addEventListener("click", (event) => {
    if (event.target === loginPopup) {
        loginPopup.style.display = 'none';
    }
});
