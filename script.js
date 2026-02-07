
const dateElement = document.getElementById('current-date');
const options = { weekday: 'long', month: 'long', day: 'numeric' };
dateElement.innerText = new Date().toLocaleDateString('fr-FR', options);

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filters button');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';


function saveLocal() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(newTodo);
    saveLocal();
    renderTodos();
    todoInput.value = '';
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveLocal();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveLocal();
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';
    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <i class="${todo.completed ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}" 
               onclick="toggleTodo(${todo.id})"></i>
            <span onclick="toggleTodo(${todo.id})">${todo.text}</span>
            <i class="fas fa-trash-can delete-btn" onclick="deleteTodo(${todo.id})"></i>
        `;
        todoList.appendChild(li);
    });

    const emptyMsg = document.getElementById('empty-msg');
    emptyMsg.className = filteredTodos.length === 0 ? 'empty-visible' : 'hidden';
}


filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filters .active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.id.replace('filter-', '');
        renderTodos();
    });
});

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTodo(); });

renderTodos();