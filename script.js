if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
        if (permission !== "granted") {
            console.warn("Notifications disabled by user.");
        }
    });
}

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const popup = document.getElementById("popup");
const alertSound = document.getElementById("alertSound");
const currentTimeDisplay = document.getElementById("currentTime");
const daysOdometer = document.getElementById("daysOdometer");
const ageDisplay = document.getElementById("ageDisplay");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let lastDays = 0;

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks in the list
function displayTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.className = "task";
        div.innerHTML = `
            <span>⏰ ${task.time} - ${task.name}</span>
            <button class="remove-btn" onclick="removeTask(${index})">X</button>
        `;
        taskList.appendChild(div);
    });
}

// Remove a task
function removeTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

// Add new task
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("taskName").value;
    const time = document.getElementById("taskTime").value;
    tasks.push({ name, time });
    saveTasks();
    displayTasks();
    taskForm.reset();
});

// Show popup alert
function showPopup(message) {
    popup.innerText = message;
    popup.style.display = "block";
    alertSound.play();
    setTimeout(() => {
        popup.style.display = "none";
    }, 5000);
}

// Check tasks every second
function checkTasks() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    tasks.forEach(task => {
        if (task.time === currentTime) {
            showPopup(`🔔 Reminder: ${task.name}`);
        }
    });
}

// Update odometer display
function updateOdometer(newDays) {
    const newStr = String(newDays);
    const oldStr = String(lastDays);

    daysOdometer.innerHTML = ""; // clear

    for (let i = 0; i < newStr.length; i++) {
        const digit = document.createElement("div");
        digit.className = "digit";
        digit.textContent = newStr[i];

        // Animate only if digit changed
        if (oldStr[i] !== newStr[i]) {
            digit.classList.add("flip");
            setTimeout(() => digit.classList.remove("flip"), 300);
        }

        daysOdometer.appendChild(digit);
    }

    lastDays = newDays;
}

// Update clock, days lived, and age
function updateClockAndAge() {
    const now = new Date();
    currentTimeDisplay.textContent = `🕒 ${now.toLocaleTimeString()}`;

    // Age & Days lived
    const birthDate = new Date(2005, 3, 5); // April is month index 3
    const diffMs = now - birthDate;
    const daysLived = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    // Update odometer
    updateOdometer(daysLived);

    // Update age display
    ageDisplay.innerHTML = `<strong>${years} years, ${months} months, ${days} days</strong>`;
}

// Run intervals
setInterval(checkTasks, 1000);
setInterval(updateClockAndAge, 1000);

// Initial load
displayTasks();
updateClockAndAge();

function showPopup(message) {
    // On-screen popup
    popup.innerText = message;
    popup.style.display = "block";
    alertSound.play();
    setTimeout(() => {
        popup.style.display = "none";
    }, 5000);

    // Push notification
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🛸 Task Reminder", {
            body: message,
            icon: "https://cdn-icons-png.flaticon.com/512/616/616408.png" // You can change this
        });
    }
}

