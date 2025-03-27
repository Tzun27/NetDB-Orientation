function createTaskElement(taskText, completed = false, taskList) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", () => saveTasks(taskList));

  const textSpan = document.createElement("span");
  textSpan.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    taskItem.remove();
    saveTasks(taskList);
  });

  taskItem.appendChild(checkbox);
  taskItem.appendChild(textSpan);
  taskItem.appendChild(deleteButton);
  taskList.appendChild(taskItem);
}

// uses local storage to save tasks and check box status
function saveTasks(taskList) {
  /*
    Array.from() converts HTML collection into array;
    map() transforms each element from the original array,
    in this case it "maps" the elements into an Object 'text' and 'completed';
    
    Thus tasks is an array of objects that looks like:
    type Task = {
      text: string;
      completed: boolean;
    };

    type tasks = Task[];
  */
  const tasks = Array.from(taskList.children).map((taskItem) => ({
    text: taskItem.querySelector("span").textContent,
    completed: taskItem.querySelector('input[type="checkbox"]').checked,
  }));

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// loads tasks from local storage
function loadTasks(taskList) {
  // ||(OR) used to assign empty array if parse is not successfull
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((task) =>
    createTaskElement(task.text, task.completed, taskList)
  );
}

function main() {
  const taskList = document.createElement("div");
  taskList.id = "task_list";
  document.body.appendChild(taskList);

  document.addEventListener("DOMContentLoaded", () => loadTasks(taskList));

  const createTaskButton = document.getElementById("create_task_button");
  const input = document.getElementById("task_name");

  createTaskButton.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText === "") return;

    createTaskElement(taskText, false, taskList);
    saveTasks(taskList);

    input.value = "";
  });
}

main();
