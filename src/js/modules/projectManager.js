const {Project} = require('./project');
const {Todo} = require('./sub_modules/project/todo');
const {parse} = require('date-fns')
const pubsub = require('./pubsub');

const projectManager = {
    ID: 0,
    projects: [],
    addProject: function (...projs) {
        projs.forEach(proj => this.projects.push({ID: this.ID++, project: proj}));
        pubsub.publish('save', 'projectManagerModule-saveChanges');
    },
    createProject: function (name) {
        return Project(name);
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
        return this.projects.filter(project => project.name == name);
    },
    getProjectById: function (ID) {
        return this.projects.filter(project => project.ID == ID)[0];
    },
    getProjectIndex: function (ID) {
        return this.projects.findIndex(project => project.ID == ID);
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
            const {project} = this.getProjectById(index);
            importProject.todoList.forEach(todo => {
                project.addTodo(
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
            exportedProjects.push(proj.project.getState());
        });
        localStorage.setItem('exported-projects', JSON.stringify(exportedProjects));
    },
};

pubsub.subscribe('projectManager', 'save', 'projectManagerModule-saveChanges', saveChanges);
function saveChanges() {
    console.log('save Changes!');
    projectManager.saveProjects();
}

function getData() {
    pubsub.publish('read', 'projectManagerModule-getData', projectManager.getProjectList());
}

pubsub.subscribe('projectManager', 'add', 'add-project', (project) => {
    console.log('read-projectList-received');
    projectManager.addProject(project);
    console.log(projectManager.getProjectList());
    getData();
});

module.exports = {projectManager};