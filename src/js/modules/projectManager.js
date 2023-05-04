const {Project} = require('./project');
const {Todo} = require('./sub_modules/project/todo');
const {parse} = require('date-fns')
const pubsub = require('./pubsub');

const projectManager = {
    ID: 0,
    projects: [],
    addProject: function (...projs) {
        projs.forEach(proj => this.projects.push(proj));
        pubsub.publish('save', 'projectManagerModule-saveChanges');
    },
    createProject: function (name) {
        return {ID: this.ID++, projectData: Project(name)};
    },
    removeProject: function (ID) {
        const removedProject = this.projects.splice(this.getProjectIndex(ID), 1);
        pubsub.publish('save', 'projectManagerModule-saveChanges');
        return removedProject;
    },
    clearProjectList: function () {
        const removedProjects = this.projects.splice(0, this.projects.length);
        pubsub.publish('save', 'projectManagerModule-saveChanges');
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
        console.log(parsedImport);
        parsedImport.forEach((importProject, index) => {
            console.log(importProject);
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
        this.projects.forEach(proj => {
            exportedProjects.push(proj.projectData.getState());
        });
        localStorage.setItem('exported-projects', JSON.stringify(exportedProjects));
    },
};

//Project manager module is listening for changes in any project
//or any changes made to the project manager that's meaningful
//then perform a save. Now this is an idea, since we subscribe to react
//whenever we see changes, and we publish everytime there's a change
//that would means, instead of saving everything regardless of it's changed or not.
//We can publish the data that's changed, and we can only save changes and not everything. 
//This should save the performance. (Not implemented)
pubsub.subscribe('projectManager', 'save', 'projectManagerModule-saveChanges', saveChanges);
function saveChanges() {
    console.log('Project manager save changes!');
    projectManager.saveProjects();
}

//For display module
function getData() {
    pubsub.publish('read', 'projectManagerModule-getData', projectManager.getProjectList());
}

pubsub.subscribe('projectManager', 'add', 'add-project', (project) => {
    console.log('read-projectList-received');
    projectManager.addProject(project);
    console.log(projectManager.getProjectList());
    getData();
});

function projectManagerImportTest() {
    return 'ProjectManager module import successful';
}

module.exports = {projectManager, projectManagerImportTest};