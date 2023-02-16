const tagModule = require('../modules/tag');

const testTag = tagModule.createTag('project', 'education');
test('Test tag creation', () => {
    expect(testTag).toStrictEqual({identifier: 'project', topic: 'education'});
    expect(testTag.getAsStr()).toBe('project:education');
    expect(testTag.getAsArr()).toStrictEqual(['project', 'education']);
})

const testTagList = tagModule.createTagList('testTagList');
testTagList.addTag(tagModule.createTag('anything', 'Javascript'));
testTagList.addTag(tagModule.createTag('functional-programming', 'Haskell'));
testTagList.addTag(tagModule.createTag('project','education'));
//addTag, removeTag, checkforTag, getTagList
test('Test tag list creation', () => {
    expect(testTagList.getTagList()).toStrictEqual([
        tagModule.createTag('anything', 'Javascript'),
        tagModule.createTag('functional-programming', 'Haskell'),
        tagModule.createTag('project','education')
    ]);
});

test('Checking for the tag', () => {
    expect(testTagList.checkForTag(tagModule.createTag('anything', 'Javascript'))).toBe(true);
    expect(testTagList.checkForTag(tagModule.createTag('functional-programming', 'Haskell'))).toBe(true);
    expect(testTagList.checkForTag(tagModule.createTag('functional-programming', 'Elixir'))).toBe(false);
});

test('List retreiving', () => {
    expect(testTagList.getTagList()).toStrictEqual(testTagList._tagList);
});

test('Removing the tags', () => {
    testTagList.removeTag(tagModule.createTag('anything', 'Javascript'));
    expect(testTagList.checkForTag(tagModule.createTag('anything', 'Javascript'))).toBe(false);
    expect(testTagList.checkForTag(tagModule.createTag('functional-programming', 'Haskell'))).toBe(true);
});

//Tag record
const testTagRecord = tagModule.TagRecord('testTagRecord');
testTagList.getTagList().forEach(tag => testTagRecord.addToRecord(0, tag));
testTagList.getTagList().forEach(tag => testTagRecord.addToRecord(1, tag));

console.log(testTagRecord.getRecord());
test('Testing a tag add to the Record', () => {
    expect(testTagRecord.getRecord()).toStrictEqual({
        project: {
            education: [0, 1],
        },
        anything: {
            Javascript: [0, 1],
        },
        'functional-programming': {
            Haskell: [0, 1],
        }
    })
});

test('Search for ID from record', () => {
    expect(testTagRecord.searchForID(tagModule.createTag('project', 'education'))).toStrictEqual([0, 1]);
    expect(testTagRecord.searchForID(tagModule.createTag('functional-programming', 'Haskell'))).toStrictEqual([0 ,1]);
    expect(testTagRecord.searchForID(tagModule.createTag('project', 'something'))).toStrictEqual([]);
    expect(testTagRecord.searchForID(tagModule.createTag())).toStrictEqual([]);
});