### Notes on this project

Very simple and crude implementation of todo app, alot of rooms for imporvement. Alot of experiences and lessons took from this application.

With a little bit more time put into this, and a beautiful UI this can be a very good application.

### Modules

___

These modules are designed to be as polymorphic as possible, that means these
modules can be ripped out and use in other projects. We
can then compose these modules together with some modification for specific application

Interaction between modules are handled by publish/subscribe module. Via publish
with argument and subscribe with arguments to listen for state change.

Here's a table for brief summary what modules this application have and what does each module does:

|Name | Purpose|
|-----|-------|
|pubsub.js| Simple implementation of publish/subscribe pattern in a module
|logger.js| Logger object use to log things.
|projectManager.js| Single object manages projects
|project.js| Declartion for Project properties, operations to manipulate Todo object
|display.js| Frontend for application

In the submodule folder

|Name | Belongs to | Purpose|
|-----|------------|--------|
|todo.js|project.js| Todo object |
|tag.js| todo.js| Tagging system for Todo object|
|domUtils.js| display.js| Various DOM ultilies|
|form.js| display.js| Handle form for display.js|


Below will explain what module does what and how they are designed.

#### **logger.js**

Returns a simple logger object with logging methods.

#### **pubsub.js**

Ultilizing publish-subscribe pattern let us achieve one thing. Decoupling code, by first separating our application into modules then combine/composing them together we can create an application. 

Using the Publish-Subscribe pattern is especially useful when working with large
software projects with many components. By decoupling objects and following
SOLID principles, we can more easily maintain and update software,
without affecting other parts of the codebase. Additionally, the application can
be scaled more efficiently, as components can be added/replace/remove without affecting too much on existing components. 

The Dependency Inversion Principle states that high-level modules should not
depend on low-level modules but should depend on abstraction. In the context of
Publish-Subscribe, the publisher and subscribers are both low-level modules, but
they rely on the abstraction provided by the events (in this implementation, message and arguments) they exchange. This
means that the publisher and subscribers depend on abstractions rather than each
other. Thus, the Dependency Inversion Principle is satisfied.

Limitation do exists, this pattern is suitable for small to medium size application
anything larger than that require different pattern, Also not addressing the
security or error checking here. Read more here

[Wikipedia on publish subscribe pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

Normally the implementation only have a callback to be then invoke when 
something published, and have other elements subscribe to it. In my implementation, we can optionally passed parameters when we publish, we can then design subscribers callback to take in such parameters. This allows modules to pass data. (This might or might not be a good idea)

### **display.js**
Responsible for rendering, displaying the current state of 
projectManager object and projects/todos. The application will
still work as intended even if display.js is not there. Logs should
be inserted for this style to works.

### **todo.js**
Atom of the whole application, todo.js is the declaration of the todo object. Along with tag.js is part of todo.js

### **project.js**
A project that manages Todos, it can edit, copy, delete. Duplicate to
other projects, move todos around to other projects.

### **projectManager.js**
Manges Project objects. It detect changes made to projects, todos, and itself, then automatically save when there're changes made.

**Front end UI**:

font choice: 
* press-start-2p: https://www.fontspace.com/press-start-2p-font-f11591