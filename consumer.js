
(async () => {
    const amqp = require('amqplib/callback_api');
    const mongo = require('mongodb');
    const bluebird = require('bluebird')
    const redis = require('redis')

    bluebird.promisifyAll(redis)

    const redisClientUri = "redis://localhost:6379?db=0"
    const redisClient = redis.createClient(redisClientUri)
    redisClient.on('error', err => {
        console.error(err)
    })

    // const result = await redisClient.getAsync("Pang");
    // await redisClient.setAsync("Jim", "jim");
    // console.log(result)
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("mynode");


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


                channel.consume(queue, async (msg) => {
                    const name = msg.content.toString();
                    console.log("[x] Message received: ", name)
                    console.log("[x] Done")

                    const redisResult = await redisClient.getAsync(name);
                    console.log(redisResult)
                    if (redisResult === null) {
                        const data = { "Name": name };
                        dbo.collection("user").insertOne(data, function (err, res) {
                            if (err) throw err;
                            console.log("Save into Database");
                            db.close();
                        });
                        await redisClient.setAsync(name, name);
                    } else {
                        console.log("This name already has in the database");

                    }

                }, {
                    noAck: true
                });

            });
        });
    });


})();

