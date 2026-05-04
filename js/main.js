import auth from "./auth.js";
import { logoSVG } from "./components.js";

const injectLogos = () => {
  document.querySelectorAll(".logo").forEach((logo) => {
    if (!logo.querySelector("svg")) {
      logo.insertAdjacentHTML("afterbegin", logoSVG);
    }
  });
};

const initNavbar = async () => {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  });

  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  try {
    const user = await auth.getSessionUser();

    let cartLink = navActions.querySelector(".nav-icon-link");
    if (!cartLink) {
      cartLink = document.createElement("a");
      cartLink.href = "cart.html";
      cartLink.className = "nav-icon-link";
      cartLink.innerHTML = `
        <i data-lucide="shopping-bag" class="nav-icon"></i>
        <span class="cart-badge">0</span>
      `;
    }

    // Clear existing content but keep the cart icon
    navActions.innerHTML = "";
    navActions.appendChild(cartLink);

    if (user) {
      const firstName = user.name.split(" ")[0];
      const greetingSpan = document.createElement("span");
      greetingSpan.className = "user-greeting";
      greetingSpan.innerHTML = `Hello, <strong>${firstName}</strong>`;

      const logoutBtn = document.createElement("button");
      logoutBtn.className = "btn btn-outline nav-btn";
      logoutBtn.id = "logout-btn";
      logoutBtn.textContent = "Logout";
      logoutBtn.addEventListener("click", () => auth.logout());

      navActions.append(greetingSpan, logoutBtn);
    } else {
      const signinBtn = document.createElement("a");
      signinBtn.href = "signin.html";
      signinBtn.className = "btn btn-outline nav-btn";
      signinBtn.textContent = "Sign In";

      const signupBtn = document.createElement("a");
      signupBtn.href = "signup.html";
      signupBtn.className = "btn btn-primary nav-btn";
      signupBtn.textContent = "Join Us";

      navActions.append(signinBtn, signupBtn);
    }
  } catch (error) {
    console.error("Auth initialization failed:", error);
  } finally {
    navActions.classList.add("loaded");
    updateCartBadge();
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};

// Toast system
let toastContainer = null;

const getToastContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

const TOAST_ICONS = { success: "✓", error: "✕", info: "i" };
const TOAST_DURATION = 4000;

const showToast = (message, type = "success", subtitle = "") => {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const iconSpan = document.createElement("span");
  iconSpan.className = "toast-icon";
  iconSpan.textContent = TOAST_ICONS[type] ?? "i";

  const bodyDiv = document.createElement("div");
  bodyDiv.className = "toast-body";

  const messageSpan = document.createElement("span");
  messageSpan.className = "toast-message";
  messageSpan.textContent = message;
  bodyDiv.appendChild(messageSpan);

  if (subtitle) {
    const subtitleSpan = document.createElement("span");
    subtitleSpan.className = "toast-subtitle";
    subtitleSpan.textContent = subtitle;
    bodyDiv.appendChild(subtitleSpan);
  }

  const closeButton = document.createElement("button");
  closeButton.className = "toast-close";
  closeButton.setAttribute("aria-label", "Dismiss");
  closeButton.textContent = "×";

  toast.appendChild(iconSpan);
  toast.appendChild(bodyDiv);
  toast.appendChild(closeButton);

  const dismiss = () => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  };

  closeButton.addEventListener("click", dismiss);

  container.appendChild(toast);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => toast.classList.add("show")),
  );

  setTimeout(dismiss, TOAST_DURATION);
};

const checkAuthProtection = async () => {
  const protectedPages = ["order.html"];
  const currentPage = window.location.pathname.split("/").pop();

  if (protectedPages.includes(currentPage) && !(await auth.isLoggedIn())) {
    window.location.href = `signin.html?redirect=${currentPage}`;
  }
};

const scrollObserver = {
  instance: null,

  init() {
    this.instance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            this.instance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document.querySelectorAll(".animate-fade-up").forEach((el) => {
      this.instance.observe(el);
    });
  },

  observe(elements) {
    if (!this.instance) this.init();
    elements.forEach((el) => this.instance.observe(el));
  },
};

let hasOrderListener = false;
const productsById = new Map();

const renderProducts = (productArray, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  productArray.forEach((product) => {
    productsById.set(product.id, product);
  });

  container.innerHTML = productArray
    .map((product, index) => {
      const delay = (index % 3) * 0.1;
      return `
        <div class="product-card animate-fade-up" style="--delay: ${delay}s">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-footer">
              <p class="product-price">$${product.price.toLocaleString()}</p>
              <div class="product-cart-controls" data-product-id="${product.id}">
                ${getCartControls(product.id)}
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  if (window.lucide) window.lucide.createIcons();
  scrollObserver.observe(container.querySelectorAll(".animate-fade-up"));

  if (!window.hasCartListener) {
    document.addEventListener("click", (e) => {
      // Add to Cart
      const addBtn = e.target.closest(".btn-add-cart-initial");
      if (addBtn) {
        const id = parseInt(addBtn.dataset.id);
        const product = productsById.get(id);
        if (product) {
          addToCart(product);
          refreshCardControls(id);
        }
      }
      // Increase
      const incBtn = e.target.closest(".btn-qty-increase");
      if (incBtn) {
        const id = parseInt(incBtn.dataset.id);
        const product = productsById.get(id);
        if (product) {
          addToCart(product);
          refreshCardControls(id);
        }
      }
      // Decrease
      const decBtn = e.target.closest(".btn-qty-decrease");
      if (decBtn) {
        const id = parseInt(decBtn.dataset.id);
        decreaseCartItem(id);
        refreshCardControls(id);
      }
      // Delete
      const delBtn = e.target.closest(".btn-qty-delete");
      if (delBtn) {
        const id = parseInt(delBtn.dataset.id);
        removeFromCart(id);
        refreshCardControls(id);
      }
    });
    window.hasCartListener = true;
  }
};

const getCartControls = (productId) => {
  const cart = JSON.parse(localStorage.getItem("velora_cart") || "[]");
  const item = cart.find((i) => i.id === productId);
  if (item) {
    return `
      <div class="qty-controls">
        <button class="qty-btn btn-qty-decrease" data-id="${productId}">−</button>
        <span class="qty-count">${item.quantity}</span>
        <button class="qty-btn btn-qty-increase" data-id="${productId}">+</button>
        <button class="qty-btn qty-btn-delete btn-qty-delete" data-id="${productId}">Delete</button>
      </div>`;
  }
  return `<button class="btn-add-cart-initial" data-id="${productId}">Add to Cart</button>`;
};

const refreshCardControls = (productId) => {
  const ctrl = document.querySelector(
    `.product-cart-controls[data-product-id="${productId}"]`,
  );
  if (ctrl) ctrl.innerHTML = getCartControls(productId);
};

const addToCart = (product, silent = false) => {
  const cart = JSON.parse(localStorage.getItem("velora_cart") || "[]");
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("velora_cart", JSON.stringify(cart));
  updateCartBadge();
  if (!silent) showToast(`${product.name} added to cart`, "success");
};

const decreaseCartItem = (id) => {
  let cart = JSON.parse(localStorage.getItem("velora_cart") || "[]");
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  if (item.quantity <= 1) {
    cart = cart.filter((i) => i.id !== id);
  } else {
    item.quantity -= 1;
  }
  localStorage.setItem("velora_cart", JSON.stringify(cart));
  updateCartBadge();
};

const removeFromCart = (id) => {
  let cart = JSON.parse(localStorage.getItem("velora_cart") || "[]");
  cart = cart.filter((i) => i.id !== id);
  localStorage.setItem("velora_cart", JSON.stringify(cart));
  updateCartBadge();
};

const updateCartBadge = () => {
  const cart = JSON.parse(localStorage.getItem("velora_cart") || "[]");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-badge").forEach((el) => {
    el.textContent = count;
    el.setAttribute("data-count", count);
  });
};

const initApp = async () => {
  try {
    injectLogos();
    await checkAuthProtection();
    await initNavbar();
    scrollObserver.init();
    updateCartBadge();

    // Initialize Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    } else {
      // Retry Lucide after a short delay if it's not loaded yet
      setTimeout(() => {
        if (window.lucide) window.lucide.createIcons();
      }, 500);
    }
  } catch (err) {
    console.error("App initialization failed:", err);
  }
};

// Check if we are already in a DOMContentLoaded state
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

export { showToast, renderProducts, updateCartBadge };
