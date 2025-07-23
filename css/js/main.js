document.addEventListener("DOMContentLoaded", () => {
  console.log("Real Estate App Loaded ✅");

  // FILTER SYSTEM
  const typeSelect = document.getElementById("type");
  const statusSelect = document.getElementById("status");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const cards = document.querySelectorAll(".property-card");

  function filterListings() {
    const selectedType = typeSelect?.value || "all";
    const selectedStatus = statusSelect?.value || "all";
    const minPrice = parseFloat(minPriceInput?.value) || 0;
    const maxPrice = parseFloat(maxPriceInput?.value) || Infinity;

    cards.forEach(card => {
      const type = card.getAttribute("data-type");
      const status = card.getAttribute("data-status");
      const price = parseFloat(card.getAttribute("data-price")) || 0;

      const matchType = (selectedType === "all" || selectedType === type);
      const matchStatus = (selectedStatus === "all" || selectedStatus === status);
      const matchPrice = (price >= minPrice && price <= maxPrice);

      card.style.display = (matchType && matchStatus && matchPrice) ? "block" : "none";
    });
  }

  [typeSelect, statusSelect, minPriceInput, maxPriceInput].forEach(el => {
    if (el) el.addEventListener("input", filterListings);
  });

  // CART SYSTEM
  const cartCount = document.getElementById("cart-count");
  const cartItemsList = document.getElementById("cart-items");
  const cartToggle = document.getElementById("cart-toggle");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartClose = document.getElementById("cart-close");
  const cart = {};

  function updateCartUI() {
    cartItemsList.innerHTML = "";
    let total = 0;

    for (let item in cart) {
      const quantity = cart[item];
      total += quantity;

      const li = document.createElement("li");
      li.innerHTML = `
        ${item} (x${quantity})
        <button class="remove-item" data-name="${item}">❌</button>
      `;
      cartItemsList.appendChild(li);
    }

    cartCount.textContent = total;

    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        delete cart[name];
        updateCartUI();
      });
    });
  }

  document.querySelectorAll('.property-card a').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = e.target.closest('.property-card');
      const name = card.querySelector('h3')?.textContent || "Unknown Item";

      if (cart[name]) {
        cart[name]++;
      } else {
        cart[name] = 1;
      }

      updateCartUI();
      alert(`🛒 "${name}" added to cart!`);
    });
  });

  cartToggle?.addEventListener('click', () => {
    cartSidebar.style.right = '0';
  });

  cartClose?.addEventListener('click', () => {
    cartSidebar.style.right = '-100%';
  });

  updateCartUI();
});
