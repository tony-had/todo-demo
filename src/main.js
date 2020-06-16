/** Entry point for the todo REST API
 * @module main
 * @requires express
 * @requires mongodb
 * @requires body-parser
 * @requires errors/ValidationError
 * @requires errors/ResourceNotFoundError
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * Mongo DB client
 * @type {object}
 * @const
 */
const { MongoClient } = require('mongodb');

/**
 * body-parser module
 * @const
 */
const bodyParser = require('body-parser');

/**
 * ValidationError to be thrown when a body fails validation
 * @const
 */
const ValidationError = require('./errors/ValidationError');

/**
 * ResourceNotFoundError to be thrown when a todo is not found
 * @const
 */
const ResourceNotFoundError = require('./errors/ResourceNotFoundError');

/**
 * Port on which to serve
 * @type {Number}
 * @const
 */
const PORT = process.env.PORT || 3000;

// TODO: move credentials to environment variables

/**
 * The URI of the todo Mongo DB. The default is the todo-demo Mongo DB Atlas URI
 * @type {String}
 * @const
 */
const MONGODB_URI =
    process.env.MONGODB_URI ||
    'mongodb+srv://resty-testy:resty-testy@supply-store-db-trr6k.mongodb.net/todo-demo?retryWrites=true&w=majority';

/**
 * Name of the todo database. The default is todo-demo
 * @type {String}
 * @const
 */
const MONGODB_DB = process.env.MONGODB_DB || 'todo-demo';

main();

/**
 * Main function that wraps the middleware set-up of the server.
 */
async function main() {
    const mongoClient = await MongoClient.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const db = mongoClient.db(MONGODB_DB);

    const app = express();

    app.use(bodyParser.json());

    app.use(function attachDb(req, res, next) {
        req.db = db;

        next();
    });

    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
        res.header('Access-Control-Max-Age', '86400');
        // headers["Access-Control-Allow-Credentials"] = false;
        // TODO: make a constant list of allowed methods
        const allowedMethods = [
            'GET',
            'POST',
            'PATCH',
            'DELETE',
            'OPTIONS',
            'HEAD',
        ];
        if (!allowedMethods.includes(req.method)) {
            res.header('Allow', 'GET, POST, PATCH, DELETE, OPTIONS, HEAD');
            return res.status(405).json({});
        }
        if (req.method === 'OPTIONS') {
            res.header(
                'Access-Control-Allow-Methods',
                'GET, POST, PATCH, DELETE, OPTIONS, HEAD'
            );
            return res.status(204).json({});
        }
        if (req.method === 'HEAD') {
            return res.status(204).json({});
        }

        next();
    });

    app.get('/', function(req, res, next) {
        res.status(200).json({
            name: 'todo-demo',
        });
    });

    app.use(require('./todos/routes'));

    app.use(function handleErrors(err, req, res, next) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ error: err });
        }

        if (err instanceof ResourceNotFoundError) {
            return res.status(404).json({ error: err });
        }

        next(err);
    });

    app.listen(PORT, (err) => {
        if (err) {
            throw err;
        }

        // console.log(`api-server listening on port ${PORT}`);
    });
}