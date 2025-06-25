document.addEventListener("DOMContentLoaded", () => {
  console.log("Region Real Estate loaded 🏠");

  const typeSelect = document.getElementById("type");
  const statusSelect = document.getElementById("status");
  const cards = document.querySelectorAll(".property-card");

  function filterListings() {
    const selectedType = typeSelect.value;
    const selectedStatus = statusSelect.value;

    cards.forEach(card => {
      const type = card.getAttribute("data-type");
      const status = card.getAttribute("data-status");

      const matchType = (selectedType === "all" || selectedType === type);
      const matchStatus = (selectedStatus === "all" || selectedStatus === status);

      card.style.display = (matchType && matchStatus) ? "block" : "none";
    });
  }

  if (typeSelect && statusSelect) {
    typeSelect.addEventListener("change", filterListings);
    statusSelect.addEventListener("change", filterListings);
  }
});
