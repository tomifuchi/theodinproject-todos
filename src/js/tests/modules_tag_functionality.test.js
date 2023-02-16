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
//addTag, removeTag, checkforTag, getTagList
test('Test tag list creation', () => {
    expect(testTagList.getTagList()).toStrictEqual([
        tagModule.createTag('anything', 'Javascript'),
        tagModule.createTag('functional-programming', 'Haskell')
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