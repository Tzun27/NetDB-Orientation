import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  // Create title banner
  const banner = document.createElement("div");
  banner.className = "banner";
  banner.textContent = "Todo List";
  app.appendChild(banner);

  // Create the bottom container
  const bottomContainer = document.createElement("div");
  bottomContainer.className = "bottom-container";
  app.appendChild(bottomContainer);

  // Create left section (1 part)
  const leftSection = document.createElement("div");
  leftSection.className = "left-section";
  leftSection.textContent = "Left Section (1 part)";
  bottomContainer.appendChild(leftSection);

  // Create right section (5 parts)
  const rightSection = document.createElement("div");
  rightSection.className = "right-section";
  rightSection.textContent = "Right Section (5 parts)";
  bottomContainer.appendChild(rightSection);
});
