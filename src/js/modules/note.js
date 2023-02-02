//import { compareAsc, format } from 'date-fns'
//
//format(new Date(2014, 1, 11), 'yyyy-MM-dd')
////=> '2014-02-11'
//
//const dates = [
//  new Date(1995, 6, 2),
//  new Date(1987, 1, 11),
//  new Date(1989, 6, 10),
//]
//dates.sort(compareAsc)

//Note object.
function Note(title, description, content, dueDate, priority, tags) {

   const state = {
        title, description, content, dueDate, priority, tags
    };

    return Object.assign({}, state);
}

const A = Note("What", "Ever", "lorem ipsumksldjfklsjdfkljasfjd", )