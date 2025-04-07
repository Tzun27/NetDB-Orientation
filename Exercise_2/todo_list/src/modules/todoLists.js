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
  cancelButton.type = "button";
  // Add event listener to clear form and close dialog
  cancelButton.addEventListener("click", () => {
    form.reset();
    dialog.close("cancel");
  });
  form.appendChild(cancelButton);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.type = "submit";
  form.appendChild(submitButton);

  // Add form submit event listener for validation
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim() !== "") {
      dialog.close("submit");
    } else {
      alert("Please enter a list name");
    }
  });

  dialog.appendChild(form);
  return dialog;
}

export function createListBox(listName, rightSection) {
  const listBox = document.createElement("div");
  listBox.className = "list-box-container";

  // Create the actual list box for the name
  const nameBox = document.createElement("div");
  nameBox.textContent = listName;
  nameBox.className = "list-box";
  listBox.appendChild(nameBox);

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "×";
  deleteButton.className = "delete-list-button";
  deleteButton.title = "Delete list";
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the list box click

    // Confirm before deleting
    if (confirm(`Are you sure you want to delete the list "${listName}"?`)) {
      // Remove the tab associated with this list
      const tabId = `tab-${listName.replace(/\s+/g, "-").toLowerCase()}`;
      const tab = document.getElementById(tabId);
      if (tab) {
        tab.remove();
      }

      // Remove the list box itself
      listBox.remove();

      // If this was the active list, show another list if available
      if (nameBox.classList.contains("active")) {
        const firstListBox = document.querySelector(".list-box");
        if (firstListBox) {
          firstListBox.click();
        }
      }
    }
  });
  listBox.appendChild(deleteButton);

  // Create a unique ID for the tab
  const tabId = `tab-${listName.replace(/\s+/g, "-").toLowerCase()}`;

  // Create a new tab for this list if it doesn't exist
  if (!document.getElementById(tabId)) {
    const tab = createListTab(listName);
    rightSection.appendChild(tab);
  }

  // Set up click event to switch tabs (now on the nameBox)
  nameBox.addEventListener("click", () => {
    // Remove active class from all list boxes
    document.querySelectorAll(".list-box").forEach((box) => {
      box.classList.remove("active");
    });

    // Add active class to this list box
    nameBox.classList.add("active");

    // Show this tab
    showTab(tabId);
  });

  return listBox;
}
