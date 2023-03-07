const pubsub = require('../modules/pubsub');
const project = require('../modules/project');
const loggerModule = require('../modules/logger');

//Testing imports
test('Invoke pubsub module confirmation test', () => {
    expect(pubsub.pubsubTest()).toBe('Pubsub module import successful');
});

test('Invoke project module confirmation test', () => {
    expect(project.projectImportTest()).toBe('Project module import successful');
});

test('Invoke logger module confirmation test', () => {
    expect(loggerModule.Logger.loggerImportTest()).toBe('Logger module import successful');
});