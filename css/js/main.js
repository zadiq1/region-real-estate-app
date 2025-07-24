document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DreamSpace System Loaded");

  // ========= LISTINGS FILTER ========= //
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

      const matchType = selectedType === "all" || selectedType === type;
      const matchStatus = selectedStatus === "all" || selectedStatus === status;
      const matchPrice = price >= minPrice && price <= maxPrice;

      card.style.display = (matchType && matchStatus && matchPrice) ? "block" : "none";
    });
  }

  [typeSelect, statusSelect, minPriceInput, maxPriceInput].forEach(el => {
    el?.addEventListener("input", filterListings);
  });

  // ========= MOBILE NAVIGATION ========= //
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  menuToggle?.addEventListener("click", () => {
    nav.classList.toggle("mobile-hidden");
  });

  // ========= CART SYSTEM ========= //
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

  document.querySelectorAll(".property-card a").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const card = e.target.closest(".property-card");
      const name = card.querySelector("h3")?.textContent || "Item";

      cart[name] = (cart[name] || 0) + 1;
      updateCartUI();
      alert(`🛒 "${name}" added to cart!`);
    });
  });

  cartToggle?.addEventListener("click", () => {
    cartSidebar.style.right = "0";
  });

  cartClose?.addEventListener("click", () => {
    cartSidebar.style.right = "-100%";
  });

  updateCartUI();

  // ========= BLOG / CONSULTING ARTICLES ========= //
  const blogList = document.getElementById("blog-list");
  const categoryFilter = document.getElementById("categoryFilter");
  const modal = document.getElementById("blog-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  let articles = [];

  if (blogList) {
    fetch("data/articles.json")
      .then(res => res.json())
      .then(data => {
        articles = data;
        renderArticles("all");
      });

    categoryFilter?.addEventListener("change", () => {
      const cat = categoryFilter.value;
      renderArticles(cat);
    });

    function renderArticles(category) {
      blogList.innerHTML = "";

      articles.filter(article => {
        return category === "all" || article.category === category;
      }).forEach(article => {
        const div = document.createElement("div");
        div.className = "property-card";
        div.innerHTML = `
          <img src="${article.image}" alt="${article.title}" />
          <div class="property-card-content">
            <h3>${article.title}</h3>
            <p>${article.intro}</p>
            <a href="#" class="read-more" data-title="${article.title}">Read More</a>
          </div>
        `;
        blogList.appendChild(div);
      });

      document.querySelectorAll(".read-more").forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
          const title = link.getAttribute("data-title");
          const article = articles.find(a => a.title === title);
          modalTitle.textContent = article.title;
          modalBody.textContent = article.content;
          modal.style.display = "block";
        });
      });
    }

    modalClose?.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
});
