const note = require('./note');
const pubsub = require('./pubsub');

const projectManager = {
    ID: 0,
    projects: [],
    addProject: function (...projs) {
        projs.forEach(proj => this.projects.push({ID: this.ID++, project: proj}));
    },
    createProject: function (name) {
        return note.Project(name);
    },
    getProjectList: function () {
        return this.projects;
    }
};

function notifyChange() {
    pubsub.publish('read', 'getProjectList', projectManager.getProjectList());
}

pubsub.subscribe('projectManager', 'add', 'add-project', (project) => {
    console.log('read-projectList-received');
    projectManager.addProject(project);
    console.log(projectManager.getProjectList());
    notifyChange();
});

module.exports = {projectManager};