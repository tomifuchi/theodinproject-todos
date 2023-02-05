const pubsub = require("./pubsub");

function updateTextContent(node, data){
    node.textContent = data;
}

const htmlLogger = document.getElementById('log');
function renderHtmlLogger(msg) {
    updateTextContent(htmlLogger, msg);
}
pubsub.subscribe('display','log','htmlLogger-logs', renderHtmlLogger);