const pubsub = require('./modules/pubsub');
const note   = require('./modules/note');

test('Invoke pubsub module confirmation test', () => {
    expect(pubsub.pubsubTest()).toBe('Confirmation from pubsub');
});

test('Invoke note module confirmation test', () => {
    expect(note.noteTest()).toBe('Confirmation from note');
});