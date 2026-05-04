import { showToast } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  const currentOrder = JSON.parse(sessionStorage.getItem("currentOrder"));
  const cart = JSON.parse(localStorage.getItem("velora_cart") || "[]");
  const summaryContainer = document.querySelector(".summary-card");

  if (currentOrder && currentOrder.name && summaryContainer) {
    renderSummary([{ ...currentOrder, quantity: 1 }], currentOrder.price);
  } else if (cart.length > 0 && summaryContainer) {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    renderSummary(cart, subtotal);
  } else if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="empty-cart">
        <h3 class="serif mb-2">Your Cart is Empty</h3>
        <p class="mb-2">Choose a masterpiece from our collection to begin.</p>
        <a href="index.html#categories" class="btn btn-primary w-full text-center" style="display:block">Explore Collection</a>
      </div>
    `;
    const orderForm = document.getElementById("order-form");
    if (orderForm) {
      orderForm.style.opacity = "0.5";
      orderForm.style.pointerEvents = "none";
    }
  }

  function renderSummary(items, subtotal) {
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    summaryContainer.innerHTML = `
      <h3 class="serif mb-3">Order Summary</h3>
      <div class="checkout-items-list">
        ${items
          .map(
            (item) => `
          <div class="checkout-item">
            <div class="checkout-item-img-wrapper">
              <img src="${item.image}" alt="${item.name}">
              <span class="checkout-item-badge">${item.quantity}</span>
            </div>
            <div class="checkout-item-details">
              <p class="checkout-item-name">${item.name}</p>
              <p class="checkout-item-price">$${(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="summary-divider"></div>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${subtotal.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span class="text-success">Free</span>
      </div>
      <div class="summary-row">
        <span>Estimated Tax</span>
        <span>$${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-total-row">
        <span>Total</span>
        <span>$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="summary-secure-notice">
        <i data-lucide="shield-check"></i>
        <span>Encrypted & Secure</span>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
});

const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("currentOrder");
    localStorage.removeItem("velora_cart");
    document.getElementById("checkout-view").classList.add("no-display");
    document.getElementById("success-view").classList.remove("no-display");
    showToast("Order placed successfully!", "success");
    // Force top scroll for success view
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
