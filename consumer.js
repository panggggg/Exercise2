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
        channel.assertQueue(queue);

        console.log("[*] Waiting for messages in %s. To exist press CTRL+C", queue)


        channel.consume(queue, (msg) => {
            console.log("[x] Message received: ", msg.content.toString())
            console.log("[x] Done")
        }, {
            noAck: true
        })

    })
})