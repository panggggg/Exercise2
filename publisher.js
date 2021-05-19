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
        const user = process.argv[2];
        const msg = user

        channel.assertQueue(queue);

        channel.sendToQueue(queue, Buffer.from(msg));

        console.log("[x] Message send: ", msg);
        console.log(user);


    });

    setTimeout(function () {
        connection.close();
        process.exit(0)
    }, 500);

});

