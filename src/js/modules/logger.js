const pubsub = require('./pubsub');

function Logger(name) {
    let logs = '';
    const state = {
        name,
        logCounter: 0,
    };

    return Object.assign(
        Object.create({
            log: function (msg) {return logs = `${this.logCounter++}: ${msg}\n${logs}`},
            getLog: function () {return logs},
        }),
        state
    );
}

Logger.loggerImportTest = () => 'Logger module import successful';

module.exports = {Logger};