const pubsub = require('../pubsub');
const {Todo} = require('./todo');

const createTodoForm = document.getElementById('create-todo-form');
const createTodoBtn = document.getElementById('create-todo-btn');
//Set minimum for today min in form
createTodoForm.querySelector('#due-date').min = new Date().toISOString().split("T")[0];

function submit({projectMethodType, obj, todo=null}) {
    const q = queryForm(createTodoForm);
    if(createTodoForm.reportValidity()){
            const newTodo = Todo(
                q('#title'),
                q('#description'),
                q('#content'),
                /*
                    Parsing date from form
                    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

                    This part is really important.

                    Todo: The displayed date format will differ from the actual value — 
                    the displayed date is formatted based on the locale of the user's browser, 
                    but the parsed value is always formatted yyyy-mm-dd.
                */
                Date.parse(q('#due-date')),
                'dd/MM/yyyy',
                q('#priority'),
                processTags(q('#tags'))
            );
            switch(projectMethodType) {
                case 'add':
                    obj.addTodo(newTodo);       
                    break;
                case 'edit':
                    obj.editTodo({ID: todo.ID, ...newTodo});
                    break;
            }

            createTodoForm.reset(); //Reset the form after submit
    }
}

pubsub.subscribe('form', 'change', 'form-change-state', switchFormState);
pubsub.subscribe('form', 'change', 'form-change-context', switchContext);

function switchContext() {
    createTodoBtn.textContent = '';
    callbackFunctionEvents.clearListeners();
}

const callbackFunctionEvents = {
    callBacks: [],
    currentContext: {},
    clearListeners: function () {
        this.callBacks.forEach(f => createTodoBtn.removeEventListener('click', f));
    }
}

function switchFormState({projectMethodType, obj, todo=null}) {
    if(callbackFunctionEvents.callBacks.length > 0)
        callbackFunctionEvents.clearListeners();

    switch(projectMethodType) {
        case 'add':
            createTodoBtn.textContent = 'Add';
            break;
        case 'edit':
            createTodoBtn.textContent = 'Edit';
            break;
    }
    const currentCallBack = submit.bind(obj, {projectMethodType, obj, todo});
    callbackFunctionEvents.callBacks.push(currentCallBack);

    createTodoBtn.addEventListener('click', currentCallBack);
}

function queryForm(form) {
    return (query) => form.querySelector(query).value;
}

function processTags(str) {
    return str.split(' ');
}