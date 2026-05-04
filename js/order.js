import { showToast } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
  const summaryContainer = document.querySelector(".summary-card");

  if (currentOrder && currentOrder.name && summaryContainer) {
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
  } else if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="empty-cart">
        <h3 class="serif mb-2">Your Cart is Empty</h3>
        <p class="mb-2">Choose a masterpiece from our collection to begin.</p>
        <a href="index.html#featured" class="btn btn-primary w-full">Explore Collection</a>
      </div>
    `;
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
      orderForm.style.opacity = "0.5";
      orderForm.style.pointerEvents = "none";
    }
  }
});

const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("currentOrder");
    document.getElementById("checkout-view").classList.add("no-display");
    document.getElementById("success-view").classList.remove("no-display");
    showToast("Order placed successfully!", "success");
  });
}
