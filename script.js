let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");
const clockElement = document.getElementById("clock");

// Request notification permission
if ("Notification" in window) {
    Notification.requestPermission();
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${task.name} - ${task.time} 
            <button onclick="deleteTask(${index})">❌</button>`;
        taskList.appendChild(li);
    });
}

// Add task
function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const time = document.getElementById("taskTime").value;

    if (name && time) {
        tasks.push({ name, time, alerted: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        document.getElementById("taskName").value = "";
        document.getElementById("taskTime").value = "";
    } else {
        alert("Please enter both task name and time.");
    }
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Check if task time matches current time
function checkTasks() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    tasks.forEach(task => {
        if (task.time === currentTime && !task.alerted) {
            task.alerted = true;
            localStorage.setItem("tasks", JSON.stringify(tasks));

            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("Task Reminder", {
                    body: task.name,
                    icon: "https://cdn-icons-png.flaticon.com/512/565/565547.png"
                });
            } else {
                alert(`⏰ Reminder: ${task.name}`);
            }
        }
    });
}

// Update clock every second
function updateClock() {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000); // update clock every second
setInterval(checkTasks, 1000 * 60); // check every minute

renderTasks();
updateClock(); // initial clock display
