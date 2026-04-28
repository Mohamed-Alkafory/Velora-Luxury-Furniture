import { showToast } from "./main.js";

document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast(
    "Message sent successfully! Our team will contact you soon.",
    "success",
  );
  e.target.reset();
});
