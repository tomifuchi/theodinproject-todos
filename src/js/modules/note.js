//Modules
const pubsub = require('./pubsub');
const {format} = require('date-fns');
const _ = require('lodash');

const noteList = [];
let ID = 0;

//Note object.
function createNote(title, description, content, dueDate, priority, tags) {

   pubsub.publish('log','createNote', 'note.js:createNote invoke'); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
   const state = {
        ID: ID++, title, description, content, dueDate, priority, tags
    };

    return Object.assign({}, state);
}

function addNote(note) {
    pubsub.publish('log','addNote', 'note.js:addNote invoke')
    noteList.push(note);
}

function removeNote(ID) {
    noteList.splice(noteList.indexOf(noteList.filter(note => note.ID == ID)), 1);
}

function editNote(edittedNote){
    const note = getNote(edittedNote.ID);
    if(typeof note !== undefined) {
        note = {...note, ...edittedNote};
        pubsub.publish('log','editNote', 'note.js:editNote invoke'); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
    }
}

function getNoteList(){
    const list = JSON.parse(JSON.stringify(noteList));
    pubsub.publish('log','getNoteList', `note.js:getNoteList returned this:\n${JSON.stringify(list)}`);
    return list;
}

function getNote(ID) {
    const obj = noteList.filter(note => note.ID == ID);
    pubsub.publish('log','getNote', `note.js:editNote invoke!\nIt's object is: ${JSON.stringify(obj)}`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
    return obj;
}

//For testing purposes
function noteTest(){
    return 'Confirmation from note';
}

function randomNote() {
    return createNote(
        'Random title',
        'Any description',
        'content: Anything goes here, lsdkjfasdjfkljasdlfjdljsdl;vj;lsjdljvljwoiopgjpowjegoijwghiohvgsbdhvhpqiwheifh',
        format(new Date(1971, 11, 1), 'dd/MM/yyyy'),
        'normal',
        ['tag A', 'tag B', 'tag C']
    );
}

module.exports = {createNote, addNote, getNoteList, randomNote, noteTest};