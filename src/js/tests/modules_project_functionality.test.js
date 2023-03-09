const {format} =  require('date-fns');
const {Project} = require('../modules/project');
const {Todo} = require('../modules/sub_modules/project/todo');
const {Tag, TagList}= require('../modules/sub_modules/project/tag');

function makeTestProject (name) {
    const testProject = Project(name);
    testProject.addTodo(
        Todo(
            'Something for A', 
            'random description for A',
            'content: any random content goes here',
            new Date(1971,12,1), 'dd/MM/yyyy',
            'normal',
            ['programming:Javascript', 'functional-programming:Haskell']
        )
    );
    testProject.addTodo(
        Todo(
            'Something for B', 
            'random description for B',
            'content: any random content goes here',
            new Date(1969,4,3), 'dd/MM/yyyy',
            'normal',
            ['programming:C', 'functional-programming:Elixir']
        )
    );
    testProject.addTodo(
        Todo(
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

//Testing todo functionality
//Variables and configuration for testing
const resultNoteA = {
    ID: 0,
    title: 'Something for A',
    description :'random description for A',
    content: 'content: any random content goes here',
    dueDate: format(new Date(1971, 12, 1), 'dd/MM/yyyy'),
    priority: 'normal',
    tags: TagList('default-name').addTag(
        ...['programming:Javascript', 'functional-programming:Haskell','project:testProjectA'].map(i => Tag.fromStr(i))
    ),
    todoStatus: 'unfinished',
}

//The tests themselves
test('Todo reading' ,() => {
    expect(testProjectA.getTodo(-1)).toStrictEqual(undefined);
    expect(testProjectA.getTodo(0)).toStrictEqual(resultNoteA);
    expect(testProjectA.getTodo(3)).toStrictEqual(undefined);
});

test('Todo edditting', () => {
    resultNoteA.title = 'Special thing for A*';

    //This makes a different
    testProjectA.editTodo({ID: 0, title: 'Special thing for A*'});
    //While this will not because there's no ID for this object.
    testProjectA.editTodo({title: 'HuHueHue something else'});

    expect(testProjectA.getTodo(0)).toStrictEqual(resultNoteA);
});

test('Todo removing', () => {
    //This matters
    testProjectA.removeTodo(0);
    //While this does nothing
    testProjectA.removeTodo(-1);
    expect(testProjectA.getTodo(0)).toStrictEqual(undefined);
});

//Between projects
//Moving todos around projects
const testProjectB = makeTestProject('testProjectB');
const testProjectC = makeTestProject('testProjectC');

test('Duplicate/Moving between projects', () => {
    //Duplicating
    testProjectC.duplicateTodo(0, testProjectB);
    expect(testProjectB.getTodo(3)).toStrictEqual(
        {...testProjectC.getTodo(0), ID: 3}
    );

    //Moving
    testProjectC.moveTodo(0, testProjectB);
    expect(testProjectB.getTodo(4)).toStrictEqual({...testProjectB.getTodo(3), ID: 4});
    expect(testProjectC.getTodo(0)).toStrictEqual(undefined);
});


// Old tests
////Duplicate notes to projects
//test('Duplicating note from one project to project(s)', () => {
//    testProjectB.duplicateTodo(0, testProjectA, testProjectC);
//    expect(testProjectA.getTodo(1)).toStrictEqual({...testNoteB, ID: 1});
//    expect(testProjectC.getTodo(1)).toStrictEqual({...testNoteB, ID: 1});
//});
//
//test('Duplicating note from itself', () => {
//    testProjectB.duplicateTodo(0, testProjectB);
//    expect(testProjectB.getTodo(2)).toStrictEqual({...testNoteB, ID: 2});
//});
//
////Tagging system
////Filtering tag
////test('Filtering note from a Project', () => {
////    testProjectB.editTodo({ID: 0, tags: ['UniqueTag']});
////    testProjectB.editTodo({ID: 0, tags: ['UniqueTag']});
////    testProjectB.editTodo({ID: 1, tags: ['UniqueTag']});
////    expect(testProjectB.filterByTag('UniqueTag')).toStrictEqual([
////        Object.assign({...note.Project.createTestNote(), title: 'Something for B', ID: 0, tags: ['UniqueTag']}),
////        Object.assign({...note.Project.createTestNote(), title: 'Something for C', ID: 1, tags: ['UniqueTag']}),
////    ]);
////});
////
//////Check duplicate tags
////const testProjectD = note.Project('testProjectD');
////testProjectD.addTodo({...note.Project.createTestNote(), title: 'Something for D'});
////testProjectD.editTodo({ID: 0, tags: ['tag A', 'tag A']});
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