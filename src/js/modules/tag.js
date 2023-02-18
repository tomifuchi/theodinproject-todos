//Taggings system to work note, but it can be repurpose to work with anything
//Usually this is system wide or so I thought.

const TagProto = {
    getAsStr: function () {return `${this.identifier}:${this.topic}`},
    getAsArr: function () {return [this.identifier, this.topic]},
};

function createTag(identifier = 'anything', topic = 'default') {
    const state = {identifier, topic};
    return Object.assign(
        Object.create(TagProto),
        state
    );
}

createTag.fromStr = function (str) {
    let [identifier, topic] = str.split(':');

    if (topic === undefined) {
        topic = identifier;
        identifier = undefined;
    }

    return createTag(identifier, topic);
}

const TagListProto = {
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

function createTagList(name) {
    const state = {name, _tagList: []};

    return Object.assign(
        Object.create(TagListProto),
        state
    );
}

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

module.exports = {createTag, createTagList};