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

export function createListBox(listName) {
  const listBox = document.createElement("div");
  listBox.textContent = listName;
  listBox.className = "list-box";
  listBox.addEventListener("click", () => {
    console.log(`Switched to list: ${listName}`);
  });
  return listBox;
}
