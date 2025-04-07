// src/modules/todoLists.js
import { createListTab, showTab, createTaskDialog } from "./tasks.js";

export function createNewProjectButton() {
  const newProjectButton = document.createElement("button");
  newProjectButton.textContent = "New Project";
  newProjectButton.className = "new-project-button";
  return newProjectButton;
}

export function createDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "new-project-dialog";

  const form = document.createElement("form");
  form.method = "dialog";

  const label = document.createElement("label");
  label.textContent = "Enter List Name:";
  form.appendChild(label);

  const input = document.createElement("input");
  input.type = "text";
  input.name = "listName";
  form.appendChild(input);

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.value = "cancel";
  form.appendChild(cancelButton);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.value = "submit";
  form.appendChild(submitButton);

  dialog.appendChild(form);
  return dialog;
}

export function createListBox(listName, rightSection) {
  const listBox = document.createElement("div");
  listBox.textContent = listName;
  listBox.className = "list-box";

  // Create a unique ID for the tab
  const tabId = `tab-${listName.replace(/\s+/g, "-").toLowerCase()}`;

  // Create a new tab for this list if it doesn't exist
  if (!document.getElementById(tabId)) {
    const tab = createListTab(listName);
    rightSection.appendChild(tab);
  }

  // Set up click event to switch tabs
  listBox.addEventListener("click", () => {
    // Remove active class from all list boxes
    document.querySelectorAll(".list-box").forEach((box) => {
      box.classList.remove("active");
    });

    // Add active class to this list box
    listBox.classList.add("active");

    // Show this tab
    showTab(tabId);
  });

  return listBox;
}
