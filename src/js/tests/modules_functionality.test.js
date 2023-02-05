const {format} = require('date-fns');

const pubsub = require('../modules/pubsub');
const note   = require('../modules/note');
const logger = require('../modules/logger');

//Testing pubsub functionality
let mess = ''
function message(){
   mess = 'Message Fire!'; 
}

test('Pubsub module subscribe and publish test', () => {
    expect((() => {
        pubsub.subscribe('test','log','subscribe-publish-test', message);
        pubsub.publish('log','subscribe-publish-test');
        return mess;
    })()).toBe('Message Fire!');
});

test('Pubsub module unsubscribe test', () => {
    expect((() => {
        mess = '';
        pubsub.unsubscribe('test','log','subscribe-publish-test');
        pubsub.publish('log','subscribe-publish-test');
        return mess;
    })()).toBe('');
});

//Testing note functionality
//Variables and configuration for testing
const resultNoteA = {
    ID: 0,
    title: 'Random title',
    description :'Any description',
    content: 'content: Anything goes here',
    dueDate: format(new Date(1971, 11, 1), 'dd/MM/yyyy'),
    priority: 'normal',
    tags: ['tag A', 'tag B', 'tag C']
}
const testNoteA =  note.randomNote();
note.addNote(testNoteA);

//The tests themselves
test('Note creation', () => {
    expect(testNoteA).toStrictEqual(resultNoteA);
});

test('Note reading' ,() => {
    expect(note.getNote(-1)).toStrictEqual(undefined);
    expect(note.getNote(0)).toStrictEqual(resultNoteA);
    expect(note.getNote(1)).toStrictEqual(undefined);
    expect(note.getNote(2)).toStrictEqual(undefined);
});

test('Note edditting', () => {
    resultNoteA.title = 'Something for A';

    //This makes a different
    note.editNote({ID: 0, title: 'Something for A'});
    //While this will not because there's no ID for this object.
    note.editNote({title: 'HuHueHue something else'});

    expect(note.getNote(0)).toStrictEqual(resultNoteA);
});

test('Note removing', () => {
    //This matters
    note.removeNote(0);
    //While this does nothing
    note.removeNote(-1);
    expect(note.getNote(0)).toStrictEqual(undefined);
});

//Testing logger functionality
const testLoggerA = logger.Logger('testLoggerA');
testLoggerA.log('Hello world');

test('Test logging and retreiving logs', () => {
    expect(testLoggerA.getLog()).toBe('0: Hello world\n');
});

const testLoggerB = logger.Logger('testLoggerB');
testLoggerB.log(`Hello world`);

test('Achieve private variables of both loggers to hide their logs through closure and they should have logCounter to be 1', () => {
    expect((() => testLoggerA.logCounter == testLoggerB.logCounter)()).toBe(true);
    expect((() => testLoggerA.getLog() == testLoggerB.getLog())()).toBe(true);
});