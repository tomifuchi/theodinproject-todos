const pubsub = require('../modules/pubsub');
const note = require('../modules/note');
const loggerModule = require('../modules/logger');

//Testing imports
test('Invoke pubsub module confirmation test', () => {
    expect(pubsub.pubsubTest()).toBe('Pubsub module import successful');
});

test('Invoke note module confirmation test', () => {
    expect(note.noteImportTest()).toBe('Note module import successful');
});

test('Invoke logger module confirmation test', () => {
    expect(loggerModule.Logger.loggerImportTest()).toBe('Logger module import successful');
});