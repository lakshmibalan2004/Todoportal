const apiUrl = "http://127.0.0.1:5000/tasks"; // Change later after deploying

// Fetch and display tasks on page load
window.onload = loadTasks;

function loadTasks() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById("taskList");
            taskList.innerHTML = ""; // Clear list

            tasks.forEach(task => {
                let li = document.createElement("li");
                li.textContent = task.task;
                if (task.completed) li.classList.add("completed");

                let completeBtn = document.createElement("button");
                completeBtn.textContent = "Done";
                completeBtn.className = "complete";
                completeBtn.onclick = () => markCompleted(task.id);

                let deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "delete";
                deleteBtn.onclick = () => deleteTask(task.id);

                li.appendChild(completeBtn);
                li.appendChild(deleteBtn);
                taskList.appendChild(li);
            });
        });
}

// Add new task
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return alert("Please enter a task");

    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskText })
    }).then(() => {
        taskInput.value = "";
        loadTasks();
    });
}

// Mark task as completed
function markCompleted(id) {
    fetch(`${apiUrl}/${id}`, {
        method: "PUT"
    }).then(() => loadTasks());
}

// Delete task
function deleteTask(id) {
    fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    }).then(() => loadTasks());
}
