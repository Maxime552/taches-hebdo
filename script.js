// script.js
let currentDate = new Date();
let role = localStorage.getItem('role');
const weekContainer = document.getElementById('week');
const modal = document.getElementById('taskModal');
const closeModalBtn = document.getElementById('closeModal');
const taskList = document.getElementById('taskList');
const modalDate = document.getElementById('modalDate');
const newTaskInput = document.getElementById('newTask');
const addTaskBtn = document.getElementById('addTask');
const weekLabel = document.getElementById('weekLabel');

if (!role) window.location.href = 'index.html';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getWeekDates(date) {
  const first = date.getDate() - date.getDay() + 1;
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(first + i);
    week.push(d);
  }
  return week;
}

function renderWeek() {
  weekContainer.innerHTML = '';
  const weekDates = getWeekDates(currentDate);
  weekLabel.textContent = `Semaine du ${formatDate(weekDates[0])}`;
  weekDates.forEach(date => {
    const day = document.createElement('div');
    day.className = 'day';
    day.textContent = `${date.toLocaleDateString('fr-FR', { weekday: 'long' })}
${formatDate(date)}`;
    day.onclick = () => openModal(formatDate(date));
    weekContainer.appendChild(day);
  });
}

function openModal(dateKey) {
  modal.style.display = 'block';
  modalDate.textContent = `Tâches pour ${dateKey}`;
  taskList.setAttribute('data-date', dateKey);
  loadTasks(dateKey);
}

function closeModal() {
  modal.style.display = 'none';
  taskList.innerHTML = '';
  newTaskInput.value = '';
}

function loadTasks(dateKey) {
  db.ref(`tasks/${dateKey}`).once('value', snapshot => {
    const tasks = snapshot.val() || [];
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.onchange = () => {
        task.done = checkbox.checked;
        db.ref(`tasks/${dateKey}/${index}`).set(task);
      };

      const span = document.createElement('span');
      span.textContent = task.text;

      li.appendChild(checkbox);
      li.appendChild(span);

      if (role === 'admin') {
        const del = document.createElement('button');
        del.textContent = '🗑️';
        del.onclick = () => {
          db.ref(`tasks/${dateKey}/${index}`).remove().then(() => loadTasks(dateKey));
        };
        li.appendChild(del);
      }

      taskList.appendChild(li);
    });
  });
}

function addTask() {
  const text = newTaskInput.value.trim();
  const dateKey = taskList.getAttribute('data-date');
  if (!text) return;
  db.ref(`tasks/${dateKey}`).once('value', snapshot => {
    const tasks = snapshot.val() || [];
    tasks.push({ text, done: false });
    db.ref(`tasks/${dateKey}`).set(tasks).then(() => {
      loadTasks(dateKey);
      newTaskInput.value = '';
    });
  });
}

prevWeek.onclick = () => {
  currentDate.setDate(currentDate.getDate() - 7);
  renderWeek();
};
nextWeek.onclick = () => {
  currentDate.setDate(currentDate.getDate() + 7);
  renderWeek();
};
closeModalBtn.onclick = closeModal;
addTaskBtn.onclick = addTask;
document.getElementById('logoutBtn').onclick = () => {
  localStorage.clear();
  window.location.href = 'index.html';
};

renderWeek();
