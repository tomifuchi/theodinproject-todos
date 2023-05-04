/*
    ========================================================================================
    STATUS      TASKS
    OKISH * Tagging system
    NOPE  * Search note by content, this feature might takes too long to complete. 
    OK    * Review source
    INPROGRESS * Front end design
    INPROGRESS * Finish Readme.md 
    ========================================================================================

    ===============================================
    Current comment on the project:

    If really look into it, we will
    see alot of rooms for improvement. But for now
    the code works this is an MVP not a complete finish
    product.

    Here're a list of todos that if you do choose to revisit
    the project then here it is:

    * Review infomation architecture to see if it make sense.
    * Look at the comments, refined remove clean up the source.
    * Add moving note, duplicating notes to the frontend
    * Searching system, search notes using tags or content
    * Updating and refine tagging system, that is building methods
    or functions that enable us to filter, search using tags or content.

    ===============================================

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
document.getElementsByClassName('mobile-btn')[0].onclick = () => {
    document.getElementsByTagName('nav')[0].classList.toggle('active');
    document.body.classList.toggle('fixed');
}

require('../scss/style.scss');

const pubsub = require('./modules/pubsub');
const {Project}   = require('./modules/project');
const {projectManager} = require('./modules/projectManager');
const {Logger} = require('./modules/logger');
const {Todo} = require('./modules/sub_modules/project/todo');
const display = require('./modules/display');
const form = require('./modules/sub_modules/display/form');

const {addDays} = require('date-fns');


//Html logger
const htmlLogger = Logger('htmlLogger');
const logToHtml = (msg) => {
    htmlLogger.log(msg); 
    pubsub.publish('log', 'htmlLogger-logs', htmlLogger.getLog());
};

//pubsub.subscribe('htmlLogger', 'log', 'createNote', logToHtml);
pubsub.subscribe('htmlLogger', 'log', 'projectModule-addTodo', logToHtml);
pubsub.subscribe('htmlLogger', 'log', 'projectModule-getTodoList', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'getNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'removeNote', logToHtml);
//pubsub.subscribe('htmlLogger', 'log', 'editNote', logToHtml);

//Reload project if exists
const exportedProjects = localStorage.getItem('exported-projects');
if(exportedProjects == null) {
    createPresets();
}
else {
    console.log('LOADED!');
    projectManager.reloadProjects(exportedProjects);
}

//Presets todos and projects
function createPresets() {
    projectManager.addProject(
        projectManager.createProject('inbox'), 
        projectManager.createProject('education'), 
        projectManager.createProject('programming'), 
    );

    [
        Todo(
            'Buy groceries', 
            'Get Milk, eggs, bread, cheese',
            'Write a list',
            new Date(), 'dd/MM/yyyy',
            'normal',
            ['shopping:groceries']
        ),
        Todo(
            'Plan vacation', 
            'Research destination and book flights',
            'Make a spread sheet',
            addDays(new Date(), 1), 'dd/MM/yyyy',
            'normal',
            ['vacation:hawaii']
        ),
        Todo(
            'Call Mom', 
            'Check in and talk for 15 minutes',
            'Write a script',
            addDays(new Date(), 7), 'dd/MM/yyyy',
            'normal',
            ['communication:phone-call', 'family:mom']
        ),
    ].forEach(todo => projectManager.getProjectByName('inbox').projectData.addTodo(todo));

    [
        Todo(
            'Learn about functional programming', 
            'Read about functional programming and try to write some code',
            'Write a script implementing a calculator',
            addDays(new Date(), 3), 'dd/MM/yyyy',
            'high',
            ['programming:functional-programming', 'progrmaming:haskell']
        ),
        Todo(
            'Create a simple webapp', 
            'Design a simple web app layout and implement it using React',
            'Write component displaying todolist',
            addDays(new Date(), 60), 'dd/MM/yyyy',
            'normal',
            ['web-development:React', 'javascript:React']
        ),
        Todo(
            'Implement a simple game using game engines',
            'Choose a game engine (e.g. Unity, Unreal Engine) and implement a simple game',
            'Write a script to move a player character around and collect coins',
            addDays(new Date(), 20), 'dd/MM/yyyy',
            'high',
            ['game-development:game-engine', 'c#:Unity', 'cpp:Unreal Engine']
        ),
    ].forEach(todo => projectManager.getProjectByName('programming').projectData.addTodo(todo));

    [
        Todo(
            'Learn about Linear Algebra',
            'Read about the basics of Linear Algebra and try solving some practice problems',
            'Write a script to implement a simple linear regression model',
            new Date(), 'dd/MM/yyyy',
            'normal',
            ['education:Linear Algebra', 'math:Linear Algebra']
        ),
        Todo(
            'Learn a new programming language',
            'Choose a programming language you haven\'t used before and write a simple program',
            'Write a program to calculate the factorial of a number',
            addDays(new Date(), 1), 'dd/MM/yyyy',
            'normal',
            ['programming-language:Rust']
        ),
        Todo(
            'Study for an upcoming exam',
            'Create a study schedule for an upcoming exam and review the material',
            'Write a script to create a study schedule for the exam',
            addDays(new Date(), 7), 'dd/MM/yyyy',
            'normal',
            ['exam:upcoming-exam']
        ),
    ].forEach(todo => projectManager.getProjectByName('education').projectData.addTodo(todo));
}

display.init(projectManager);