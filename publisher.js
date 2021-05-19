const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
        throw connError;
    }

    connection.createChannel((channelError, channel) => {
        if (channelError) {
            throw channelError;
        }

        const queue = "exercise2"
        const msg = "Hello World"

        channel.assertQueue(queue);

        channel.sendToQueue(queue, Buffer.from(msg));

        console.log("[x] Message send: ", msg)
    });

    setTimeout(function () {
        connection.close();
        process.exit(0)
    }, 500);

});

