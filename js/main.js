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

  const user = await auth.getCurrentUser();
  if (user) {
    navActions.innerHTML = `
      <span class="user-greeting">Hello, <strong>${user.name.split(" ")[0]}</strong></span>
      <button class="btn btn-outline nav-btn" id="logout-btn">Logout</button>
    `;
    document
      .getElementById("logout-btn")
      ?.addEventListener("click", () => auth.logout());
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
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] ?? "i"}</span>
    <div class="toast-body">
      <span class="toast-message">${message}</span>
      ${subtitle ? `<span class="toast-subtitle">${subtitle}</span>` : ""}
    </div>
    <button class="toast-close" aria-label="Dismiss">&times;</button>
  `;

  const dismiss = () => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  };

  toast.querySelector(".toast-close").addEventListener("click", dismiss);

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

const renderProducts = (productArray, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = productArray
    .map((product, index) => {
      const delay = (index % 3) * 0.1;
      return `
        <div class="product-card animate-fade-up" style="--delay: ${delay}s">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
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

  scrollObserver.observe(container.querySelectorAll(".animate-fade-up"));

  if (!hasOrderListener) {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".order-now-btn");
      if (!btn) return;
      const product = productArray.find(
        (p) => p.id === parseInt(btn.dataset.productId),
      );
      if (product) {
        localStorage.setItem("currentOrder", JSON.stringify(product));
        window.location.href = "order.html";
      }
    });
    hasOrderListener = true;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  injectLogos();
  await checkAuthProtection();
  await initNavbar();
  scrollObserver.init();
});

export { showToast, renderProducts };
