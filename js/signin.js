import auth from "./auth.js";
import { showToast } from "./main.js";

const signinForm = document.getElementById("signin-form");
if (!signinForm) throw new Error("signin-form not found");

const submitBtn = signinForm.querySelector("[type=submit]");

const setLoading = (loading) => {
  submitBtn.disabled = loading;
  submitBtn.textContent = loading ? "Signing in..." : "Sign In";
};

signinForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }

  setLoading(true);

  const result = await auth.login(email, password);

  const ALLOWED_REDIRECTS = ["index.html", "order.html", "contact.html"];

  if (result.success) {
    showToast(result.message, "success");
    const raw = new URLSearchParams(window.location.search).get("redirect");
    const redirect = ALLOWED_REDIRECTS.includes(raw) ? raw : "index.html";
    setTimeout(() => (window.location.href = redirect), 1200);
  } else {
    showToast(result.message, "error");
    setLoading(false);
  }
});
