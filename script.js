let selectedImage = null;

window.onload = loadTasks;

// Event Listeners
document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('taskInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

document.getElementById('imageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedImage = event.target.result;
      document.getElementById('imageStatus').textContent = 'Image chosen.';
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('deselectImageButton').addEventListener('click', () => {
  deselectImage();
});

function deselectImage() {
  selectedImage = null;
  document.getElementById('imageInput').value = '';
  document.getElementById('imageStatus').textContent = 'No image chosen.';
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();

  if (!taskText) return; // Prevent empty tasks

  createTaskElement(taskText, selectedImage);
  saveTasks();
  resetInputs();
}

function resetInputs() {
  document.getElementById('taskInput').value = '';
  deselectImage();
}

function createTaskElement(taskText, imageUrl = null, isCompleted = false) {
  const listItem = document.createElement('li');
  listItem.classList.add('task-card'); // Add task card class

  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    listItem.appendChild(img);
  }

  const textSpan = document.createElement('span');
  textSpan.textContent = taskText;
  textSpan.addEventListener('click', () => {
    listItem.classList.toggle('completed');
    saveTasks();
  });
  listItem.appendChild(textSpan);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    listItem.remove();
    saveTasks();
  });
  listItem.appendChild(deleteButton);

  if (isCompleted) listItem.classList.add('completed');

  document.getElementById('taskList').appendChild(listItem);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach((listItem) => {
    const text = listItem.querySelector('span').textContent;
    const img = listItem.querySelector('img')?.src;
    const completed = listItem.classList.contains('completed');

    tasks.push({ text, img, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach((task) => {
    createTaskElement(task.text, task.img, task.completed);
  });
}
