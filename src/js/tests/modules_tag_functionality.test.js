const tagModule = require('../modules/tag');

test('Test tag creation', () => {
    const testTag = tagModule.createTag('project', 'education');
    expect(testTag).toStrictEqual({identifier: 'project', topic: 'education'});
    expect(testTag.getAsStr()).toBe('project:education');
    expect(testTag.getAsArr()).toStrictEqual(['project', 'education']);
})