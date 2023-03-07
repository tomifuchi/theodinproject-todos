const loggerModule = require('../modules/logger');

//Testing logger functionality
const testLoggerA = loggerModule.Logger('testLoggerA');
testLoggerA.log('Hello world');

test('Test logging and retreiving logs', () => {
    expect(testLoggerA.getLog()).toBe('0: Hello world\n\n');
});

const testLoggerB = loggerModule.Logger('testLoggerB');
testLoggerB.log(`Hello world`);

test('Achieve private variables of both loggers to hide their logs through closure and they should have logCounter to be 1', () => {
    expect((() => testLoggerA.logCounter == testLoggerB.logCounter == 1)()).toBe(true);
    expect((() => testLoggerA.getLog() == testLoggerB.getLog())()).toBe(true);
});
