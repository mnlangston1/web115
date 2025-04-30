const taskForm = document.getElementById("taskForm");
const taskManager = document.getElementById("taskManager");
const submitBtn = document.getElementById("submitBtn");
const sortBy = document.getElementById("sortBy");
const sortBtn = document.getElementById("sortBtn");

let tasks = [];
let taskId = 1;
let editTaskId = null;

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("taskName").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const isImportant = document.getElementById("taskImportant").checked;

  if (name === "") {
    alert("Please enter a task name.");
    return;
  }

  if (editTaskId) {
    const task = tasks.find(t => t.id === editTaskId);
    task.name = name;
    task.priority = priority;
    task.isImportant = isImportant;
    editTaskId = null;
    submitBtn.textContent = "Add task";
    submitBtn.classList.remove("edit-mode");
  } else {

    const newTask = {
    id: taskId++,
    name,
    priority,
    isImportant,
    isCompleted: false,
    date: new Date().toLocaleString(),
  };

  tasks.push(newTask);
  }  
  console.log(JSON.stringify(tasks));
  taskForm.reset();
  displayTasks();
});

sortBtn.addEventListener("click", function() {
  const sortValue = sortBy.value;

  if (sortValue === "priority") {
    tasks.sort((a, b) => {
      const priorityOrder = {High: 1, Medium: 2,Low:3 };
    });
  } else if (sortValue === "date") {
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortValue === "completed") {
    tasks.sort((a, b) => a.isCompleted - b.isCompleted);
  }

  displayTasks();
});

function displayTasks() {
  taskManager.innerHTML = "";

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.dataset.priority = task.priority;

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    if (task.isImportant) taskInfo.classList.add("important");
    if (task.isCompleted) taskInfo.classList.add("completed");

    taskInfo.innerHTML = `
      <strong>${task.name}</strong> (${task.priority})<br/>
      <small>Added: ${task.date}</small>
    `;
    
    const controls = document.createElement("div");
    controls.className = "task-controls";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.isCompleted ? "Undo" : "Complete";
    completeBtn.onclick = () => toggleComplete(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(task.id);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(task.id);

    controls.append(completeBtn, editBtn, deleteBtn);
    taskDiv.append(taskInfo, controls);
    taskManager.appendChild(taskDiv);
  });
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.isCompleted = !task.isCompleted;
  displayTasks();
  console.log(JSON.stringify(tasks));
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  displayTasks();
  console.log(JSON.stringify(tasks));
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById("taskName").value = task.name;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskImportant").checked = task.isImportant;

  editTaskId = id;
  submitBtn.textContent = "Update task";
  submitBtn.classList.add("edit-mode")
}