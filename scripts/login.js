const welcome = document.querySelector(".welcome");
const welcomeLogin = document.querySelector(".welcome-login");
const form = document.querySelector("#form");


const signInHTML = `
    <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input type="email" id="email" name="email" class="form-input" required>
    </div>
    <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" name="password" class="form-input" required>
    </div>
    <button type="submit" class="submit-button">Sign In</button>
    <a href="#" class="forgot-password">Forgot your password?</a>
    <button id="createAccount" class="swith">or create an account</button>
`;

const signUpHTML = `
    <div class="user-type-container">
        <div class="user-type-option">
            <input type="radio" name="userType" id="user" value="user" class="user-type-input" checked>
            <label for="user" class="user-type-label">User</label>
        </div>
        <div class="user-type-option">
            <input type="radio" name="userType" id="restaurant" value="restaurant" class="user-type-input">
            <label for="restaurant" class="user-type-label">Restaurant</label>
        </div>
        <div class="user-type-option">
            <input type="radio" name="userType" id="deliveryman" value="deliveryman" class="user-type-input">
            <label for="deliveryman" class="user-type-label">Delivery</label>
        </div>
    </div>
    <div class="name-fields">
        <div class="form-group">
            <label for="userName" class="form-label">User Name</label>
            <input type="text" id="userName" name="userName" class="form-input" >
        </div>
        <div class="form-group">
            <label for="Name" class="form-label">Name</label>
            <input type="text" id="Name" name="Name" class="form-input" >
        </div>
    </div>
    <div class="form-group">
        <label for="email" class="form-label">Email Address</label>
        <input type="email" id="email" name="email" class="form-input" >
    </div>
    <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input type="password" id="password" name="password" class="form-input"  
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters">
    </div>
    <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" >
    </div>
    <div class="terms">
        <input type="checkbox" id="terms" name="terms" >
        <label for="terms">I agree to the <a href="">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
    </div>
    <button type="submit" class="submit-button">Create Account</button>
    <br>
    <br>
    <button class="swith" id="alreadyAccountIsthere">Already have an account ? Sign in</button>
`;

const logo = `
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 11h.01"></path>
    <path d="M11 15h.01"></path>
    <path d="M16 16h.01"></path>
    <path d="M2 16l20 6-6-20A20 20 0 0 0 2 16"></path>
</svg>`;

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
}

loadSignInForm();
