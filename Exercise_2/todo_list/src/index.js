import "./styles.css";
import {
  createNewProjectButton,
  createDialog,
  createListBox,
} from "./modules/todoLists.js";

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

  // Create left section (List of todos)
  const leftSection = document.createElement("div");
  leftSection.className = "left-section";
  bottomContainer.appendChild(leftSection);

  /* Todo lists functions */

  // Add the dialog to the DOM
  const dialog = createDialog();
  document.body.appendChild(dialog);

  // Create and add the new project button
  const newProjectButton = createNewProjectButton();
  leftSection.appendChild(newProjectButton);

  // Set up the button click event
  newProjectButton.addEventListener("click", () => {
    dialog.showModal();
  });

  // Handle dialog submission
  dialog.addEventListener("close", () => {
    const listName = dialog.querySelector("input").value;
    if (dialog.returnValue === "submit" && listName.trim() !== "") {
      // Create a new list box
      const listBox = createListBox(listName);

      // Insert the list box before the new project button
      leftSection.insertBefore(listBox, newProjectButton);

      // Clear the input for next time
      dialog.querySelector("input").value = "";
    }
  });

  // Create right section (Todos)
  const rightSection = document.createElement("div");
  rightSection.className = "right-section";
  rightSection.textContent = "Right Section (5 parts)";
  bottomContainer.appendChild(rightSection);
});
