const {Project} = require('./project');
const {Todo} = require('./sub_modules/project/todo');
const {parse} = require('date-fns')
const pubsub = require('./pubsub');

const projectManager = {
    ID: 0,
    projects: [],
    addProject: function (...projs) {
        projs.forEach(proj => this.projects.push(proj));
        pubsub.publish('change', 'projectManagerModule-addProject', this.getProjectList());
    },
    createProject: function (name) {
        return {ID: this.ID++, projectData: Project(name)};
    },
    removeProject: function (ID) {
        const removedProject = this.projects.splice(this.getProjectIndex(ID), 1);
        pubsub.publish('change', 'projectManagerModule-removeProject', this.getProjectList());
        return removedProject;
    },
    clearProjectList: function () {
        const removedProjects = this.projects.splice(0, this.projects.length);
        pubsub.publish('change', 'projectManagerModule-clearProjectList', this.getProjectList());
        return removedProjects
    },
    getProjectByName: function(name) {
        return this.projects.filter(({projectData}) => projectData.name == name)[0];
    },
    getProjectById: function (searchID) {
        return this.projects.filter(({ID}) => ID == searchID)[0];
    },
    getProjectIndex: function (searchID) {
        return this.projects.findIndex(({ID}) => ID == searchID);
    },
    getProjectList: function () {
        return this.projects;
    },
    reloadProjects: function(importedProjects) {
        const parsedImport = (JSON.parse(importedProjects)).map(project => JSON.parse(project));
        parsedImport.forEach((importProject, index) => {
            this.addProject(this.createProject(importProject.name));
            const {projectData} = this.getProjectById(index);
            importProject.todoList.forEach(todo => {
                projectData.addTodo(
                    Todo(
                        todo.title,
                        todo.description,
                        todo.content,
                        parse(todo.dueDate, 'dd/MM/yyyy', new Date()),
                        'dd/MM/yyyy',
                        todo.priority,
                        todo.tags._tagList.map(tag => `${tag.identifier}:${tag.topic}`)
                    )
                );
            });
        });
    },
    saveProjects: function (){
        const exportedProjects = [];
        this.projects.forEach(({projectData}) => {
            exportedProjects.push(
                JSON.stringify({name: projectData.name, todoList: projectData.getTodoList()})
            )
        });
        localStorage.setItem('exported-projects', JSON.stringify(exportedProjects));
    },
};
//Add remove and clear projectList listening
pubsub.subscribe('projectManager', 'add', 'projectManagerModule-addProject', (name) => projectManager.addProject(projectManager.createProject(name)));
//pubsub.subscribe('projectManager', 'remove', 'projectManagerModule-removeProject', ); //Not implemented yet
//pubsub.subscribe('projectManager', 'remove', 'projectManagerModule-clearProjectList', saveChanges); //Not implemented yet

//Project manager module is listening for changes in any project
//or any changes made to the project manager that's meaningful
//then perform a save. Now this is an idea, since we subscribe to react
//whenever we see changes, and we publish everytime there's a change
//that would means, instead of saving everything regardless of it's changed or not.
//We can publish the data that's changed, and we can only save changes and not everything. 
//This should save the performance. (Not implemented)

//When should you save ?
//Changes made to project Manager
pubsub.subscribe('projectManager', 'change', 'projectManagerModule-addProject', saveChanges);
pubsub.subscribe('projectManager', 'change', 'projectManagerModule-removeProject', saveChanges);
pubsub.subscribe('projectManager', 'change', 'projectManagerModule-clearProjectList', saveChanges);

//Changes made to individual project
pubsub.subscribe('projectManager', 'change', 'projectModule-addTodo', saveChanges)
pubsub.subscribe('projectManager', 'change', 'projectModule-removeTodo', saveChanges)
pubsub.subscribe('projectManager', 'change', 'projectModule-editTodo', saveChanges)
function saveChanges() {
    projectManager.saveProjects();
}


function projectManagerImportTest() {
    return 'ProjectManager module import successful';
}

module.exports = {projectManager, projectManagerImportTest};