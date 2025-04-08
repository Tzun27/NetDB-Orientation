import "./styles.css";
import {
  createNewProjectButton,
  createDialog,
  createListBox,
} from "./modules/todoLists.js";
import { createTaskDialog, createTaskItem } from "./modules/tasks.js";
import { storage } from "./modules/storage.js";

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
      listBox.querySelector(".list-box").click();

      // Clear the input for next time
      listDialog.querySelector("input").value = "";

      // Save to local storage
      storage.saveLists();
    }
  });

  /* Todo tasks functions */

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
          date: form.taskDate.value,
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
        form.taskDate.value = new Date().toISOString().split("T")[0];

        // Save to local storage
        storage.saveLists();
      }
    }
  });

  // Set up event delegation for task checkboxes and delete buttons
  rightSection.addEventListener("change", (e) => {
    if (e.target.classList.contains("task-checkbox")) {
      storage.saveLists();
    }
  });

  rightSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-task-button")) {
      storage.saveLists();
    }
  });

  // Load saved lists and tasks
  const savedLists = storage.loadLists();
  savedLists.forEach(list => {
    // Create list box
    const listBox = createListBox(list.name, rightSection);
    leftSection.insertBefore(listBox, newProjectButton);

    // Create tasks for this list
    const tabId = `tab-${list.name.replace(/\s+/g, "-").toLowerCase()}`;
    const tab = document.getElementById(tabId);
    const taskContainer = tab.querySelector(".task-container");

    list.tasks.forEach(taskData => {
      const taskItem = createTaskItem(taskData);
      if (taskData.completed) {
        taskItem.querySelector(".task-checkbox").checked = true;
      }
      taskContainer.appendChild(taskItem);
    });
  });

  // Activate the first list if there are any
  const firstListBox = document.querySelector(".list-box");
  if (firstListBox) {
    firstListBox.click();
  }
});
