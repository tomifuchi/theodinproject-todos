const pubsub = require('../pubsub');
const {format} = require('date-fns');
const {Tag, TagList} = require('./tag');

function Todo (title, description, content, dueDate, dueDateformat='dd/MM/yyyy', priority, tags) { 
    pubsub.publish('log','todoModule-Todo', `${this.name} todo.js:Todo invoke`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
    const state = {
        title, 
        description, 
        content, 
        dueDate: format(dueDate,  dueDateformat), 
        priority, 
        tags: TagList('default-name'), 
        todoStatus: 'unfinished',
    };
    state.tags.addTag(...tags.map(tag => Tag.fromStr(tag)));

    return state;
}

module.exports = {Todo};