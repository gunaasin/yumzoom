import API from "./end-point.js";
import { showNotification } from "./notification.js";
import { parseJwt } from "./parseValue.js";

export function customerInformationSection() {

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../styles/customer-info.css";
    document.head.appendChild(link);

    function renderSetting(response) {
        const settingAndInfoHTMl = `
        <h1>Settings and Security</h1>
        <div class="security-container">
            <div class="security-section">
                <div class="section-header">
                    <div class="information">
                        <h2>Name</h2>
                        <span class="value" id="nameValue">${response.name}</span>
                    </div>
                    <button class="edit-btn" data-field="name">Edit</button>
                </div>
                <div class="edit-form" id="nameForm" style="display: none;">
                    <input type="text" id="nameInput" value="${response.name}" class="edit-input">
                    <div class="button-group">
                        <button class="save-btn" data-field="name">Save Changes</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>

            <div class="security-section">
                <div class="section-header">
                    <div class="information">
                        <h2>Email</h2>
                        <span class="value" id="emailValue" style="display: inline;">${response.email}</span>
                        <p class="description" style="display: none;" id="emailDescription">For stronger account security, add your email. If
                            there's an unusual sign-in, we'll email you and verify that it's really you.</p>
                    </div>
                    <button class="edit-btn" data-field="email">Edit</button>
                </div>
                <div class="edit-form" id="emailForm" style="display: none;">
                    <input type="email" id="emailInput" value="${response.email}" placeholder="Enter your email" class="edit-input">
                    <div class="button-group">
                        <button class="save-btn" data-field="email">Save Changes</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>

            <div class="security-section">
                <div class="section-header">
                    <div class="information">
                        <h2>Primary mobile number</h2>
                        <span class="value" id="phoneValue">${response.phone}</span>
                        <p class="description">Easily recover passwords and receive security
                            notifications with this mobile number.</p>
                    </div>

                    <button class="edit-btn" data-field="phone">Edit</button>
                </div>
                <div class="edit-form" id="phoneForm" style="display: none;">
                    <input type="tel" id="phoneInput" value="" class="edit-input">
                    <div class="button-group">
                        <button class="save-btn" data-field="phone">Save Changes</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>

            <div class="security-section">
                <div class="section-header">
                    <div class="information">
                        <h2>Password</h2>
                        <span class="value">••••••••</span>
                    </div>
                    <button class="edit-btn" data-field="password">Edit</button>
                </div>
                <div class="edit-form" id="passwordForm" style="display: none;">
                    <input type="password" placeholder="Current password" class="edit-input">
                    <input type="password" placeholder="New password" class="edit-input">
                    <input type="password" placeholder="Confirm new password" class="edit-input">
                    <div class="button-group">
                        <button class="save-btn" data-field="password">Save Changes</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>

            <div class="security-section">
                <div class="section-header">
                    <div class="information">
                        <h2>2-step verification</h2>
                        <p class="description">Add a layer of security. Require a code in addition to your password.</p>
                    </div>

                    <button class="edit-btn" data-field="2step">Turn on</button>
                </div>
            </div>

            <div class="security-section">
                <div class="section-header">
                    <div class="information">
                        <h2>Compromised account?</h2>
                        <p class="description">Take steps like changing your password and signing out everywhere.</p>
                    </div>

                    <button class="edit-btn" data-field="compromised">Start</button>
                </div>
            </div>
        </div>`

        mainContent.innerHTML = settingAndInfoHTMl;

        function toggleForm(formId, show) {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = show ? 'block' : 'none';
            }
        }

        function getSectionTitle(element) {
            const header = element.closest('.section-header');
            if (header) {
                const h2 = header.querySelector('h2');
                return h2 ? h2.textContent : 'section';
            }
            return 'section';
        }
        
        function updateFieldValue(field, value) {
            const valueSpan = document.getElementById(`${field}Value`);
            const description = document.getElementById(`${field}Description`);
            const button = document.querySelector(`[data-field="${field}"]`);

            if (field === 'email') {
                if (value && value.trim() !== '') {
                   
                    if (valueSpan) {
                        valueSpan.textContent = value;
                        valueSpan.style.display = 'inline';
                    }
                    if (description) {
                        description.style.display = 'none';
                    }
                    if (button) {
                        button.textContent = 'Edit';
                        button.className = 'edit-btn';
                    }
                } else {
                  
                    if (valueSpan) {
                        valueSpan.style.display = 'none';
                    }
                    if (description) {
                        description.style.display = 'block';
                    }
                    if (button) {
                        button.textContent = 'Add';
                        button.className = 'add-btn';
                    }
                }
            } else if (valueSpan) {
                valueSpan.textContent = value;
            }
        }
        function validateInput(field, value) {
            if (!value || value.trim() === '') {
                return false;
            }

            switch (field) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value);
                case 'phone':
                    const phoneRegex = /[\d\s-]{10,}$/;
                    return phoneRegex.test(value);
                case 'password':
                    return value.length >= 6;
                default:
                    return value.trim().length > 0;
            }
        }

        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.textContent;
                const section = getSectionTitle(e.target);
                const field = e.target.dataset.field;

                if (e.target.classList.contains('edit-btn') || e.target.classList.contains('add-btn')) {
                    toggleForm(`${field}Form`, true);
                    const input = document.getElementById(`${field}Input`);
                    const valueSpan = document.getElementById(`${field}Value`);
                    if (input && valueSpan && valueSpan.style.display !== 'none') {
                        input.value = valueSpan.textContent;
                    }
                } else if (e.target.classList.contains('cancel-btn')) {
                    const form = e.target.closest('.edit-form');
                    form.style.display = 'none';
                } else if (e.target.classList.contains('save-btn')) {

                    const form = e.target.closest('.edit-form');
                    const inputs = form.querySelectorAll('input');
                    const field = e.target.dataset.field;
                    if (field === 'password') {
                        const [currentPassword, newPassword, confirmPassword] = Array.from(inputs).map(input => input.value);

                        if (newPassword !== confirmPassword) {
                            showNotification('New passwords do not match');
                            return;
                        }

                        if (!validateInput('password', newPassword)) {
                            showNotification('Password must be at least 6 characters long');
                            return;
                        }

                        updateFieldValue('password', '••••••••');
                    } else {
                        const input = inputs[0];
                        if (!validateInput(field, input.value)) {
                            showNotification(`Please enter a valid ${field}`);
                            return;
                        }

                        updateFieldValue(field, input.value);
                    }

                    form.style.display = 'none';
                    showNotification(`Changed ${section}`);
                } else {
                    showNotification(`${action} clicked for ${section}`);
                }
            });
        });

        document.querySelectorAll('.security-section').forEach(section => {
            section.addEventListener('mouseenter', () => {
                section.style.backgroundColor = '#f7fafa';
            });

            section.addEventListener('mouseleave', () => {
                section.style.backgroundColor = 'transparent';
            });
        });
    }

    const mainContent = document.querySelector(".main-content");
    const { token } = parseJwt();


    async function getCustomerInformation() {
        try {
            const response = await fetch(`${API}/customer/getinfo?token=${token}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (!response.ok) {
                showNotification("Nothing to say");
                window.location = '/';
            }
            const result = await response.json();
            renderSetting(result);

        } catch (error) {
            showNotification(error);
        }
    }
    getCustomerInformation();
}