/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
var __dirname = "/";
/*
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

    So

    Create a note
    Add a note
    Diplay that note
    Delete that note
    
*/
//import * as pubsub from './modules/pubsub.js';
console.log(__dirname);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FBLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDQyxTQUFTLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RoZW9kaW5wcm9qZWN0LXRvZG9zLy4vc3JjL2pzL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgQnJhaW4gc3Rvcm1pbmcgb24gaG93IHdlIGNvdWxkIGdvIGFib3V0IGNyZWF0aW5nIHRvZG9zXG5cbiAgICAqQXQgYSBtaW5pbXVtIHRoZXkgc2hvdWxkIGhhdmUgYSB0aXRsZSwgZGVzY3JpcHRpb24sIGR1ZURhdGUgYW5kIHByaW9yaXR5LiBcbiAgICBZb3UgbWlnaHQgYWxzbyB3YW50IHRvIGluY2x1ZGUgbm90ZXMgb3IgZXZlbiBhIGNoZWNrbGlzdC5cblxuICAgIEZlYXR1cmVzIGZvciB0b2RvcyBpdGVtOlxuICAgICAgICBUaXRsZVxuICAgICAgICBEZXNjcmlwdGlvblxuICAgICAgICBEdWUgZGF0ZVxuICAgICAgICBQcmlvcml0eVxuXG4gICAgKiBPdXIgdG9kbyBsaXN0IHNob3VsZCBoYXZlIHByb2plY3RzIG9yIHNlcGFyYXRlIGxpc3RzIG9mIHRvZG9zLiBcbiAgICBXaGVuIGEgdXNlciBmaXJzdCBvcGVucyB0aGUgYXBwLCB0aGVyZSBzaG91bGQgYmUgc29tZSBzb3J0IG9mIOKAmGRlZmF1bHTigJkgcHJvamVjdCB0byB3aGljaCBhbGwgb2YgdGhlaXIgdG9kb3MgYXJlIHB1dC4gXG4gICAgVXNlcnMgc2hvdWxkIGJlIGFibGUgdG8gY3JlYXRlIG5ldyBwcm9qZWN0cyBhbmQgY2hvb3NlIHdoaWNoIHByb2plY3QgdGhlaXIgdG9kb3MgZ28gaW50XG5cbiAgICAqIFRoaW5raW5nIHdpdGggbW9kdWxlXG5cbiAgICAqIFVJIGlzIHVwIHRvIG1lXG5cblxuICAgICogV2hhdCBjYW4gaXQgZG8gP1xuICAgICAgICAxIHZpZXcgYWxsIHByb2plY3RzXG4gICAgICAgIDIgdmlldyBhbGwgdG9kb3MgaW4gZWFjaCBwcm9qZWN0IChwcm9iYWJseSBqdXN0IHRoZSB0aXRsZSBhbmQgZHVlZGF0ZeKApiBwZXJoYXBzIGNoYW5naW5nIGNvbG9yIGZvciBkaWZmZXJlbnQgcHJpb3JpdGllcylcbiAgICAgICAgMyBleHBhbmQgYSBzaW5nbGUgdG9kbyB0byBzZWUvZWRpdCBpdHMgZGV0YWlsc1xuICAgICAgICA0IGRlbGV0ZSBhIHRvZG9cblxuICAgIFVzZSBsb2NhbCBzdG9yYWdlIHRvIHBlcnNpc3RzIGRhdGEgd2hlbiByZWxvYWQsIGFuZCBjYW4gcmVsb2FkIHNhdmUgZmlsZSBhc3dlbC4gVHJ5IGRpdmluZyBpbiBzZWVcbiAgICB3aGF0IGhhcHBlbnMuXG5cblxuICAgIFZlcnkgc2ltcGxlIGludGVyZmFjZSBhbmQgZm91bmRhdGlvbiB3b3JrIGNhbiBiZSB3b3JrIG9uIHJpZ2h0IG5vd1xuICAgIG15IHRvZG8ncyByZXZvbHZlcyBhcm91bmQgdGFnZ2luZyB0aGluZ3MgdG8gY2F0ZWdvcml6ZSB0aGluZ3MuIEFuZCBvZmNvdXJzZSB0aGF0J3MgYSBmZWF0dXJlIHRvIGltcGxlbWVudFxuICAgIGxhdGVyLiBOT3cgc2hvdWxkIGJlIGxheWluZyBmb3VuZGF0aW9uIHRoYXQgd2UgY2FuIGRvIHRoaXNcblxuICAgIExldCdzIGNyZWF0ZSBhIHdvcmtpbmcgcHJvdG90eXBlIGZvciB0aGlzIHRvIHdvcmsgd2l0aG91dCBkaXNwbGF5IHRoZW4gZGVzaWduIHRoZSBVSSBhbmQgc2hpdCBsYXRlci5cbiAgICBJdCBjYW4gY2hhbmdlIGJ1dCB0aGUgbG9naWMgd2lsbCBub3QuXG5cbiAgICBTb1xuXG4gICAgQ3JlYXRlIGEgbm90ZVxuICAgIEFkZCBhIG5vdGVcbiAgICBEaXBsYXkgdGhhdCBub3RlXG4gICAgRGVsZXRlIHRoYXQgbm90ZVxuICAgIFxuKi9cbi8vaW1wb3J0ICogYXMgcHVic3ViIGZyb20gJy4vbW9kdWxlcy9wdWJzdWIuanMnO1xuY29uc29sZS5sb2coX19kaXJuYW1lKTsiXSwibmFtZXMiOlsiY29uc29sZSIsImxvZyIsIl9fZGlybmFtZSJdLCJzb3VyY2VSb290IjoiIn0=