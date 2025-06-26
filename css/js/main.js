document.addEventListener("DOMContentLoaded", () => {
  console.log("DreamSpace Real Estate loaded 🏠");

  // LISTINGS FILTER LOGIC (previous code)...

  // STORE CART LOGIC
  const cartCount = document.getElementById("cart-count");
  const cartItemsList = document.getElementById("cart-items");
  const cartToggle = document.getElementById("cart-toggle");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartClose = document.getElementById("cart-close");
  const cart = [];

  function updateCartUI() {
    cartCount.textContent = cart.length;
    cartItemsList.innerHTML = cart.map(item => `<li>${item}</li>`).join("");
  }

  document.querySelectorAll('.property-card a').forEach(btn => {
    btn.addEventListener("click", e => {
      if (!btn.id) return;
      e.preventDefault();
      const card = e.target.closest(".property-card");
      const name = card.querySelector("h3").textContent;
      cart.push(name);
      updateCartUI();
      alert(`🛒 "${name}" added to cart!`);
    });
  });

  cartToggle && cartToggle.addEventListener("click", () => {
    cartSidebar.style.right = "0";
  });
  cartClose && cartClose.addEventListener("click", () => {
    cartSidebar.style.right = "-100%";
  });
  updateCartUI();
});
