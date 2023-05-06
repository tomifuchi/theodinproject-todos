const _Subscriber = function(context, type, message, Fn) {
    return Object.assign(
        Object.create({type: "SubscriberInterface"}),
        {context, type, message, callBackFunction: Fn}
    )
}

const subscribers =  [];

function subscribe(context, type, message, callBackFunction) {
    subscribers.push(_Subscriber(context, type, message, callBackFunction));
}

function unsubscribe(context, type, message) {
    subscribers.filter(item => item.context == context && item.type == type && item.message == message).forEach(item => subscribers.splice(subscribers.indexOf(item),1));
}

 //Can publish arguments for callbacks to use aswel
function publish(type, message, args) {
    subscribers.filter(sub => sub.type == type && sub.message == message).forEach(item => item.callBackFunction(args));
}

//Debugs only delete later
function echoSub() {
    return subscribers;
}

function pubsubTest() {
    return 'Pubsub module import successful';
}

module.exports = {subscribe, unsubscribe, publish, echoSub, pubsubTest};