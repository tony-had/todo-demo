/** Provides database set-up and tear-down hooks for the test suite.
 * @module test-helpers/test-db
 * @requires mongodb
 */

/**
 * Mongo DB client
 * @type {object}
 * @const
 */
const { MongoClient } = require('mongodb');

/**
 * Test DB setup and tear-down functions.
 * <ol>
 *      <li>Before all tests, the test DB is set up.</li>
 *      <li>Before each test, the test DB is dropped.</li>
 *      <li>After all tests, the test DB is closed.</li>
 * </ol>
 */
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