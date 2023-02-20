//Modules
const pubsub = require('./pubsub');
const {format} = require('date-fns');
const tagModule = require('./tag');

function Project(name) {
    
    const state = {name};
    const noteList = [];

    let ID = 0;

    //Creation
    function createNote (title, description, content, dueDate, dueDateformat='dd/MM/yyyy', priority, tags) { 
        pubsub.publish('log','createNote', `${this.name} note.js:createNote invoke`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        const state = {
            title, 
            description, 
            content, 
            dueDate: format(dueDate,  dueDateformat), 
            priority, 
            tags: tagModule.createTagList('default-name'), 
            noteStatus: 'unfinished',
        };
        state.tags.addTag(...tags.map(tag => tagModule.createTag.fromStr(tag)));

        return state;
    }

    function addNote (note) {
        pubsub.publish('log','addNote', `${this.name} project; note.js:addNote invoke`);
        if(note !== undefined) {
            const newNote = {...note, ID: ID++};
            newNote.tags.addTag(tagModule.createTag.fromStr(`project:${this.name}`));
            noteList.push(newNote);
        }
    }

    //Removing
    function removeNote (ID) {
        pubsub.publish('log','removeNote', `${this.name} project; note.js:removeNote invoke`);
        const noteIndex = this.getNoteIndex(ID);
        if(noteIndex != -1) 
            noteList.splice(noteIndex, 1);
    }

    //Editting
    function editNote ({ID = -1, ...edittedNote}) {
        pubsub.publish('log','editNote', `${this.name} project; note.js:editNote invoke`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        const obj = this.getNote(ID);
        if(obj !== undefined) {
            Object.assign(obj, edittedNote);
        }
    }

    //Reading
    function getNoteList()  {
        const list = JSON.parse(JSON.stringify(noteList));
        pubsub.publish('log','getNoteList', `${this.name} project; note.js:getNoteList returned this:\n${JSON.stringify(list)}`);
        return noteList;
    }

    function getNote(ID) {
        //Since ID should only be one 1
        const obj = noteList.filter(note => note.ID == ID)[0];
        pubsub.publish('log','getNote', `${this.name} project; note.js:getNote returned this:\n${JSON.stringify(obj)}`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        return obj;
    }

    function getNoteIndex(ID) {
        return noteList.findIndex(note => note.ID == ID);
    }

    //Interaction with other projects
    function moveNote(ID, destProject) {
        const note = this.getNote(ID);
        note.tags.removeTag(`project:${this.name}`);
        destProject.addNote(this.getNote(ID));
        this.removeNote(ID);
    }

    function duplicateNote(ID, ...destProjs) {
        const note = this.getNote(ID);
        note.tags.removeTag(`project:${this.name}`);
        destProjs.forEach((proj) => proj.addNote(note));
    }


    
    //Filter note by tag
    //Tag module related operation
    /*
    function filterByTag(searchingTag){
        return noteList.filter(({tags}) => tags.some((tag) => tag == searchingTag));
    }

    function addTag(ID) {
        pubsub.publish('create', 'add-tag-to-note', tag);
    }

    function removeTag(ID, tag) {
        const note = this.getNote(ID);
        note.tags.splice(note.tags.indexOf(tag),1);
    }

    //If tag exists
    function checkForTag(ID, searchingTag){
        return (this.getNote(ID)).tags.some((tag) => tag == searchingTag);
    }*/

    return Object.assign(Object.create({
            //Note operations
            createNote, addNote, removeNote, editNote, getNote, getNoteList, getNoteIndex,
            //Tagging system
            //filterByTag, addTag, checkForTag, removeTag,
            //Notes and Projects operations
            moveNote, duplicateNote,
        }),
        state,
    );
}

//For testing purposes
function noteImportTest () {
    return 'Note module import successful';
}

module.exports = {Project, noteImportTest};