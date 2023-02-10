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


    Notes and checklist if possible
*/
require('../scss/style.scss');

const {format} = require('date-fns');
const pubsub = require('./modules/pubsub');
const note   = require('./modules/note');
const logger = require('./modules/logger');
const display = require('./modules/display');

//Html logger
const htmlLogger = logger.Logger('htmlLogger');
const logToHtml = (msg) => {
    htmlLogger.log(msg); 
    pubsub.publish('log', 'htmlLogger-logs', htmlLogger.getLog());
};
//pubsub.subscribe('htmlLogger', 'log', 'createNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'addNote', logToHtml);
pubsub.subscribe('htmlLogger', 'log', 'getNoteList', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'getNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'removeNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'editNote', logToHtml);

const inbox = note.Project('Inbox');
inbox.addNote(note.Project.createTestNote());
inbox.addNote(note.Project.createTestNote());
inbox.addNote(note.Project.createTestNote());
inbox.addNote(note.Project.createTestNote());
inbox.addNote(note.Project.createTestNote());
inbox.getNoteList();