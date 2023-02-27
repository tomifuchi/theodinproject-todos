/*
    ========================================================================================
    STATUS      TASKS
    OK    * Every note must have a project tag so we know which project it belongs to.
    OK    * Every note must have atleast one section tag.
    OKISH * Tagging system
    NOPE  * Search note by content, this feature might takes too long to complete. 
    INPROGRESS * Front end design
    ========================================================================================

    Brain storming on how we could go about creating todos

    *At a minimum they should have a title, description, dueDate and priority. 
    You might also want to include notes or even a checklist.

    Features for todos item:
        Title
        Description
        Due date
        Priority

    * Our todo list should have projects or separate lists of todos. 
    When a user first opens the app, there should be some sort of ‘default’ project to which all of their todos are put. 
    Users should be able to create new projects and choose which project their todos go int

    * Thinking with module

    * UI is up to me


    * What can it do ?
        1 view all projects
        2 view all todos in each project (probably just the title and duedate… perhaps changing color for different priorities)
        3 expand a single todo to see/edit its details
        4 delete a todo

    Use local storage to persists data when reload, and can reload save file aswel. Try diving in see
    what happens.

    Very simple interface and foundation work can be work on right now
    my todo's revolves around tagging things to categorize things. And ofcourse that's a feature to implement
    later. NOw should be laying foundation that we can do this

    Let's create a working prototype for this to work without display then design the UI and shit later.
    It can change but the logic will not.

    Note:
        + Somesort of project managers: it can do usual shit like C.R.E.D
        + Duedate can be days or time from now. like after 2 days or some shit.
        + Local storage


    Notes and checklist if possible

    **Tagging system
    
    //Let's say note#0 and note#1, note 2 in a project education
    note0 = {
        title: 'Learn functional programming in Haskell then use it in Javascript',
        description: 'Trying to master fucntional programming',
        content: 'Go through chapter 4 of Real world Haskell',
        dueDate: '13/12/24',
        priority: 'Normal',
        tags: ['project:education', 'section:programming', 'anything:Javascript', 'anything:Haskell', 'anything:functional-programming'],
        noteStatus: 'unfinished'
    };
    
    note1 = {
        title: 'Fix bug in InteractWith.hs using id as custom function',
        description: '',
        content: 'Use ghci to fix InteractWith.hs bug using id as function\n although the function works, it doesnt look good.',
        dueDate: '12/12/24',
        priority: 'Normal',
        tags: ['project:education', 'section:fixbug', 'anything:Javascript', 'anything:Haskell', 'anything:functional-programming'],
        noteStatus: 'unfinished',
    };

    note2 = {
        title: 'Find a way to write proof using negation exercise 15 of Linear algebra book',
        description: '',
        content: 'Ask teacher for help on exercise 15 page 155',
        dueDate: '10/12/24',
        priority: 'Normal',
        tags: ['project:education', 'section:mathematics', 'anything:linear-algebra'],
        noteStatus: 'unfinished',
    };



    //Then a tagRecord in the database might look like this
    const tagRecord = {
        project: {
            mockProjectA: [IDs],
            education: [0, 1, 2],
        },
        section: {
            mockSectionA: [IDs],
            mockSectionB: [IDs],
            mathematics: [2],
            fixbug: [1],
            programming: [0],
        }
        anything: {
            untagged: [IDs],
            topicA: [IDs],
            topicB: [IDs],
            linear-algebra: [2],
            Javascript: [0, 1],
            Haskell: [0, 1],
            functional-programming: [0,1],
        }
    }

    Then when we search we can type this into the search bar
    project:education 
    //=> [0, 1]
    If we continues typing
    project:education section:mathematics
    //=> [2]
    Or if we forget the project and the section we can type
    anything:Haskell
    //=> [0, 1]

    This is gauranteed, we can search for any note using any methods, proejcts, section or anything.
    If they're untagged, just type anthing:untagged
    

    * Taggin syntax is identifer:topic
    * Requirement tags are automatically created with a note creation by adding project:${project-name} and section:${section-name},
    if project is not created it will be default-project, if section is not created a default-section will be used. 

    * User-defined tags: can create any category by using the tagging syntax identifer:topic, for example:
    functional-programming:Haskell, webdevelopment:Javascript or even functionalProgramming:Haskell. And if identifer
    is not set it's automatically put into the anything:topic-goes-here or anything category.

    (Note: Duplicates like functional-programming or functionalProgramming should be the same but this problem might go
    unfixed due to it's complexity (This might need some skills in regularexpression to solve)

    * Searching tags this is the operation that this system is created for. For now
    let's think simple first, typing identifier:topic chain this together to nail down
    the search. That's it.
*/

require('../scss/style.scss');

const pubsub = require('./modules/pubsub');
const note   = require('./modules/note');
const logger = require('./modules/logger');
const display = require('./modules/display');

//Html logger
const htmlLogger = logger.Logger('htmlLogger');
const logToHtml = (msg) => {
    htmlLogger.log(msg); 
    pubsub.publish('log', 'htmlLogger-logs', htmlLogger.getLog());
};

//pubsub.subscribe('htmlLogger', 'log', 'createNote', logToHtml);
pubsub.subscribe('htmlLogger', 'log', 'addNote', logToHtml);
pubsub.subscribe('htmlLogger', 'log', 'getNoteList', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'getNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'removeNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'editNote', logToHtml);


function makeTestProject (name) {

    const testProject = note.Project(name);
    testProject.addNote(
        testProject.createNote(
            'Note title A', 
            'random description for A',
            'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
            new Date(1971,12,1), 'dd/MM/yyyy',
            'normal',
            ['programming:Javascript', 'functional-programming:Haskell']
        )
    );
    testProject.addNote(
        testProject.createNote(
            'Something for B', 
            'random description for B',
            'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
            new Date(1969,4,3), 'dd/MM/yyyy',
            'normal',
            ['programming:C', 'functional-programming:Elixir']
        )
    );
    testProject.addNote(
        testProject.createNote(
            'Note title for note C', 
            'random description for C',
            'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
            new Date(1953,7,3), 'dd/MM/yyyy',
            'normal',
            ['rock-band:guitar', 'learn-music:read-music-sheet']
        )
    );
    return testProject;
}

const inbox = makeTestProject('Inbox');
const education = makeTestProject('Education');
const programming = makeTestProject('Programming');
const somethingElse = makeTestProject('SomethingElse');
const projects = [inbox,education,programming, somethingElse];

display.init(projects);

/*
inbox.addNote(inbox.createNote(
    'Automaticlly refresh to this shit.', 
    'random description for D',
    'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
    new Date(1953,7,3), 'dd/MM/yyyy',
    'normal',
    ['rock-band:guitar', 'learn-music:read-music-sheet']
));

education.addNote(inbox.createNote(
    'Automaticlly refresh to this shit.', 
    'random description for D',
    'content: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam fugit assumenda fuga obcaecati non, id laudantium quis necessitatibus dolores animi in quasi iste qui, totam, excepturi ad saepe delectus tempora.',
    new Date(1953,7,3), 'dd/MM/yyyy',
    'normal',
    ['rock-band:guitar', 'learn-music:read-music-sheet']
));
*/