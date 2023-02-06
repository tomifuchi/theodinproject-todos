const pubsub = require('./pubsub');

function Logger(name) {
    pubsub.publish('log', 'Logger-created', name);
    let logs = '';
    const state ={
        name,
        logCounter: 0,
    };
    function log(msg) {
        logs = `${this.logCounter++}: ${msg}\n${logs}`;
    }
    function getLog() {
      	return logs;
    }
    return Object.assign(
        Object.create({log, getLog}),
        state
    );
}

function loggerImportTest() {
    return 'Logger module import successful';
}

module.exports = {Logger, loggerImportTest};
