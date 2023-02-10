const pubsub = require('../modules/pubsub');

//Testing pubsub functionality
let mess = ''
function message(){
   mess = 'Message Fire!'; 
}

test('Pubsub module subscribe and publish test', () => {
    expect((() => {
        pubsub.subscribe('test','log','subscribe-publish-test', message);
        pubsub.publish('log','subscribe-publish-test');
        return mess;
    })()).toBe('Message Fire!');
});

test('Pubsub module unsubscribe test', () => {
    expect((() => {
        mess = '';
        pubsub.unsubscribe('test','log','subscribe-publish-test');
        pubsub.publish('log','subscribe-publish-test');
        return mess;
    })()).toBe('');
});