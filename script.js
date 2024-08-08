document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const themeToggle = document.getElementById('theme-toggle');
    const filters = {
        all: document.getElementById('all-tasks'),
        pending: document.getElementById('pending-tasks'),
        completed: document.getElementById('completed-tasks')
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filteredTasks = tasks;

    function renderTasks() {
        taskList.innerHTML = '';
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';

            const taskInfo = document.createElement('div');
            taskInfo.className = 'task-info';
            taskInfo.innerHTML = `
                <strong>${task.text}</strong>
                <small>${task.category} - ${task.dueDate ? `Due: ${task.dueDate}` : 'No due date'} - Priority: ${task.priority}</small>
            `;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.onclick = () => toggleCompleteTask(index);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editTask(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteTask(index);

            taskActions.appendChild(completeButton);
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);

            li.appendChild(taskInfo);
            li.appendChild(taskActions);

            taskList.appendChild(li);
        });
    }

    function addTask(event) {
        event.preventDefault();
        const taskText = document.getElementById('task-input').value.trim();
        const dueDate = document.getElementById('due-date-input').value;
        const category = document.getElementById('category-input').value;
        const priority = document.getElementById('priority-input').value;

        if (taskText) {
            tasks.push({
                text: taskText,
                dueDate,
                category,
                priority,
                completed: false
            });
            saveTasks();
            filterTasks();
            taskForm.reset();
        }
    }

    function toggleCompleteTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        filterTasks();
    }

    function editTask(index) {
        const newText = prompt('Edit your task', tasks[index].text);
        if (newText) {
            tasks[index].text = newText.trim();
            saveTasks();
            filterTasks();
        }
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        filterTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function filterTasks(type = 'all') {
        if (type === 'all') {
            filteredTasks = tasks;
        } else if (type === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (type === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        renderTasks();
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    taskForm.addEventListener('submit', addTask);
    filters.all.addEventListener('click', () => filterTasks('all'));
    filters.pending.addEventListener('click', () => filterTasks('pending'));
    filters.completed.addEventListener('click', () => filterTasks('completed'));
    themeToggle.addEventListener('click', toggleTheme);

    filterTasks();
});
