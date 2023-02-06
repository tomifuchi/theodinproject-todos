/*
    Brain storming on how we could go about creating todos

    *At a minimum they should have a title, description, dueDate and priority. 
    You might also want to include notes or even a checklist.

    Features for todos item:
        Title
        Description
        Due date
        Priority

    * Our todo list should have projects or separate lists of todos. 
    When a user first opens the app, there should be some sort of ‘default’ project to which all of their todos are put. 
    Users should be able to create new projects and choose which project their todos go int

    * Thinking with module

    * UI is up to me


    * What can it do ?
        1 view all projects
        2 view all todos in each project (probably just the title and duedate… perhaps changing color for different priorities)
        3 expand a single todo to see/edit its details
        4 delete a todo

    Use local storage to persists data when reload, and can reload save file aswel. Try diving in see
    what happens.


    Very simple interface and foundation work can be work on right now
    my todo's revolves around tagging things to categorize things. And ofcourse that's a feature to implement
    later. NOw should be laying foundation that we can do this

    Let's create a working prototype for this to work without display then design the UI and shit later.
    It can change but the logic will not.

    So

    Create a note
    Add a note
    Diplay that note
    Delete that note
    
*/
require('../scss/style.scss');

const {format} = require('date-fns');
const pubsub = require('./modules/pubsub');
const note   = require('./modules/note');
const logger = require('./modules/logger');
const display = require('./modules/display');

//Html logger
const htmlLogger = logger.Logger('htmlLogger');
const boundHtmlLogMethod = (msg) => {
    htmlLogger.log(msg); 
    pubsub.publish('log', 'htmlLogger-logs', htmlLogger.getLog());
};
pubsub.subscribe('htmlLogger', 'log', 'createNote', boundHtmlLogMethod);
pubsub.subscribe('htmlLogger', 'log', 'addNote', boundHtmlLogMethod);
pubsub.subscribe('htmlLogger', 'log', 'getNoteList', boundHtmlLogMethod);
pubsub.subscribe('htmlLogger', 'log', 'getNote', boundHtmlLogMethod);
pubsub.subscribe('htmlLogger', 'log', 'removeNote', boundHtmlLogMethod);
pubsub.subscribe('htmlLogger', 'log', 'editNote', boundHtmlLogMethod);

note.addNote(note.randomNote());
note.editNote({ID: 0, title: 'What the fuck is going on A side !!!!'});
note.getNoteList();

console.log(htmlLogger.getLog());
