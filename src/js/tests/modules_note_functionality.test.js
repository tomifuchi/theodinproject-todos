const {format} =  require('date-fns');
const note   = require('../modules/note');
const tagModule = require('../modules/sub_modules/tag');


function makeTestProject (name) {

    const testProject = note.Project(name);
    testProject.addNote(
        testProject.createNote(
            'Something for A', 
            'random description for A',
            'content: any random content goes here',
            new Date(1971,12,1), 'dd/MM/yyyy',
            'normal',
            ['programming:Javascript', 'functional-programming:Haskell']
        )
    );
    testProject.addNote(
        testProject.createNote(
            'Something for B', 
            'random description for B',
            'content: any random content goes here',
            new Date(1969,4,3), 'dd/MM/yyyy',
            'normal',
            ['programming:C', 'functional-programming:Elixir']
        )
    );
    testProject.addNote(
        testProject.createNote(
            'Something for C', 
            'random description for C',
            'content: any random content goes here',
            new Date(1953,7,3), 'dd/MM/yyyy',
            'normal',
            ['rock-band:guitar', 'learn-music:read-music-sheet']
        )
    );
    return testProject;
}

const testProjectA = makeTestProject('testProjectA');

//Testing note functionality
//Variables and configuration for testing
const resultNoteA = {
    ID: 0,
    title: 'Something for A',
    description :'random description for A',
    content: 'content: any random content goes here',
    dueDate: format(new Date(1971, 12, 1), 'dd/MM/yyyy'),
    priority: 'normal',
    tags: tagModule.createTagList('default-name').addTag(
        ...['programming:Javascript', 'functional-programming:Haskell','project:testProjectA'].map(i => tagModule.createTag.fromStr(i))
    ),
    noteStatus: 'unfinished',
}

//The tests themselves
test('Note reading' ,() => {
    expect(testProjectA.getNote(-1)).toStrictEqual(undefined);
    expect(testProjectA.getNote(0)).toStrictEqual(resultNoteA);
    expect(testProjectA.getNote(3)).toStrictEqual(undefined);
});

test('Note edditting', () => {
    resultNoteA.title = 'Special thing for A*';

    //This makes a different
    testProjectA.editNote({ID: 0, title: 'Special thing for A*'});
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
const testProjectB = makeTestProject('testProjectB');
const testProjectC = makeTestProject('testProjectC');

test('Duplicate/Moving between projects', () => {
    //Duplicating
    testProjectC.duplicateNote(0, testProjectB);
    expect(testProjectB.getNote(3)).toStrictEqual(
        {...testProjectC.getNote(0), ID: 3}
    );

    //Moving
    testProjectC.moveNote(0, testProjectB);
    expect(testProjectB.getNote(4)).toStrictEqual({...testProjectB.getNote(3), ID: 4});
    expect(testProjectC.getNote(0)).toStrictEqual(undefined);
});


// Old tests
////Duplicate notes to projects
//test('Duplicating note from one project to project(s)', () => {
//    testProjectB.duplicateNote(0, testProjectA, testProjectC);
//    expect(testProjectA.getNote(1)).toStrictEqual({...testNoteB, ID: 1});
//    expect(testProjectC.getNote(1)).toStrictEqual({...testNoteB, ID: 1});
//});
//
//test('Duplicating note from itself', () => {
//    testProjectB.duplicateNote(0, testProjectB);
//    expect(testProjectB.getNote(2)).toStrictEqual({...testNoteB, ID: 2});
//});
//
////Tagging system
////Filtering tag
////test('Filtering note from a Project', () => {
////    testProjectB.editNote({ID: 0, tags: ['UniqueTag']});
////    testProjectB.editNote({ID: 0, tags: ['UniqueTag']});
////    testProjectB.editNote({ID: 1, tags: ['UniqueTag']});
////    expect(testProjectB.filterByTag('UniqueTag')).toStrictEqual([
////        Object.assign({...note.Project.createTestNote(), title: 'Something for B', ID: 0, tags: ['UniqueTag']}),
////        Object.assign({...note.Project.createTestNote(), title: 'Something for C', ID: 1, tags: ['UniqueTag']}),
////    ]);
////});
////
//////Check duplicate tags
////const testProjectD = note.Project('testProjectD');
////testProjectD.addNote({...note.Project.createTestNote(), title: 'Something for D'});
////testProjectD.editNote({ID: 0, tags: ['tag A', 'tag A']});
////
////test('Checking for duplicated tags', () => {
////    expect(testProjectD.checkForTag(0, 'tag A')).toBe(true);
////});
////
////test('Adding duplicate tag', () => {
////    expect(testProjectD.addTag(0, 'tag A')).toBe(undefined);
////});
////
//////Removing tags
////test('Testing for removing the tag', () => {
////    testProjectD.removeTag(0, 'tag A');
////    testProjectD.removeTag(0, 'tag A');
////    expect(testProjectD.checkForTag(0, 'tag A')).toBe(false);
////});