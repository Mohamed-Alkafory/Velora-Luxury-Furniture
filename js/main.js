import auth from "./auth.js";

// --- Shared Components ---

/**
 * Initialize navbar behavior (scroll effect and auth status)
 */
const initNavbar = () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Update Auth status in Navbar
  const navActions = document.querySelector(".nav-actions");
  const user = auth.getCurrentUser();

  if (user && navActions) {
    navActions.innerHTML = `
      <span class="user-greeting">Hello, <strong>${user.name.split(" ")[0]}</strong></span>
      <button class="btn btn-outline" id="logout-btn" style="padding: 0.5rem 1rem">Logout</button>
    `;
    document.getElementById("logout-btn")?.addEventListener("click", auth.logout);
  }
};

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - "success" or "error"
 */
const showToast = (message, type = "success") => {
  const container = document.querySelector(".toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : "✕"}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

const createToastContainer = () => {
  const container = document.createElement("div");
  container.className = "toast-container";
  document.body.appendChild(container);
  return container;
};

// --- Protected Routes ---

const checkAuthProtection = () => {
  const protectedPages = ["order.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !auth.isLoggedIn()) {
    window.location.href = `signin.html?redirect=${currentPage}`;
  }
};

// --- Scroll Animations ---

const scrollObserver = {
  instance: null,

  init() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.instance = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          this.instance.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all existing elements
    document.querySelectorAll(".animate-fade-up").forEach((el) => {
      this.instance.observe(el);
    });
  },

  observe(elements) {
    if (!this.instance) this.init();
    elements.forEach((el) => this.instance.observe(el));
  },
};

// --- Dynamic Product Rendering ---

let hasOrderListener = false;

const renderProducts = (productArray, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = productArray
    .map((product, index) => {
      const delay = (index % 3) * 0.1;
      return `
      <div class="product-card animate-fade-up" style="transition-delay: ${delay}s">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <button class="add-to-cart-btn order-now-btn" data-product-id="${product.id}">Order Now</button>
        </div>
        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">$${product.price.toLocaleString()}</p>
        </div>
      </div>
    `;
    })
    .join("");

  // Observe newly added elements
  const newItems = container.querySelectorAll(".animate-fade-up");
  scrollObserver.observe(newItems);

  // Global listener for order buttons
  if (!hasOrderListener) {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("order-now-btn")) {
        const productId = parseInt(e.target.dataset.productId);
        const product = productArray.find((p) => p.id === productId);
        if (product) {
          localStorage.setItem("currentOrder", JSON.stringify(product));
          window.location.href = "order.html";
        }
      }
    });
    hasOrderListener = true;
  }
};

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  checkAuthProtection();
  scrollObserver.init();
});

export { showToast, renderProducts };
