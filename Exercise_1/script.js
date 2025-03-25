const taskList = document.createElement("div");
taskList.id = "task_list";
document.body.appendChild(taskList);

const createTaskButton = document.getElementById("create_task_button");
const input = document.getElementById("task_name");

createTaskButton.addEventListener("click", () => {
    const taskText = input.value.trim();
    if (taskText === "") return;

    const taskItem = document.createElement("div");
    taskItem.classList.add("task");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    const textSpan = document.createElement("span");
    textSpan.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      taskItem.remove();
    });

    taskItem.appendChild(checkbox);
    taskItem.appendChild(textSpan);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);

    input.value = "";
})