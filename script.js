const continueBtn = document.getElementById('continue-btn');
const landingPage = document.querySelector('.landing-page');
const mainApp = document.querySelector('.main-app');
const taskInput = document.getElementById('task-input');
const taskTimeInput = document.getElementById('task-time-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const filterSelect = document.getElementById('filter-select');
const backBtn = document.getElementById('back-btn'); // Reference to the Back button

continueBtn.addEventListener('click', () => {
    landingPage.style.display = 'none';
    mainApp.style.display = 'block';
});

// Back button functionality
backBtn.addEventListener('click', () => {
    mainApp.style.display = 'none';
    landingPage.style.display = 'block';
});

// Save tasks to local storage
function saveTasksToLocalStorage() {
    const taskItems = taskList.querySelectorAll('li');
    const tasks = Array.from(taskItems).map((taskItem) => ({
        text: taskItem.querySelector('.task-text').textContent,
        completed: taskItem.classList.contains('completed'),
        time: taskItem.querySelector('.task-time')?.value || ''
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        storedTasks.forEach((task) => {
            const newTaskItem = createTaskElement(task.text, task.completed, task.time);
            taskList.appendChild(newTaskItem);
        });
    }
}


// Create a new task element
function createTaskElement(taskText, isCompleted, taskTime) {
    const newTaskItem = document.createElement('li');
    newTaskItem.innerHTML = `
        <input type="checkbox" class="complete-checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-text">${taskText}</span>
        <input type="time" class="task-time" value="${taskTime}">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    if (isCompleted) {
        newTaskItem.classList.add('completed');
    }
    return newTaskItem;
}

// Add task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value;
    const taskTime = taskTimeInput.value;

    if (taskText !== '') {
        const newTaskItem = createTaskElement(taskText, false, taskTime);
        taskList.appendChild(newTaskItem);
        taskInput.value = '';
        taskTimeInput.value = '';
        saveTasksToLocalStorage();
    }
});

// Task list actions (complete, edit, delete)
taskList.addEventListener('click', (event) => {
    const target = event.target;
    const taskItem = target.closest('li');

    if (target.classList.contains('complete-checkbox')) {
        taskItem.classList.toggle('completed');
    } else if (target.classList.contains('edit-btn')) {
        const taskText = taskItem.querySelector('.task-text');
        const newText = prompt('Edit task:', taskText.textContent);
        if (newText !== null) {
            taskText.textContent = newText;
        }
    } else if (target.classList.contains('delete-btn')) {
        taskItem.remove();
    }
    saveTasksToLocalStorage();
});

// Filter tasks


filterSelect.addEventListener('change', () => {
    const filterValue = filterSelect.value;
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach((taskItem) => {
        const isCompleted = taskItem.classList.contains('completed');
        if (filterValue === 'all' || (filterValue === 'completed' && isCompleted) || (filterValue === 'incomplete' && !isCompleted)) {
            taskItem.style.display = 'block';
        } else {
            taskItem.style.display = 'none';
        }
    });
});

function setTaskNotifications() {
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach((taskItem) => {
        const taskTime = taskItem.querySelector('.task-time').value;
        if (taskTime !== '') {
            const notificationTime = new Date(Date.now() + Date.parse(taskTime));
            const notification = new Notification('Task Reminder', {
                body: taskItem.querySelector('.task-text').textContent,
                icon: 'path/to/your/notification_icon.png' // Optional
            });
            notification.onclick = () => {
                // Handle notification click (e.g., focus on the task)
            };
            setTimeout(() => {
                notification.close();
            }, 5000); // Close notification after 5 seconds
        }
    });
}

if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
        // ...
    });
}
if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted');   

            setTaskNotifications();
        } else {
            console.log('Notification permission denied');
        }
    });
}
function filterTasks() {
    const filterValue = filterSelect.value;
    const taskItems = taskList.querySelectorAll('li');
    taskItems.forEach((taskItem)  => {
        const isCompleted = taskItem.classList.contains('completed');   

        if (filterValue === 'all' || (filterValue === 'completed' && isCompleted) || (filterValue === 'incomplete' && !isCompleted)) {
            taskItem.style.display = 'block';
        } else {
            taskItem.style.display = 'none';
        }
    });
}

// Load tasks from local storage on page load
loadTasksFromLocalStorage();
