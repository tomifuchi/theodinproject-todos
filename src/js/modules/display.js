const pubsub = require("./pubsub");
const {
    //Creation
    c, ap, tc, sa,
    //Clearing
    clc,
} = require('./sub_modules/display/domUtil');

//Submodules
require('./sub_modules/display/form');

const cachedNodes = {
    curentTitle: document.getElementById('current-project-title'),
    projectList: document.getElementById('project-list'),
    todosListContainer: document.getElementById('todos-list-container'),
    formSection: document.getElementById('form-section'),
}

function applyClass(node, styleClass) {
    node.classList.add(styleClass);
}

/*This logs everything happens whenever anything in a project
note is invoked should we wanted to read the log subscribe to these channel
'log', 'createNote'
'log', 'addNote'
'log', 'getTodoList'
'log', 'getNote'
'log', 'removeNote' 
'log', 'editNote'
*/
//Logging
const htmlLoggerContainer = document.getElementById('log');
function renderHtmlLogger(msg) {
    tc(htmlLoggerContainer, msg);
}
pubsub.subscribe('display','log','htmlLogger-logs', renderHtmlLogger);

/*
    Next version
    If we look here, by ulitizing pubsub module, we can infact get our module
    to talk to each other without directly make them part of each other module.
    But just through publish and subscribe with arguments or callback functions to
    reflect what our current object is displaying at the moment and what state it is in.

    The idea for the next iteration is this for this module specifically.
    Figure out a way to manage display object state to the frontend.

    One way I can think of is this

    render(obj, target, displayObj), this render/display the object to
    the targetElement using displayObj function. We can then paste this anywhere we wanted,
    it should append to target not overwrite it. Overwriting or clearing a node we have
    a function for that.

    updateState(obj) will return the object we wanted to update.

    By somehow either have an object that manages these object target displayObj, or something.
    But if pulled off we can use this framework to build front end with these....Umm
    I call them comps. We can have an object that can render in multiple places if we wanted to, 
    with display function we wanted to.
*/
/* 
    Render function that runs whenever we:
    * Click on a project, refresh the whole page
    * Operation on noteList or on each note. (This might need optimizing to
    only render what's change but...Now lets do it simple, any change
    we re-render everything)
    This is cringy as fuck since this re renders and rebinding
    even the fucking buttons too! Which shouldn't be changed unless we 
    change projects.

    * Item to render: 
    #current-project-title (Change it's to current active project)
    project-list-item (High light current active project)
    #todos-list-container:
        #todos-list (render it's noteList here)
        #add-note (bind this to project add note function)
*/

function render(obj) {
    tc(cachedNodes.curentTitle, `Project/${obj.name}`);

    clc(cachedNodes.formSection);
    clc(cachedNodes.todosListContainer);
    ap(cachedNodes.todosListContainer, 
        bindTodoListElem(obj, createTodoListElem(obj.getTodoList())),
        createProjectOperations(obj),
    );
}
function renderProjList(projectList) {
    clc(cachedNodes.projectList);
    createProjectListItem(projectList);
}


//Note list in a project
function createTodoListItemElem(todo) {
    const todo_item = document.createElement('li');
    applyClass(todo_item, 'todos-list-item');

    const title = document.createElement('h3'); 
    tc(title, todo.title);
    ap(todo_item, title);

    const description = document.createElement('h4');
    tc(description, todo.description);
    ap(todo_item, description);

    const content = document.createElement('p');
    tc(content, todo.content);
    ap(todo_item, content)

    const dueDate = document.createElement('p');
    tc(dueDate, todo.dueDate);
    ap(todo_item, dueDate);

    applyClass(todo_item, (todo.priority == 'normal' ? 'normal':'urgent'))

    const tagList = document.createElement('ul');
    todo.tags.getTagList().forEach(tag => {
        const tagListItem = c('li');
        ap(tagListItem, document.createTextNode(tag.getAsStr()));
        ap(tagList, tagListItem);
    });
    ap(todo_item, tagList);

    const todoStatus = c('p');
    tc(todoStatus, todo.todoStatus);
    ap(todo_item, todoStatus);

    const todoOpsList = c('ul');
    applyClass(todoOpsList, 'todos-list-item-ops-list');

    const delButton = c('button');
    tc(delButton, 'Delete note');
    sa(delButton, 'data-del-btn', '');
    ap(todoOpsList, ap(c('li'), delButton));

    const editButton = c('button');
    tc(editButton, 'Edit note');
    sa(editButton, 'data-edit-btn', '');
    ap(todoOpsList, ap(c('li'), editButton));

    ap(todo_item, todoOpsList);

    return todo_item;
}

//If changes made then renders the list.
function createTodoListElem (noteList) {
    const ul = c('ul');
    sa(ul, 'id', 'todos-list');
    noteList.forEach(note => {
        ap(ul, createTodoListItemElem(note));
    })
    return ul;
}

function bindTodoListElem(obj, ul) {
    const ulArr = [...ul.childNodes];
    (obj.getTodoList()).forEach((todo,i) => {
        ulArr[i].querySelector('button[data-del-btn]').addEventListener('click', () => {
            obj.removeTodo(todo.ID);
        })
        ulArr[i].querySelector('button[data-edit-btn]').addEventListener('click', () => {
            /* Pops up the form with info in that note already in the fields
            so if you need to change somehting, you just write it up here and press create
            it should create a new note the passed it in here. to the edit note function
            of the project.
            */
            pubsub.publish('change', 'formModule-edit-form', {obj, todo, target: ulArr[i]});
        })

    })
    return ul;
}


function createProjectOperations(obj) {
    const addNoteBtn = c('button');
    tc(addNoteBtn, 'Add note +');
    addNoteBtn.addEventListener('click', () => {
         /* Pops up the form with info in that note already in the fields
         so if you need to change somehting, you just write it up here and press create
         it should create a new note the passed it in here. to the edit note function
         of the project. samething here too
         */
        pubsub.publish('create', 'formModule-create-form', {obj, target: cachedNodes.formSection});
    });
    return addNoteBtn;
}

function init(projectManager) {
    //Project list item
    createProjectListItem(projectManager.getProjectList());

    //Default click to first item
    cachedNodes.projectList.childNodes[0].dispatchEvent(new Event('click'));

    //Add project button event
    document.getElementById('project-list-add').addEventListener('click', () => {
        //If already existed, don't create
        if(cachedNodes.projectList.querySelector('div') == null) {
            //Text box with ok and cancel button. Takes project name
            const div = c('div');
            const txtBox = c('input');
            sa(txtBox, 'type', 'text');
            ap(div, txtBox);

            const okButton = c('button');
            tc(okButton, 'Ok');
            okButton.onclick = () => {
                const projectName = txtBox.value;
                if(projectName !== '') {
                    pubsub.publish('add', 'projectManagerModule-addProject', projectName);
                    cachedNodes.projectList.removeChild(cachedNodes.projectList.querySelector('div'));
                }
            }
            ap(div, okButton);

            const cancelButton = c('button');
            tc(cancelButton, 'Cancel');
            cancelButton.onclick = () => {
                cachedNodes.projectList.removeChild(cachedNodes.projectList.querySelector('div'));
            }
            ap(div, cancelButton);

            cachedNodes.projectList.appendChild(div);
        }
    });

    //Render to changes made
    //Individual project
    pubsub.subscribe('display','change', 'projectModule-addTodo', render);
    pubsub.subscribe('display','change', 'projectModule-removeTodo', render);
    pubsub.subscribe('display','change', 'projectModule-editTodo', render);
    //Project Managaer
    pubsub.subscribe('display', 'change', 'projectManagerModule-addProject', renderProjList);
    pubsub.subscribe('display', 'change', 'projectManagerModule-removeProject', renderProjList);
    pubsub.subscribe('display', 'change', 'projectManagerModule-clearProjectList', renderProjList);
    //For displaying a project in the projectList
    //When pressed an item, it will send a read request
    //then the project is going to publish project data to 
    //display-render-project subscribed here
    pubsub.subscribe('display', 'read', 'display-render-project', render);

    renderProjList(projectManager.getProjectList());
    render(projectManager.getProjectById(0).projectData);
}

function createProjectListItem(projectList) {
    projectList.forEach(({projectData}, i) => {
        const li = c('li');
        tc(li, projectData.name);
        applyClass(li, 'project-list-item');
        li.addEventListener('click', () => {
            pubsub.publish('display-read-request', `${projectData.name}-project-read-request`);
        });
        cachedNodes.projectList.appendChild(li);
    });
}

module.exports = {init};