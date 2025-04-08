import { format, parse, isValid } from "date-fns";
import { storage } from "./storage.js";

// Create the new task button
export function createNewTaskButton() {
  const newTaskButton = document.createElement("button");
  newTaskButton.textContent = "New Task";
  newTaskButton.className = "new-task-button";
  return newTaskButton;
}

// Create the task dialog
export function createTaskDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "new-task-dialog";

  const form = document.createElement("form");
  form.method = "dialog";

  // Task name input
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Task Name:";
  form.appendChild(nameLabel);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.name = "taskName";
  //nameInput.required = true;
  form.appendChild(nameInput);

  // Task description input
  const descLabel = document.createElement("label");
  descLabel.textContent = "Description:";
  form.appendChild(descLabel);

  const descInput = document.createElement("textarea");
  descInput.name = "taskDescription";
  descInput.rows = 3;
  form.appendChild(descInput);

  // Date input
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Due Date:";
  form.appendChild(dateLabel);

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.name = "taskDate";
  dateInput.value = new Date().toISOString().split("T")[0]; // Set default to today
  form.appendChild(dateInput);

  // Priority dropdown
  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priority:";
  form.appendChild(priorityLabel);

  const prioritySelect = document.createElement("select");
  prioritySelect.name = "taskPriority";

  const priorities = [
    { value: "high", text: "High" },
    { value: "medium", text: "Medium" },
    { value: "low", text: "Low" },
  ];

  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority.value;
    option.textContent = priority.text;
    prioritySelect.appendChild(option);
  });

  form.appendChild(prioritySelect);

  // Buttons container
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.type = "button"; // Change to type="button"
  cancelButton.addEventListener("click", () => {
    form.reset();
    dialog.close("cancel");
  });
  buttonContainer.appendChild(cancelButton);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.type = "submit"; // Change to type="submit"
  buttonContainer.appendChild(submitButton);

  form.appendChild(buttonContainer);

  // Add form submit event listener
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (nameInput.value.trim() !== "") {
      dialog.close("submit");
    } else {
      alert("Please enter a task name");
    }
  });

  dialog.appendChild(form);
  return dialog;
}

// Create a task item
export function createTaskItem(taskData) {
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";

  // Create the main task row (existing elements)
  const taskRow = document.createElement("div");
  taskRow.className = "task-row";

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  taskRow.appendChild(checkbox);

  // Priority indicator
  const priorityDot = document.createElement("span");
  priorityDot.className = `priority-dot priority-${taskData.priority}`;
  taskRow.appendChild(priorityDot);

  // Task name
  const taskName = document.createElement("span");
  taskName.textContent = taskData.name;
  taskName.className = "task-name";
  taskRow.appendChild(taskName);

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "×";
  deleteButton.className = "delete-task-button";
  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();
    taskItem.remove();
    storage.saveLists();
  });
  taskRow.appendChild(deleteButton);

  // Add the task row to the item
  taskItem.appendChild(taskRow);

  // Add description below if it exists
  if (taskData.description && taskData.description.trim() !== "") {
    const descriptionElement = document.createElement("div");
    descriptionElement.className = "task-description";
    descriptionElement.textContent = taskData.description;
    taskItem.appendChild(descriptionElement);
  }

  // Add due date if it exists
  if (taskData.date) {
    const dateElement = document.createElement("div");
    dateElement.className = "task-date";
    
    let formattedDate;
    try {
      // First try to parse as ISO date string (from new task creation)
      const date = new Date(taskData.date);
      if (isValid(date)) {
        formattedDate = format(date, "EEEE, MMMM do, yyyy");
      } else {
        // If that fails, try to parse the stored formatted date string
        const parsedDate = parse(taskData.date, "EEEE, MMMM do, yyyy", new Date());
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, "EEEE, MMMM do, yyyy");
        } else {
          formattedDate = "Invalid Date";
        }
      }
    } catch (error) {
      formattedDate = "Invalid Date";
    }
    
    dateElement.textContent = `Due: ${formattedDate}`;
    taskItem.appendChild(dateElement);
  }

  return taskItem;
}

// Create a tab for a list
export function createListTab(listName) {
  const tab = document.createElement("div");
  tab.className = "list-tab";
  tab.id = `tab-${listName.replace(/\s+/g, "-").toLowerCase()}`;

  const taskContainer = document.createElement("div");
  taskContainer.className = "task-container";

  const newTaskButton = createNewTaskButton();

  tab.appendChild(taskContainer);
  tab.appendChild(newTaskButton);

  return tab;
}

// Show a specific tab and hide others
export function showTab(tabId) {
  const tabs = document.querySelectorAll(".list-tab");
  tabs.forEach((tab) => {
    tab.style.display = "none";
  });

  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.style.display = "block";
  }
}
