import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos, renderPending } from './use-cases';

const ElementIds = {
    ClearCompletedButton: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoImput: '#new-todo-input',
    TodoFilters: '.filter',
    PendingCount: '#pending-count'
}


export const App = ( elementId ) => {
    
    const displayTodos = () =>{
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIds.TodoList, todos);
        updatePendingCount();
    }
    
    const updatePendingCount = () => {
        renderPending(ElementIds.PendingCount);
    }
    
    //cuando la funcion App() se llama
    (()=>{
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();
    })();

    //Referencias
    const newDescriptionInput = document.querySelector(ElementIds.NewTodoImput);
    const todoListUL = document.querySelector(ElementIds.TodoList);
    const clearCompletedButton = document.querySelector(ElementIds.ClearCompletedButton);
    const filterUL = document.querySelectorAll(ElementIds.TodoFilters);

    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) =>{
        if(event.keyCode !== 13) return;
        if(event.target.value.trim().length === 0) return;


        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    })

    todoListUL.addEventListener('click', (event)=>{
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    todoListUL.addEventListener('click', (event)=>{
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]');

        if(!isDestroyElement || !element) return;


        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos();
    })

    clearCompletedButton.addEventListener('click', () =>{
        todoStore.deleteCompleted();
        displayTodos();
    })

    filterUL.forEach(element => {
        element.addEventListener('click', (element) => {
            filterUL.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch(element.target.text){
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                break;
            }
            displayTodos();
        })
    });
}