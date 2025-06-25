document.addEventListener("DOMContentLoaded", () => {
  const typeSelect = document.getElementById("type");
  const statusSelect = document.getElementById("status");
  const minPriceInput = document.getElementById("minPrice");
  const maxPriceInput = document.getElementById("maxPrice");
  const cards = document.querySelectorAll(".property-card");

  function filterListings() {
    const selectedType = typeSelect.value;
    const selectedStatus = statusSelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    cards.forEach(card => {
      const type = card.getAttribute("data-type");
      const status = card.getAttribute("data-status");
      const price = parseFloat(card.getAttribute("data-price"));

      const matchType = (selectedType === "all" || selectedType === type);
      const matchStatus = (selectedStatus === "all" || selectedStatus === status);
      const matchPrice = (price >= minPrice && price <= maxPrice);

      card.style.display = (matchType && matchStatus && matchPrice) ? "block" : "none";
    });
  }

  [typeSelect, statusSelect, minPriceInput, maxPriceInput].forEach(el => {
    if (el) el.addEventListener("input", filterListings);
  });
});
