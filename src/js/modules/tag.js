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

const TagListProto = {
    addTag: function(...tags) {
        tags.forEach((tag) => {if (!this.checkForTag(tag)) this._tagList.push(tag)})
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
        return JSON.parse(JSON.stringify(this._tagList));
    }
}

function createTagList(name) {
    const state = {name, _tagList: []};

    return Object.assign(
        Object.create(TagListProto),
        state
    );
}

//function TagRecord(name) {
//    const record = {
//
//    };
//    /*
//    const tagRecord = {
//        project: {
//            mockProjectA: [IDs],
//            education: [0, 1, 2],
//        },
//        section: {
//            mockSectionA: [IDs],
//            mockSectionB: [IDs],
//            mathematics: [2],
//            fixbug: [1],
//            programming: [0],
//        }
//        anything: {
//            untagged: [IDs],
//            topicA: [IDs],
//            topicB: [IDs],
//            linear-algebra: [2],
//            Javascript: [0, 1],
//            Haskell: [0, 1],
//            functional-programming: [0,1],
//        }
//    }*/
//
//    //Expect identifer:topic or topic only
//    function addToRecord(ID, tag) {
//
//        const [identifer, topic] = toIdenAndTopic(tag);
//
//        if(!hasIdentifier(identifer)){
//            addIdentifier(identifer);
//        }
//        if(!hasTopic(identifer, topic)){
//            addTopic(identifer, topic);
//        }
//        addNoteID(ID, identifer, topic);
//
//        function toIdenAndTopic(tag) {
//            let [identifer = '', topic = ''] = tag.split(':');
//            if(identifer == '') {
//                identifer = topic;
//                topic = '';
//            }
//            return [identifer, topic];
//        }
//
//        //Check against record object
//        function hasIdentifier(identifer) {
//            return record.hasOwnProperty(identifer);
//        }
//
//        function hasTopic(identifier, topic) {
//            return record[identifier].hasOwnProperty(topic);
//        }
//
//        //Add to record
//        function addIdentifier(identifer) {
//            record[identifer] = {};
//        }
//
//        function addTopic(identifer, topic) {
//            record[identifer][topic] = [];
//        }
//
//        //Add id to identifier topic
//        function addNoteID(ID, identifer, topic) {
//            record[identifer][topic].push(ID);
//        }
//    }
//
//    function getRecord() {
//        return JSON.parse(JSON.stringify(record));
//    }
//
//    return Object.assign(
//        Object.create({
//            addToRecord, getRecord,
//        }),
//        state
//    );
//}

module.exports = {createTag, createTagList};