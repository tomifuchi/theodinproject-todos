const pubsub = require('./pubsub');

//Dom manipulation
const htmlLogger = document.getElementById('log');

function render() {

}

function updateText(node, data){
    node.textContent = data;
}

function log(msg){
    updateText(htmlLogger, `${msg} \n${htmlLogger.textContent}`);
}

pubsub.subscribe('display', 'log', 'createNote', log);
pubsub.subscribe('display', 'log', 'addNote', log);
pubsub.subscribe('display', 'log', 'getNoteList', log);

function displayImportTest() {
    return 'Display module import successful';
}

module.exports = {displayImportTest};