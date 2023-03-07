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
    clearProjectList: function () {
        return this.projects.splice(0, this.projects.length);
    },
    getProjectByName: function(name) {
        return this.projects.filter(project => project.name == name);
    },
    getProjectList: function () {
        return this.projects;
    }
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