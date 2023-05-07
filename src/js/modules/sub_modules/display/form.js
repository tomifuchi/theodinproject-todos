const {format, parse} = require('date-fns');
const pubsub = require('../../pubsub');
const {
    //Creation
    c, tc, sa, ap, cea,
    //Clearing
    clc,
    //Querying
    qc, qcf,
} = require('./domUtil');
const {Todo} = require('../project/todo');

pubsub.subscribe('form', 'change', 'formModule-edit-form', editTodoFromForm);
pubsub.subscribe('form', 'create', 'formModule-create-form', createTodoFromForm);

function editTodoFromForm({obj, todo, target}) {
    clc(target);
    const form = createFormElement();
    parseTodo(form, todo);
    tc(qc(form, '#create-todo-btn'), 'Edit todo');
    qc(form,'#create-todo-btn').addEventListener('click', () => {
        if(form.reportValidity()){
            const newTodo = parseForm(form);
            obj.editTodo({ID: todo.ID, ...newTodo});
        }
    });
    ap(target, form);
}

function parseForm(form) {
    const q = qcf(form)
    return Todo(
        q('#title').value,
        q('#description').value,
        q('#content').value,
        /*
            Parsing date from form
            https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

            This part is really important.

            Todo: The displayed date format will differ from the actual value — 
            the displayed date is formatted based on the locale of the user's browser, 
            but the parsed value is always formatted yyyy-mm-dd.
        */
        Date.parse(q('#due-date').value),
        'dd/MM/yyyy',
        q('#priority').value,
        processTags(q('#tags').value),
        (q('#finished').checked ? 'finished':'unfinshed')
    );
}

function parseTodo(form, todo) {
    const q = qcf(form);
    
    sa(q('#title'), 'value', todo.title);
    sa(q('#description'), 'value', todo.description);
    //Why set attribute here doesn't work ?
    //This down here equates to
    //form.querySelector('#content').setAttribute('value', todo.content)
    //sa(q('#content'), 'value', todo.content);
    //But the below works ?
    q('#content').value = todo.content;
    sa(q('#due-date'), 'value', format(parse(todo.dueDate, 'dd/MM/yyyy', new Date()),'yyyy-MM-dd'));
    sa(q('#priority'), 'value', todo.priority);
    sa(q('#tags'), 'value', todo.tags.getTagList().map(tag => tag.getAsStr()).join(' '));
    if(todo.todoStatus == 'finished') {
        sa(q('#finished'), 'checked', '');
    }

    return form;
}

function createTodoFromForm({obj, target}) {
    if(!target.hasChildNodes()){
        const form = createFormElement();
        form.querySelector('#create-todo-btn').addEventListener('click', () => {
            if(form.reportValidity()){
                const newTodo = parseForm(form);
                obj.addTodo(newTodo);
                clc(target);
            }
        });
        ap(target, form);
    }
}

function createFormElement() {

    const form = ap(cea('form', {action:"", method:"post" ,id:"create-todo-form"}),
        tc(c('h2'), 'todo creation'),
        ap(c('fieldset'),
            tc(c('legend'), 'todo info'),
            ap(c('p'),
                tc(cea('label',{for:"title"}), 'Title:'),
                cea('input', {type:"text", id:"title", name:"todo_title" ,required:''}),
                c('span')),
            ap(c('p'),
                tc(cea('label', {for:"description"}), 'Description:'),
                cea('input', {type:"text", id:"description", name:"todo_description", required: ''}),
                c('span')),
            ap(c('p'),
                tc(cea('label', {for:"content"}), 'Content:'),
                cea('textarea', {rows:"5" ,id:"content", maxlength:"1000", required: ''})),
            ap(c('p'),
                tc(cea('label',{for:"due-date"}), 'Due date:'),
                cea('input',{type:"date" ,id:"due-date", name:"todo_dueDate", required: ''})),
            ap(c('p'), 
                tc(cea('label', {for:"priority"}), 'Priority:'),
                ap(cea('select', {id:"priority"}),
                    tc(cea('option', {value:"normal"}),'Normal'),
                    tc(cea('option', {value:"moderate"}), 'Moderate'),
                    tc(cea('option', {value:"urgent"}), 'Urgent'))),
            ap(c('p'),
                tc(cea('label', {for:"tags"}), 'Tags'),
                tc(c('p'), 'These are space separated, and have syntax of indentifier:topic, example: rockband:guitar, programming:haskell, study:math:'),
                cea('input', {type:"text" ,id:"tags", name:"todo_tags"})),
            ap(c('p'),
                tc(c('p'), 'Status:'),
                tc(cea('label',{for:"finished"}), 'Finished'),
                cea('input', {type:"radio", id:"finished", value:"finished", name:"todo_status"}),
                tc(cea('label',{for:"unfinised"}), 'Unfinished'),
                cea('input', {type:"radio", id:"unfinished", value:"unfinished", name:"todo_status", checked: ''})),
            ap(c('p'),
                tc(cea('button', {type:"button", id:"create-todo-btn"}), 'Add todo'))
        )
    );
    sa(qc(form, '#due-date'), 'min', new Date().toISOString().split("T")[0]);

    return form;
}

function processTags(str) {
    return str.split(' ');
}
