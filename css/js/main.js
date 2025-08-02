// Initialize Firebase (Ensure scripts are loaded in HTML)
const firebaseConfig = {
  apiKey: "AIzaSyAAoPIw61ZsZB8C7zH4183yWUqh44uwbgA",
  authDomain: "dreamspace-8f29c.firebaseapp.com",
  projectId: "dreamspace-8f29c",
  storageBucket: "dreamspace-8f29c.firebasestorage.app",
  messagingSenderId: "828857686522",
  appId: "1:828857686522:web:35af98d58532393029ac43",
  measurementId: "G-VQE70BBCFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 DreamSpace Main JS Loaded");

  // ========= LISTINGS FILTER ========= //
  const typeSelect = document.getElementById("type");
  const statusSelect = document.getElementById("status");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const cards = document.querySelectorAll(".property-card");

  function filterListings() {
    const selectedType = typeSelect?.value.toLowerCase() || "all";
    const selectedStatus = statusSelect?.value.toLowerCase() || "all";
    const minPrice = parseFloat(minPriceInput?.value) || 0;
    const maxPrice = parseFloat(maxPriceInput?.value) || Infinity;

    cards.forEach(card => {
      const type = card.getAttribute("data-type")?.toLowerCase();
      const status = card.getAttribute("data-status")?.toLowerCase();
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
  const checkoutBtn = document.getElementById('checkout-btn');
  const orderStatus = document.getElementById('order-status');

  const cart = {};

  function updateCartUI() {
    if (!cartItemsList || !cartCount) return;
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

  // Add to cart
  document.querySelectorAll(".property-card a, .add-to-cart").forEach(btn => {
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
    if (cartSidebar) cartSidebar.style.right = "0";
  });
  cartClose?.addEventListener("click", () => {
    if (cartSidebar) cartSidebar.style.right = "-100%";
  });
  updateCartUI();

  // ========= FIRESTORE ORDER SUBMIT ========= //
  checkoutBtn?.addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
      if (orderStatus) orderStatus.textContent = '❌ Cart is empty!';
      return;
    }

    const order = {
      items: Object.entries(cart).map(([name, qty]) => ({ name, qty })),
      createdAt: new Date(),
    };

    db.collection('orders').add(order)
      .then(() => {
        if (orderStatus) orderStatus.textContent = '✅ Order submitted successfully!';
        for (let key in cart) delete cart[key];
        updateCartUI();
      })
      .catch(err => {
        console.error(err);
        if (orderStatus) orderStatus.textContent = '❌ Failed to submit order.';
      });
  });

  // ========= BLOG / CONSULTING ARTICLES ========= //
  const blogList = document.getElementById("blog-list");
  const categoryFilter = document.getElementById("categoryFilter");
  const modal = document.getElementById("blog-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  let articles = [];

  if (blogList) {
    db.collection("blogs").get().then(sn => {
      articles = sn.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderArticles("all");
    });

    categoryFilter?.addEventListener("change", () => {
      renderArticles(categoryFilter.value);
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
            <a href="#" class="read-more" data-id="${article.id}">Read More</a>
          </div>
        `;
        blogList.appendChild(div);
      });

      document.querySelectorAll(".read-more").forEach(link => {
        link.addEventListener("click", e => {
          e.preventDefault();
          const id = link.dataset.id;
          const article = articles.find(a => a.id === id);
          modalTitle.textContent = article.title;
          modalBody.textContent = article.content;
          if (modal) modal.style.display = "block";
        });
      });
    }

    modalClose?.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (modal && e.target === modal) modal.style.display = "none";
    });
  }
});
