let tasks = [];

class Task {
    constructor(title, priority, deadline, estHours) {
        this.id = Date.now();
        this.title = title;
        this.priority = parseInt(priority);
        this.deadline = new Date(deadline);
        this.estHours = parseFloat(estHours);
    }
}

function calculatePriority(task, freeHours) {
    const now = new Date();
    const daysLeft = (task.deadline - now) / (1000 * 60 * 60 * 24);
    
    if (daysLeft <= 0) return 1000;
    
    const urgency = Math.min(5, 5 / Math.max(1, daysLeft));
    const feasibility = Math.min(1, freeHours / task.estHours);
    
    return (urgency * task.priority * 0.4) + (feasibility * 0.6);
}

function bubbleSort(numbers) {
    if (numbers.length <= 1) return [...numbers];
    
    const arr = [...numbers];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr, j, j + 1);
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}

function swap(arr, idx1, idx2) {
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const topPriority = document.getElementById('topPriority');
    const sortBtn = document.getElementById('sortBtn');
    const sortInput = document.getElementById('sortInput');
    const original = document.getElementById('original');
    const sorted = document.getElementById('sorted');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const priority = document.getElementById('priority').value;
        const deadline = document.getElementById('deadline').value;
        const estHours = document.getElementById('estHours').value;
        const freeHours = parseFloat(document.getElementById('freeHours').value);

        const task = new Task(title, priority, deadline, estHours);
        tasks.push(task);
        organizeAndRenderTasks(freeHours, taskList, taskCount, topPriority);
        form.reset();
    });

    sortBtn.addEventListener('click', () => {
        const input = sortInput.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        original.textContent = input.join(', ');
        const result = bubbleSort(input);
        sorted.textContent = result.join(', ');
    });

    sortBtn.click();
});

function organizeAndRenderTasks(freeHours, taskListEl, countEl, priorityEl) {
    tasks.sort((a, b) => calculatePriority(b, freeHours) - calculatePriority(a));

    taskListEl.innerHTML = tasks.map(task => {
        const prioClass = task.priority >= 4 ? 'task-high' : task.priority >= 2 ? 'task-medium' : 'task-low';
        const daysLeft = Math.max(0, Math.ceil((task.deadline - new Date()) / (1000*60*60*24)));
        return `
            <li class="task-item ${prioClass}">
                <div class="task-info">
                    <h3>${task.title}</h3>
                    <div class="task-meta">
                        Prioridade: ${task.priority}/5 | Prazo: ${daysLeft} dias | ${task.estHours}h
                    </div>
                </div>
                <strong>Score: ${calculatePriority(task, 8).toFixed(1)}</strong>
            </li>
        `;
    }).join('');

    countEl.textContent = `${tasks.length} tarefas`;
    priorityEl.textContent = `Prioridade total: ${tasks.reduce((sum, t) => sum + t.priority, 0)}`;
}
