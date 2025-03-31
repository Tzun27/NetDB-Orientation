import "./styles.css";
alert("Hello! I am an alert box!");

// Tab Switching Logic
function clearContent() {
  const content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}
async function showTab(tabName) {
  try {
    clearContent();
    const module = await import(`./modules/${tabName}.js`);
    module.default();
  } catch (error) {
    console.error(`Error loading ${tabName} module:`, error);
  }
}

// Set up event listeners for tab buttons
document.addEventListener("DOMContentLoaded", () => {
  // Load home tab by default
  showTab("home");

  // Add click handlers to all tab buttons
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const tab = e.target.textContent.toLowerCase();
      showTab(tab);
    });
  });
});
