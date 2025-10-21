document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const accessRestricted = document.getElementById("accessRestricted");

  // Function to close the popup
  function closePopup() {
    overlay.classList.add("hidden");
  }

  // Function to show access restricted message
  function showAccessRestricted() {
    accessRestricted.classList.add("show");
    // Optionally scroll the restricted message into view
    accessRestricted.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  // Yes button click handler - always closes the popup
  yesBtn.addEventListener("click", function () {
    closePopup();
  });

  // No button click handler - shows access restricted message
  noBtn.addEventListener("click", function () {
    showAccessRestricted();
  });

  // Optional: Close popup when clicking outside of it
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      // Only close if access restricted is not shown
      // This prevents accidental closing when user needs to see the warning
      if (!accessRestricted.classList.contains("show")) {
        closePopup();
      }
    }
  });

  // Optional: ESC key to close (only if access restricted is not shown)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !accessRestricted.classList.contains("show")) {
      closePopup();
    }
  });
});
