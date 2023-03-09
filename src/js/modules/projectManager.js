const {Project} = require('./project');
const pubsub = require('./pubsub');

const projectManager = {
    ID: 0,
    projects: [],
    addProject: function (...projs) {
        projs.forEach(proj => this.projects.push({ID: this.ID++, project: proj}));
    },
    createProject: function (name) {
        return Project(name);
    },
    removeProject: function (ID) {
        return this.projects.splice(this.getProjectIndex(ID), 1);
    },
    clearProjectList: function () {
        return this.projects.splice(0, this.projects.length);
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
    importProjectManager: function(importedProjectManager) {
    },
    exportProjectManager: function (){
    },
};

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