const { MongoClient } = require('mongodb');

exports.useInTest = function() {
    before(async function connectToTestDB() {
        const mongoClient = await MongoClient.connect(
            'mongodb+srv://resty-testy:resty-testy@supply-store-db-trr6k.mongodb.net/todo-demo?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        const db = mongoClient.db('todo-demo');

        this.mongoClient = mongoClient;
        this.db = db;
    });

    beforeEach(function dropTestDB() {
        return this.db.dropDatabase();
    });

    after(function disconnectTestDB() {
        return this.mongoClient.close();
    });
};