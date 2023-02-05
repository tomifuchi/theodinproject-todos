//Modules
const pubsub = require('./pubsub');
const {format} = require('date-fns');

const noteList = [];
let ID = 0;

//Note object.
//Creating
function createNote(title, description, content, dueDate, dueDateformat='dd/MM/yyyy', priority, tags) {
    pubsub.publish('log','createNote', 'note.js:createNote invoke'); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
    const state = {
        ID: ID++, title, description, content, dueDate: format(dueDate,  dueDateformat), priority, tags
    };

    return Object.assign({}, state);
}

function addNote(note) {
    pubsub.publish('log','addNote', 'note.js:addNote invoke');
    noteList.push(note);
}

//Removing
function removeNote(ID) {
    pubsub.publish('log','removeNote', 'note.js:removeNote invoke');
    const obj = getNote(ID);
    if(obj !== undefined) 
        noteList.splice(noteList.indexOf(obj, 1));
}

//Editting
function editNote({ID = -1, ...edittedNote}){
    pubsub.publish('log','editNote', 'note.js:editNote invoke'); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
    const obj = getNote(ID);
    if(obj !== undefined) {
        edditedNote = {...obj, ...edittedNote};
        removeNote(obj.ID);
        addNote(edditedNote);
    }
}

//Reading
function getNoteList(){
    const list = JSON.parse(JSON.stringify(noteList));
    pubsub.publish('log','getNoteList', `note.js:getNoteList returned this:\n${JSON.stringify(list)}`);
    return list;
}

function getNote(ID) {
    //Since ID should only be one 1
    const obj = noteList.filter(note => note.ID == ID)[0];
    pubsub.publish('log','getNote', `note.js:getNote returned this:\n${JSON.stringify(obj)}`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
    return obj;
}

//For testing purposes
function noteImportTest(){
    return 'Note module import successful';
}

function randomNote() {
    return createNote(
        'Random title',
        'Any description',
        'content: Anything goes here',
        new Date(1971, 11, 1),
        'dd/MM/yyyy',
        'normal',
        ['tag A', 'tag B', 'tag C']
    );
}

module.exports = {createNote, addNote, getNoteList, getNote, removeNote, editNote, randomNote, noteImportTest};