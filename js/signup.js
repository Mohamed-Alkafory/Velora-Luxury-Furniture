import auth from "./auth.js";
import { showToast } from "./main.js";

const passwordInput = document.getElementById("password");
const strengthContainer = document.getElementById("strength-container");
const signupForm = document.getElementById("signup-form");

// Password strength listener
if (passwordInput && strengthContainer) {
  passwordInput.addEventListener("input", (e) => {
    const strength = auth.checkPasswordStrength(e.target.value);
    strengthContainer.className = `password-strength-container strength-${strength}`;

    const texts = ["Very Weak", "Weak", "Medium", "Strong", "Excellent"];
    strengthContainer.querySelector(".strength-text").innerText =
      `Strength: ${texts[strength]}`;
  });
}

// Form submission
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: passwordInput.value,
    };

    if (passwordInput.value.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    const result = auth.register(userData);
    if (result.success) {
      showToast(result.message, "success");
      setTimeout(() => (window.location.href = "signin.html"), 1500);
    } else {
      showToast(result.message, "error");
    }
  });
}
