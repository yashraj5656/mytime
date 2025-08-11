let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Update clock
function updateClock() {
    const now = new Date();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Render today's tasks
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, index) => {
        if (task.date.startsWith(today)) {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.name} - ${task.time} (${task.category || 'No category'})</span>
                <button class="remove-btn" onclick="removeTask(${index})">X</button>
            `;
            taskList.appendChild(li);
        }
    });

    updateCategoryFilter();
}

// Remove task
function removeTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Add new task
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('taskInput').value;
    const datetime = document.getElementById('taskTime').value;
    const category = document.getElementById('taskCategory').value;
    const recurring = document.getElementById('recurringTask').checked;
    const message = document.getElementById('customMessage').value || `Reminder: ${name}`;

    if (!name || !datetime) return;

    tasks.push({
        name,
        date: datetime,
        time: new Date(datetime).toLocaleTimeString(),
        category,
        recurring,
        message
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    this.reset();
});

// Search and filter
document.getElementById('searchInput').addEventListener('input', function() {
    const searchVal = this.value.toLowerCase();
    const taskList = document.getElementById('taskList');
    Array.from(taskList.children).forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(searchVal) ? "" : "none";
    });
});

document.getElementById('categoryFilter').addEventListener('change', function() {
    const category = this.value;
    const taskList = document.getElementById('taskList');
    Array.from(taskList.children).forEach(li => {
        li.style.display = li.textContent.includes(category) || category === "" ? "" : "none";
    });
});

// Update category filter
function updateCategoryFilter() {
    const categorySet = new Set(tasks.map(t => t.category).filter(Boolean));
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    categorySet.forEach(cat => {
        categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

// Toggle features
document.getElementById('toggleFeatures').addEventListener('click', function() {
    const adv = document.getElementById('advancedFeatures');
    adv.style.display = adv.style.display === "none" ? "block" : "none";
    this.textContent = adv.style.display === "none" ? "Show Advanced Features" : "Hide Advanced Features";
});

renderTasks();
