//Modules
const pubsub = require('./pubsub');
const {format} = require('date-fns');

function Project(name) {
    
    const state = {name};

    const noteList = [];
    const tagDataBase = {
        projects: [],
        topics: [],
        checkDuplicates: function (list, newTag) {
            return this[list].some((tag) => tag == newTag);
        },
    };

    let ID = 0;

    //Creation
    function createNote (title, description, content, dueDate, dueDateformat='dd/MM/yyyy', priority, tags) { 
        pubsub.publish('log','createNote', `${this.name} note.js:createNote invoke`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        const state = {
            title, description, content, dueDate: format(dueDate,  dueDateformat), priority, tags, noteStatus: 'unfinished'
        };

        return state;
    }

    function addNote (note) {
        pubsub.publish('log','addNote', `${this.name} project; note.js:addNote invoke`);
        if(note !== undefined) {
            const newNote = {...note, ID: ID++};
            noteList.push(newNote);
            _addRequirementTags(newNote.ID);
        }
    }

    //Removing
    function removeNote (ID) {
        pubsub.publish('log','removeNote', `${this.name} project; note.js:removeNote invoke`);
        const obj = this.getNote(ID);
        if(obj !== undefined) 
            noteList.splice(noteList.indexOf(obj, 1));
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
        return list;
    }

    function getNote(ID) {
        //Since ID should only be one 1
        const obj = noteList.filter(note => note.ID == ID)[0];
        pubsub.publish('log','getNote', `${this.name} project; note.js:getNote returned this:\n${JSON.stringify(obj)}`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        return obj;
    }

    //Interaction with other projects
    function moveNote(ID, destProject) {
        destProject.addNote(this.getNote(ID));
        this.removeNote(ID);
    }

    function duplicateNote(ID, ...destProjs) {
        const note = this.getNote(ID);
        destProjs.forEach((proj) => proj.addNote(note));
    }
    
    //Filter note by tag
    //Tag related operation
    function filterByTag(searchingTag){
        return noteList.filter(({tags}) => tags.some((tag) => tag == searchingTag));
    }

    function _addRequirementTags(ID) {
        this.addTag(ID, `project:${this.name}`);
        //this.addTag(ID, `section:${this.name}`); We will see about this
    }

    function addTag(ID, tag) {
        if(!this.checkForTag(ID, tag))
            (this.getNote(ID)).tags.push(tag);
    }

    function removeTag(ID, tag) {
        const note = this.getNote(ID);
        note.tags.splice(note.tags.indexOf(tag),1);
    }

    //If tag exists
    function checkForTag(ID, searchingTag){
        return (this.getNote(ID)).tags.some((tag) => tag == searchingTag);
    }

    return Object.assign(Object.create({
            //Note operations
            createNote, addNote, removeNote, editNote, getNote, getNoteList,
            //Tagging system
            filterByTag, addTag, checkForTag, removeTag,
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

Project.createTestNote = () => {
    return {
        ID: 0,
        title: 'Random title',
        description: 'Any description',
        content: 'content: Any random content goes here',
        dueDate: format(new Date(1971, 11, 1), 'dd/MM/yyyy'),
        priority: 'normal',
        tags: ['tag A', 'tag B', 'tag C'],
        noteStatus: 'unfinished',
    };
}

module.exports = {Project, noteImportTest};