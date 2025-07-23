document.addEventListener("DOMContentLoaded", () => {
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
      const name = card.querySelector('h3').textContent;

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
