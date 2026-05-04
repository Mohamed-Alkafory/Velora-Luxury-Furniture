import { updateCartBadge, showToast } from "./main.js";

const getCart = () => JSON.parse(localStorage.getItem("velora_cart") || "[]");

const saveCart = (cart) => {
  localStorage.setItem("velora_cart", JSON.stringify(cart));
};

const render = () => {
  const cartContent = document.getElementById("cart-content");
  if (!cartContent) return;

  const cart = getCart();

  // If cart is empty, show empty state immediately
  if (!cart || cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-cart-state animate-fade-up visible">
        <div class="empty-icon">
          <i data-lucide="shopping-bag"></i>
        </div>
        <h2>Your cart is empty</h2>
        <p>Explore our collections and discover handcrafted pieces that transform your living space.</p>
        <a href="index.html#categories" class="btn btn-primary">Browse Collections</a>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    updateCartBadge();
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartContent.innerHTML = `
    <div class="cart-layout">
      <div class="cart-items-list">
        <div class="cart-items-header">
          <h2>Your Selections</h2>
          <span class="cart-items-count">${itemCount} ${itemCount === 1 ? "item" : "items"}</span>
        </div>
        ${cart
          .map(
            (item) => `
          <div class="cart-item animate-fade-up visible">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <span class="cart-item-category">${item.category}</span>
              <h3>${item.name}</h3>
              <p class="cart-item-price">$${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="cart-item-qty">
              <button class="cart-qty-btn" data-id="${item.id}" data-action="minus">−</button>
              <span class="cart-qty-count">${item.quantity}</span>
              <button class="cart-qty-btn" data-id="${item.id}" data-action="plus">+</button>
            </div>
            <button class="cart-remove-btn" data-id="${item.id}" title="Remove item">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        `,
          )
          .join("")}
      </div>

      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})</span>
          <span>$${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span class="text-success">Complimentary</span>
        </div>
        <div class="summary-row">
          <span>Estimated Tax</span>
          <span>$${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <hr class="summary-divider">
        <div class="summary-total-row">
          <span>Total</span>
          <span>$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <button id="checkout-btn" class="btn-checkout">Proceed to Checkout</button>
        <a href="index.html" class="btn-continue-shopping">Continue Shopping</a>
        <div class="summary-secure">
          <i data-lucide="lock"></i>
          <span>Secure checkout guaranteed</span>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  updateCartBadge();
};

// Global click delegation
document.addEventListener("click", (e) => {
  const cart = getCart();

  // Quantity adjustments
  const qtyBtn = e.target.closest(".cart-qty-btn");
  if (qtyBtn) {
    const id = parseInt(qtyBtn.dataset.id);
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    if (qtyBtn.dataset.action === "plus") {
      item.quantity += 1;
      saveCart(cart);
      showToast(`Updated ${item.name}`, "info");
    } else {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        saveCart(cart.filter((i) => i.id !== id));
        showToast(`Removed ${item.name}`, "info");
      } else {
        saveCart(cart);
        showToast(`Updated ${item.name}`, "info");
      }
    }
    render();
    return;
  }

  // Removal
  const removeBtn = e.target.closest(".cart-remove-btn");
  if (removeBtn) {
    const id = parseInt(removeBtn.dataset.id);
    const item = cart.find((i) => i.id === id);
    const updatedCart = cart.filter((i) => i.id !== id);
    saveCart(updatedCart);
    if (item) showToast(`Removed ${item.name}`, "info");
    render();
    return;
  }

  // Checkout
  if (e.target.closest("#checkout-btn")) {
    window.location.href = "order.html";
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", render);
} else {
  render();
}
