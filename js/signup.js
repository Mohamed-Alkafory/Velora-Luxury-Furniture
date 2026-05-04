import auth from "./auth.js";
import { showToast } from "./main.js";

const signupForm = document.getElementById("signup-form");
const passwordInput = document.getElementById("password");
const strengthContainer = document.getElementById("strength-container");

const STRENGTH_LABELS = ["Very Weak", "Weak", "Medium", "Strong", "Excellent"];

if (passwordInput && strengthContainer) {
  passwordInput.addEventListener("input", () => {
    const strength = auth.checkPasswordStrength(passwordInput.value);
    strengthContainer.className = `password-strength-container strength-${strength}`;
    strengthContainer.querySelector(".strength-text").textContent =
      `Strength: ${STRENGTH_LABELS[strength]}`;
  });
}

if (signupForm) {
  const submitBtn = signupForm.querySelector("[type=submit]");

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.textContent = loading ? "Creating account..." : "Create Account";
  };

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (!name || !email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    setLoading(true);

    const result = await auth.register({ name, email, password });

    if (result.success) {
      showToast(result.message, "success", "Redirecting to sign in...");
      setTimeout(() => (window.location.href = "signin.html"), 1500);
    } else {
      showToast(result.message, "error");
      setLoading(false);
    }
  });
}
