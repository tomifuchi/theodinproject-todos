const pubsub = require("./pubsub");

const cachedNodes = {
    curentTitle: document.getElementById('current-project-title'),
    projectList: document.getElementById('project-list'),
    todosListContainer: document.getElementById('todos-list-container'),
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
'log', 'getNoteList'
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
    Render function that runs whenever we:
    * Click on a project, refresh the whole page
    * Operation on noteList or on each note. (This might need optimizing to
    only render what's change but...Now lets do it simple, any change
    we re-render everything)
    This is cringy as fuck since this re renders and rebinding
    even the fucking buttongs too! Which shouldn't be changed unless we 
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
    //console.log(obj.getNoteList());
    updateTextContent(cachedNodes.curentTitle, `Project/${obj.name}`);
    //applyClass(obj.listItem, 'active');

    clearContent(cachedNodes.todosListContainer);
    addToElem(cachedNodes.todosListContainer, 
        createNoteListElem(obj.getNoteList()),
        createProjectOperations(obj),
    );

}
pubsub.subscribe('display','read', 'getData', render);


//Note list in a project
function createNoteListItemElem(note) {
    const note_item = document.createElement('li');
    note_item.classList.add('todos-list-item');

    const title = document.createElement('h3'); 
    title.textContent = note.title;
    note_item.appendChild(title);

    const description = document.createElement('h4');
    description.textContent = note.description;
    note_item.appendChild(description);

    const content = document.createElement('p');
    content.textContent = note.content;
    note_item.appendChild(content);

    const dueDate = document.createElement('p');
    dueDate.textContent = note.dueDate;
    note_item.appendChild(dueDate);

    note_item.classList.add((note.priority == 'normal' ? 'normal':'urgent'));

    const tagList = document.createElement('ul');
    note.tags.getTagList().forEach(tag => {
        const tagListItem = document.createElement('li');
        tagListItem.appendChild(document.createTextNode(tag.getAsStr()));
        tagList.appendChild(tagListItem);
    });
    note_item.appendChild(tagList);

    const noteStatus = document.createElement('p');
    noteStatus.textContent = note.noteStatus;
    note_item.appendChild(noteStatus);

    return note_item;
}

//If changes made then renders the list.
function createNoteListElem (noteList) {
    const ul = document.createElement('ul');
    ul.setAttribute('id', 'todos-list');
    noteList.forEach(note => {
        ul.appendChild(createNoteListItemElem(note));
    })
    return ul;
}

function createProjectOperations(obj) {
    const addNoteBtn = document.createElement('button');
    addNoteBtn.textContent = 'Add note +';
    addNoteBtn.addEventListener('click', () => {
        obj.addNote(
     obj.createNote(
            'Note title for note Addtionally', 
            'random description for additionlally',
            'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
            new Date(1968,7,3), 'dd/MM/yyyy',
            'normal',
            ['whatthing', 'something'])
        )
    });
    return addNoteBtn;
}

function init(projects) {
    const project_list = document.getElementById('project-list');
    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = project.name;
        li.classList.add('project-list-item');
        li.addEventListener('click', () => {
                pubsub.publish('read-request', `${project.name}-project-read-request`);
            });
        project_list.appendChild(li);
    });
}

function clearContent (node) {
    if(node.hasChildNodes()){
        [...node.childNodes].forEach((child) => {
             node.removeChild(child)
        });
    }
}

function addToElem(target, ...nodes) {
    nodes.forEach(node => {
        target.appendChild(node);
    });
}

module.exports = {init};