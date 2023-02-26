const pubsub = require("./pubsub");

function updateTextContent(node, data){
    node.textContent = data;
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

//Note list in a project
function createNoteListItem(note) {
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
function renderNoteList(noteList) {
    const noteListContainer = document.getElementById('todos-list');
    noteList.forEach(note => {
        noteListContainer.appendChild(createNoteListItem(note));
    })
}
pubsub.subscribe('display', 'read', 'todos-list-container', renderNoteList);

function renderNoteTitles(name) {
    const projectTitle = document.getElementById('current-project-title');
    projectTitle.textContent = `Projects/${name}`;
}

pubsub.subscribe('display', 'read', 'current-project-title', renderNoteTitles);

function init(projects) {
    const project_list = document.getElementById('project-list');
    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = project.name;
        li.classList.add('project-list-item');
        li.addEventListener('click', () => {
                clearContent(document.getElementById('todos-list-container'));
                const ul = document.createElement('ul');
                ul.setAttribute('id', 'todos-list');
                document.getElementById('todos-list-container').appendChild(ul);

                project.getNoteList();
                //document.getElementById('add-note').removeEventListener('click');
                //document.getElementById('add-note').addEventListener('click', () => {
                //    project.addNote(
                //        project.createNote(
                //            'Note title for note Addtionally', 
                //            'random description for additionlally',
                //            'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
                //            new Date(1968,7,3), 'dd/MM/yyyy',
                //            'normal',
                //            ['whatthing', 'something'])
                //    );
                //    project.getNoteList();
                //});
                const addNoteBtn = document.createElement('button');
                addNoteBtn.textContent = 'Add note +';
                addNoteBtn.addEventListener('click', () => {
                    project.addNote(
                 project.createNote(
                        'Note title for note Addtionally', 
                        'random description for additionlally',
                        'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
                        new Date(1968,7,3), 'dd/MM/yyyy',
                        'normal',
                        ['whatthing', 'something'])
                    )
                 });

                document.getElementById('todos-list-container').appendChild(addNoteBtn);
            });
        project_list.appendChild(li);
    });
}

function clearContent (node) {
    [...node.childNodes].forEach((child) => {
         node.removeChild(child)
    });
}

module.exports = {init};