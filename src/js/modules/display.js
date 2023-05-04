const pubsub = require("./pubsub");

//Submodules
require('./sub_modules/display/form');
const {clearNodeChilds, addToElem} = require('./sub_modules/display/domUtil');

const cachedNodes = {
    curentTitle: document.getElementById('current-project-title'),
    projectList: document.getElementById('project-list'),
    todosListContainer: document.getElementById('todos-list-container'),
    formSection: document.getElementById('form-section'),
}

function updateTextContent(node, data){
    node.textContent = data;
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
    updateTextContent(htmlLoggerContainer, msg);
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
    //console.log('render received:', obj);
    //console.log(obj.getTodoList());
    updateTextContent(cachedNodes.curentTitle, `Project/${obj.name}`);
    //applyClass(obj.listItem, 'active');

    clearNodeChilds(cachedNodes.formSection);
    clearNodeChilds(cachedNodes.todosListContainer);
    addToElem(cachedNodes.todosListContainer, 
        bindTodoListElem(obj, createTodoListElem(obj.getTodoList())),
        createProjectOperations(obj),
    );
}
function renderProjList(projectList) {
    clearNodeChilds(cachedNodes.projectList);
    createProjectListItem(projectList);
}
pubsub.subscribe('display','read', 'projectModule-getData', render);
pubsub.subscribe('display', 'read', 'projectManagerModule-getData', renderProjList);


//Note list in a project
function createTodoListItemElem(todo) {
    const todo_item = document.createElement('li');
    todo_item.classList.add('todos-list-item');

    const title = document.createElement('h3'); 
    title.textContent = todo.title;
    todo_item.appendChild(title);

    const description = document.createElement('h4');
    description.textContent = todo.description;
    todo_item.appendChild(description);

    const content = document.createElement('p');
    content.textContent = todo.content;
    todo_item.appendChild(content);

    const dueDate = document.createElement('p');
    dueDate.textContent = todo.dueDate;
    todo_item.appendChild(dueDate);

    todo_item.classList.add((todo.priority == 'normal' ? 'normal':'urgent'));

    const tagList = document.createElement('ul');
    todo.tags.getTagList().forEach(tag => {
        const tagListItem = document.createElement('li');
        tagListItem.appendChild(document.createTextNode(tag.getAsStr()));
        tagList.appendChild(tagListItem);
    });
    todo_item.appendChild(tagList);

    const noteStatus = document.createElement('p');
    noteStatus.textContent = todo.noteStatus;
    todo_item.appendChild(noteStatus);

    const todoOpsList = document.createElement('ul');
    todoOpsList.setAttribute('class', 'todos-list-item-ops-list');

    const delButton = document.createElement('button');
    delButton.textContent = 'Delete note';
    delButton.setAttribute('data-del-btn', '');
    todoOpsList.appendChild(document.createElement('li').appendChild(delButton));

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit note';
    editButton.setAttribute('data-edit-btn', '');
    todoOpsList.appendChild(document.createElement('li').appendChild(editButton));

    todo_item.appendChild(todoOpsList);

    return todo_item;
}

//If changes made then renders the list.
function createTodoListElem (noteList) {
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'todos-list');
    noteList.forEach(note => {
        ul.appendChild(createTodoListItemElem(note));
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
            pubsub.publish('change', 'edit-form', {obj, todo, target: ulArr[i]});
        })

    })
    return ul;
}


function createProjectOperations(obj) {
    const addNoteBtn = document.createElement('button');
    addNoteBtn.textContent = 'Add note +';
    addNoteBtn.addEventListener('click', () => {
         /* Pops up the form with info in that note already in the fields
         so if you need to change somehting, you just write it up here and press create
         it should create a new note the passed it in here. to the edit note function
         of the project. samething here too
         */
        pubsub.publish('create', 'create-form', {obj, target: cachedNodes.formSection});
    });
    return addNoteBtn;
}

function init(projectManager) {
    createProjectListItem(projectManager.getProjectList());

    console.log(cachedNodes.projectList.childNodes[0]);
    cachedNodes.projectList.childNodes[0].dispatchEvent(new Event('click'));
    document.getElementById('project-list-add').addEventListener('click', () => {
        console.log('add project');
        if(cachedNodes.projectList.querySelector('div') == null) {
            const div = document.createElement('div');
            const txtBox = document.createElement('input');
            txtBox.setAttribute('type', 'text');
            const okButton = document.createElement('button');
            okButton.textContent = 'Ok';
            okButton.onclick = () => {
                const projectName = txtBox.value;
                pubsub.publish('add', 'add-project', projectManager.createProject(projectName));
                cachedNodes.projectList.removeChild(cachedNodes.projectList.querySelector('div'));
            }
            div.appendChild(txtBox);
            div.appendChild(okButton);

            cachedNodes.projectList.appendChild(div);
        }
    });
}

function createProjectListItem(projectList) {
    projectList.forEach(({projectData}, i) => {
        const li = document.createElement('li');
        li.textContent = projectData.name;
        li.classList.add('project-list-item');
        li.addEventListener('click', () => {
            pubsub.publish('read-request', `${projectData.name}-project-read-request`);
        });
        cachedNodes.projectList.appendChild(li);
    });

}

module.exports = {init};