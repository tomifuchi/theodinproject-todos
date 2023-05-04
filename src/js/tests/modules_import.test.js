const pubsub = require('../modules/pubsub');
const project = require('../modules/project');
const projectManager = require('../modules/projectManager');

//Testing imports
test('Invoke pubsub module confirmation test', () => {
    expect(pubsub.pubsubTest()).toBe('Pubsub module import successful');
});

test('Invoke project module confirmation test', () => {
	    expect(project.projectImportTest()).toBe('Project module import successful');
});

test('Invoke projectManager module confirmation test', () => {
	    expect(projectManager.projectManagerImportTest()).toBe('ProjectManager module import successful');
});