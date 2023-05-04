//Modules
const pubsub = require('./pubsub');
//Sub modules
const {Tag} = require('./sub_modules/project/tag');

function Project(name) {

    const state = { name };
    const todoList = [];

    let ID = 0;

    function addTodo(todo) {
        pubsub.publish('log', 'projectModule-addTodo', `${this.name} project; project.js:addTodo invoke`);
        if (todo !== undefined) {
            const newTodo = { ...todo, ID: ID++ };
            newTodo.tags.addTag(Tag.fromStr(`project:${this.name}`));
            todoList.push(newTodo);
        }
        pubsub.publish('save', 'projectManagerModule-saveChanges');
        this.getData();
    }

    //Removing
    function removeTodo(ID) {
        pubsub.publish('log', 'projectModule-removeTodo', `${this.name} project; project.js:removeTodo invoke`);
        const todoIndex = this.getTodoIndex(ID);
        if (todoIndex != -1)
            todoList.splice(todoIndex, 1);
        pubsub.publish('save', 'projectManagerModule-saveChanges');
        this.getData();
    }

    //Editting
    function editTodo({ ID = -1, ...edittedTodo }) {
        pubsub.publish('log', 'projectModule-editTodo', `${this.name} project; project.js:editTodo invoke`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        const todo = this.getTodo(ID);
        if (todo !== undefined) {
            Object.assign(todo, edittedTodo);
        }
        pubsub.publish('save', 'projectManagerModule-saveChanges');
        this.getData();
    }

    //Reading
    function getTodoList() {
        pubsub.publish('log', 'projectModule-getTodoList', `${this.name} project; project.js:getTodoList returned this:\n${JSON.stringify(todoList)}`);
        return todoList;
    }

    function getTodo(ID) {
        //Since ID should only be one 1
        const resultTodo = todoList.filter(todo => todo.ID == ID)[0];
        pubsub.publish('log', 'projectModule-getTodo', `${this.name} project; project.js:getTodo returned this:\n${JSON.stringify(resultTodo)}`); //Unless we learn async, we won't know if the function is sucessfully created or not so this will do for now
        return resultTodo;
    }

    function getTodoIndex(ID) {
        return todoList.findIndex(todo => todo.ID == ID);
    }

    //Interaction with other projects
    //Implement to frontend later
    function moveTodo(ID, destProject) {
        const todo = this.getTodo(ID);
        todo.tags.removeTag(`project:${this.name}`);
        destProject.addTodo(this.getTodo(ID));
        this.removeTodo(ID);
    }

    function duplicateTodo(ID, ...destProjs) {
        const todo = this.getTodo(ID);
        todo.tags.removeTag(`project:${this.name}`);
        destProjs.forEach((proj) => proj.addTodo(todo));
    }

    //This is to the for display module.
    function getData() {
        pubsub.publish('read', 'projectModule-getData', this);
    }

    function getState() {
        return JSON.stringify({name: this.name, todoList: this.getTodoList()});
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

    const project = Object.assign(
        Object.create({
            //Note operations
            addTodo, removeTodo, editTodo, getTodo, getTodoList, getTodoIndex,
            //Tagging system
            //filterByTag, addTag, checkForTag, removeTag,
            //Notes and Projects operations
            moveTodo, duplicateTodo,
            //Data retreival
            getData, getState,
        }),
        state
    );
    pubsub.subscribe(`${project.name}-project`, 'read-request', `${project.name}-project-read-request`, () => { console.log('read-request-received'); console.log(project); project.getData() });

    return project;
}

//For testing purposes
function projectImportTest() {
    return 'Project module import successful';
}

module.exports = {Project, projectImportTest};