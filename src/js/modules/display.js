const pubsub = require("./pubsub");

function updateTextContent(node, data){
    node.textContent = data;
}

const htmlLogger = document.getElementById('log');
function renderHtmlLogger(msg) {
    updateTextContent(htmlLogger, msg);
}

pubsub.subscribe('display','log','htmlLogger-logs', renderHtmlLogger);

function createListItem(note) {
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

function renderList(noteList) {
    console.log(noteList);
    const noteListContainer = document.getElementById('todos-list');
    noteList.forEach(note => {
        noteListContainer.appendChild(createListItem(note));
    })
}

pubsub.subscribe('display', 'read', 'todos-list-container', renderList);