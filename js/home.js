import { products } from "./products.js";
import { renderProducts } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products, "featured-product-grid");
});
