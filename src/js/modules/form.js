const pubsub = require('./pubsub');

const createNoteForm = document.getElementById('create-note-form');
const createNoteBtn = document.getElementById('create-note-btn');
//Set minimum for today min in form
createNoteForm.querySelector('#due-date').min = new Date().toISOString().split("T")[0];

function submit({projectMethodType, obj, note=null}) {
    const q = queryForm(createNoteForm);
    if(createNoteForm.reportValidity()){
            const newNote = obj.createNote(
                q('#title'),
                q('#description'),
                q('#content'),
                /*
                    Parsing date from form
                    https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

                    This part is really important.

                    Note: The displayed date format will differ from the actual value — 
                    the displayed date is formatted based on the locale of the user's browser, 
                    but the parsed value is always formatted yyyy-mm-dd.
                */
                Date.parse(q('#due-date')),
                'dd/MM/yyyy',
                q('#priority'),
                processTags(q('#tags'))
            );
            switch(projectMethodType) {
                case 'add':
                    obj.addNote(newNote);       
                    break;
                case 'edit':
                    obj.editNote({ID: note.ID, ...newNote});
                    break;
            }

            createNoteForm.reset(); //Reset the form after submit
    }
}

pubsub.subscribe('form', 'change', 'form-change-state', switchFormState);

const callbackFunctionEvents = {
    callBacks: [],
    clearListeners: function () {
        this.callBacks.forEach(f => createNoteBtn.removeEventListener('click', f));
    }
}

function switchFormState({projectMethodType, obj, note=null}) {
    if(callbackFunctionEvents.callBacks.length > 0)
        callbackFunctionEvents.clearListeners();

    switch(projectMethodType) {
        case 'add':
            createNoteBtn.textContent = 'Add';
            break;
        case 'edit':
            createNoteBtn.textContent = 'Edit';
            break;
    }
    const currentCallBack = submit.bind(obj, {projectMethodType, obj, note});
    callbackFunctionEvents.callBacks.push(currentCallBack);

    createNoteBtn.addEventListener('click', currentCallBack);
}


function queryForm(form) {
    return (query) => form.querySelector(query).value;
}

function processTags(str) {
    return str.split(' ');
}