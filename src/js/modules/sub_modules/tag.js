//Taggings system to work with note, but it can be repurpose to work with anything
const tagProto = {
    getAsStr: function () {return `${this.identifier}:${this.topic}`},
    getAsArr: function () {return [this.identifier, this.topic]},
};

function Tag(identifier = 'anything', topic = 'default') {
    const state = {identifier, topic};
    return Object.assign(
        Object.create(tagProto),
        state
    );
}

Tag.fromStr = function (str) {
    let [identifier, topic] = str.split(':');

    if (topic === undefined && identifier !== undefined) {
        topic = identifier;
        identifier = undefined;
    }

    return Tag(identifier, topic);
}

const tagListProto = {
    addTag: function(...tags) {
        tags.forEach((tag) => {if (!this.checkForTag(tag)) this._tagList.push(tag)})
        return this;
    },
    removeTag: function (removingTag) {
      if(this.checkForTag(removingTag))
          this._tagList.splice(this._tagList.findIndex((tag) => this.checkEqual(tag, removingTag)), 1);
    },
    checkForTag: function (checkingTag){
        return this._tagList.some((tag) => this.checkEqual(tag, checkingTag));
    },
    checkEqual: function (tagA, tagB) {
        return JSON.stringify(tagA) === JSON.stringify(tagB);
    },
    getTagList: function () {
        return this._tagList;
    }
}

function TagList(name) {
    const state = {name, _tagList: []};

    return Object.assign(
        Object.create(tagListProto),
        state
    );
}

/*
const tagRecordProto = {
    getAsStr: function () {return `${this.identifier}:${this.topic}#${this.ID}`},
    getAsArr: function () {return [this.identifier, this.topic, this.ID]},
};
*/

/* 
    This situation below proves to me that
    Object.assign only assigns surface propertise and not the prototype
    since tag is an object with it's own prototype. Tag record also have prototype
    but in the end when invoke, getAsStr and getAsArr return the tag prototype's method
    this would mean that Object.create(tagRecordProto)'s prototype wasn't assigned to
    tag's prototype.

    If we switch the order then we would get Object.create(tagRecordProto) methods or prototype.

    This will give us tagRecordProto's prototype
    return Object.assign(
        Object.create(tagRecordProto),
        tag,
        state
    )

    This will give us tag's prototype
    return Object.assign(
        tag,
        Object.create(tagRecordProto),
        state
    )
*/
/*
function createTagRecord(ID, tag) {
    const state = {ID};
    return Object.assign(
        Object.create(tagRecordProto),
        tag,
        state
    )
}
*/

/*
function TagRecordList (name) {
    const state = {name, _recordList};

    return Object.assign(
        Object.create(tagRecordProto),
        state
    )
}
*/

//This shouldn't be accesible anywhere, hidden away.
//Exported for testing purpose
/*
function TagRecord(name) {
    const state = {
        name
    };
    record = {};

    //Check against record object
    function hasIdentifier(identifer) {
        return record.hasOwnProperty(identifer);
    }

    function hasTopic(identifier, topic) {
        return record[identifier].hasOwnProperty(topic);
    }

    //Expect identifer:topic or topic only
    function addToRecord(ID, tag) {

        //Add to record
        function addIdentifier(identifer) {
            record[identifer] = {};
        }

        function addTopic(identifer, topic) {
            record[identifer][topic] = [];
        }

        //Add id to identifier topic
        function addNoteID(ID, identifer, topic) {
            record[identifer][topic].push(ID);
        }

        const [identifer, topic] = tag.getAsArr();

        if(!hasIdentifier(identifer)){
            addIdentifier(identifer);
        }
        if(!hasTopic(identifer, topic)){
            addTopic(identifer, topic);
        }
        addNoteID(ID, identifer, topic);
    }

    //Array of IDs with that identifiers and topics
    function searchForID(tag){
        const [identifier, topic] = tag.getAsArr();
        if(hasIdentifier(identifier)){
            if(hasTopic(identifier, topic)){
                return JSON.parse(JSON.stringify(record[identifier][topic]));
            }
        }
        return [];
    }

    function getRecord() {
        return JSON.parse(JSON.stringify(record));
    }

    return Object.assign(
        Object.create({
            addToRecord, getRecord, searchForID
        }),
        state
    );
}
const todoTagRecord = TagRecord('todos-tag-record');
*/

module.exports = {Tag, TagList};