const {format} = require('date-fns');
const {Tag, TagList} = require('./tag');

function Todo (title, description, content, dueDate, dueDateformat='dd/MM/yyyy', priority, tags, todoStatus='unfinished') { 
    const state = {
        title, 
        description, 
        content, 
        dueDate: format(dueDate,  dueDateformat), 
        priority, 
        tags: TagList('default-name'), 
        todoStatus
    };
    state.tags.addTag(...tags.map(tag => Tag.fromStr(tag)));

    return state;
}

module.exports = {Todo};