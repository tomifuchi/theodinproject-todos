const {format} =  require('date-fns');
const note   = require('../modules/note');

//Testing note functionality
//Variables and configuration for testing
const resultNoteA = {
    ID: 0,
    title: 'Random title',
    description :'Any description',
    content: 'content: Any random content goes here',
    dueDate: format(new Date(1971, 11, 1), 'dd/MM/yyyy'),
    priority: 'normal',
    tags: ['tag A', 'tag B', 'tag C'],
    noteStatus: 'unfinished',
}
const testProjectA = note.Project('testProjectA');
const testNoteA =  note.Project.createTestNote();
testProjectA.addNote(testNoteA);

//The tests themselves
test('Note creation', () => {
    expect(testNoteA).toStrictEqual(resultNoteA);
});

test('Note reading' ,() => {
    expect(testProjectA.getNote(-1)).toStrictEqual(undefined);
    expect(testProjectA.getNote(0)).toStrictEqual(resultNoteA);
    expect(testProjectA.getNote(1)).toStrictEqual(undefined);
    expect(testProjectA.getNote(2)).toStrictEqual(undefined);
});

test('Note edditting', () => {
    resultNoteA.title = 'Something for A';

    //This makes a different
    testProjectA.editNote({ID: 0, title: 'Something for A'});
    //While this will not because there's no ID for this object.
    testProjectA.editNote({title: 'HuHueHue something else'});

    expect(testProjectA.getNote(0)).toStrictEqual(resultNoteA);
});

test('Note removing', () => {
    //This matters
    testProjectA.removeNote(0);
    //While this does nothing
    testProjectA.removeNote(-1);
    expect(testProjectA.getNote(0)).toStrictEqual(undefined);
});

//Between projects
//Moving notes around projects
const testProjectB = note.Project('testProjectB');
const testProjectC = note.Project('testProjectC');
testNoteB = {...note.Project.createTestNote(), title: 'Something for B'};
testProjectB.addNote(testNoteB);

const testNoteC = {...note.Project.createTestNote(), title: 'Something for C'};
testProjectC.addNote(testNoteC);

test('Moving notes between projects', () => {
    testProjectC.moveNote(0, testProjectB);
    expect(testProjectB.getNote(1)).toStrictEqual({...testNoteC, ID: 1});
    expect(testProjectC.getNote(0)).toStrictEqual(undefined);
});

//Duplicate notes to projects
test('Duplicating note from one project to project(s)', () => {
    testProjectB.duplicateNoteToProj(0, testProjectA, testProjectC);
    expect(testProjectA.getNote(1)).toStrictEqual({...testNoteB, ID: 1});
    expect(testProjectC.getNote(1)).toStrictEqual({...testNoteB, ID: 1});
});

test('Duplicating note from itself', () => {
    testProjectB.duplicateNoteToProj(0, testProjectB);
    expect(testProjectB.getNote(2)).toStrictEqual({...testNoteB, ID: 2});
});