import "./styles.css";
import {
  createNewProjectButton,
  createDialog,
  createListBox,
} from "./modules/todoLists.js";
import { createTaskDialog, createTaskItem } from "./modules/tasks.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  // Create the banner
  const banner = document.createElement("div");
  banner.className = "banner";
  banner.textContent = "Todo List";
  app.appendChild(banner);

  // Create the bottom container
  const bottomContainer = document.createElement("div");
  bottomContainer.className = "bottom-container";
  app.appendChild(bottomContainer);

  // Create left section (lists of todos)
  const leftSection = document.createElement("div");
  leftSection.className = "left-section";
  bottomContainer.appendChild(leftSection);

  // Create right section (todo tasks)
  const rightSection = document.createElement("div");
  rightSection.className = "right-section";
  bottomContainer.appendChild(rightSection);

  /* List of todos functions */

  // Add the list dialog to the DOM
  const listDialog = createDialog();
  document.body.appendChild(listDialog);

  // Add the task dialog to the DOM
  const taskDialog = createTaskDialog();
  document.body.appendChild(taskDialog);

  // Create and add the new project button
  const newProjectButton = createNewProjectButton();
  leftSection.appendChild(newProjectButton);

  // Set up the button click event
  newProjectButton.addEventListener("click", () => {
    listDialog.showModal();
  });

  // Handle list dialog submission
  listDialog.addEventListener("close", () => {
    const listName = listDialog.querySelector("input").value;
    if (listDialog.returnValue === "submit" && listName.trim() !== "") {
      // Create a new list box
      const listBox = createListBox(listName, rightSection);

      // Insert the list box before the new project button
      leftSection.insertBefore(listBox, newProjectButton);

      // Activate this list box (simulate a click)
      listBox.click();

      // Clear the input for next time
      listDialog.querySelector("input").value = "";
    }
  });

  /* List of todos functions */

  // Set up event delegation for "New Task" buttons
  rightSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("new-task-button")) {
      // Store the current tab in the dialog's dataset
      const currentTab = e.target.closest(".list-tab");
      taskDialog.dataset.currentTabId = currentTab.id;

      // Show the task dialog
      taskDialog.showModal();
    }
  });

  // Handle task dialog submission
  taskDialog.addEventListener("close", () => {
    if (taskDialog.returnValue === "submit") {
      const form = taskDialog.querySelector("form");
      const taskName = form.taskName.value;

      if (taskName.trim() !== "") {
        const taskData = {
          name: taskName,
          description: form.taskDescription.value,
          priority: form.taskPriority.value,
        };

        // Create a new task item
        const taskItem = createTaskItem(taskData);

        // Get the current tab
        const currentTabId = taskDialog.dataset.currentTabId;
        const currentTab = document.getElementById(currentTabId);

        // Insert the task item before the new task button
        const taskContainer = currentTab.querySelector(".task-container");
        taskContainer.appendChild(taskItem);

        // Reset the form
        form.reset();
      }
    }
  });
});
