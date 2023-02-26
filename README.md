Notes on this project.

Every module will talk to the pubsub module, subscribe to a particular topic then execute with callbackfunction with optional argument passed down by the publisher.

Logging functionality:
- Created using logger module that stores logs. That's it very simple.
- To have logging functionality. Simply selects functions that
you wanted to log, then have that function publish with it's arguments as logs to the logger. Then at the same time, the logger subscribe to the channel of the publisher and the function to handle the log that the publisher passed down.

Html logger:
- Created in index.js`