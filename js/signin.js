import auth from "./auth.js";
import { showToast } from "./main.js";

const signinForm = document.getElementById("signin-form");

signinForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const result = auth.login(email, password);
  if (result.success) {
    showToast(result.message, "success");

    // Get redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect") || "index.html";

    setTimeout(() => (window.location.href = redirect), 1200);
  } else {
    showToast(result.message, "error");
  }
});
