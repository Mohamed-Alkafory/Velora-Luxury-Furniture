import { showToast } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentOrder = JSON.parse(localStorage.getItem("currentOrder"));
  const summaryContainer = document.querySelector(".summary-card");

  if (currentOrder && summaryContainer) {
    const tax = currentOrder.price * 0.08;
    const total = currentOrder.price + tax;

    summaryContainer.innerHTML = `
      <img src="${currentOrder.image}" alt="${currentOrder.name}" class="summary-product-visual">
      <h3 class="serif mb-2">Order Summary</h3>
      <div class="summary-item">
        <span>${currentOrder.name}</span>
        <span>$${currentOrder.price.toLocaleString()}</span>
      </div>
      <div class="summary-item">
        <span>Shipping</span>
        <span>$0</span>
      </div>
      <div class="summary-item border-none">
        <span>Tax (8%)</span>
        <span>$${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="summary-total">
        <span>Total</span>
        <span>$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    `;
  } else if (!currentOrder) {
    // If somehow they got here without an order, redirect home
    window.location.href = "index.html";
  }
});

document.getElementById("order-form").addEventListener("submit", (e) => {
  e.preventDefault();
  localStorage.removeItem("currentOrder"); // Clear order on success
  document.getElementById("checkout-view").classList.add("no-display");
  document.getElementById("success-view").classList.remove("no-display");
  showToast("Order placed successfully!", "success");
});
