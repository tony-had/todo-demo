/** Provides server set-up and tear-down hooks for the test suite.
 * @module test-helpers/test-server
 * @requires axios
 * @requires child_process
 * @requires get-port
 */

/**
 * axios module
 * @const
 */
const axios = require('axios');
/**
 * spawn function from the child_process module
 * @type {Function}
 * @const
 */
const spawn = require('child_process').spawn;
/**
 * getPort function
 * @type {Function}
 * @const
 */
const getPort = require('get-port');

/**
 * Test environment object containing environment variables for the test set-up
 * @type {Object}
 * @const
 */
const TEST_ENV = {
    PORT: undefined,
    MONGODB_URI: 'mongodb+srv://resty-testy:resty-testy@supply-store-db-trr6k.mongodb.net/todo-demo?retryWrites=true&w=majority',
    MONGODB_DB: 'todo-demo',
};
/**
 * Helper function that spawns the server.
 * @param  {Object} env - Object containing port number, mongodb URI and mongodb
 *      name.
 */
async function spawnServer(env) {
    return new Promise((resolve, reject) => {
        const server = spawn('node', ['src/main'], { env });

        server.stdout.pipe(process.stdout);
        server.stderr.pipe(process.stderr);

        server.on('error', reject);

        return waitForURLReachable(`http://localhost:${env.PORT}`)
            .then(() => resolve(server))
            .catch(reject);
    });
}

/**
 * Helper function that waits for the server to become reachable before an
 * acceptable timeout.
 * @param  {String} url - URL of the server that needs to become reachable.
 * @param  {Number} timeout=10000 - Time in ms for which to wait the server to
 *      become reachable.
 */
async function waitForURLReachable(url, timeout = 10000) {
    const timeoutThreshold = Date.now() + timeout;

    while (true) {
        try {
            await axios.get(url);

            return true;
        } catch (err) {
            if (Date.now() > timeoutThreshold) {
                throw new Error(`URL ${url} not reachable after ${timeout}ms`);
            }

            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
}

/**
 * Test server setup and tear-down functions.
 * <ol>
 *      <li>Before all tests, a test server is spawned at a random port.</li>
 *      <li>After all tests, the test server is killed.</li>
 * </ol>
 */
exports.useInTest = function() {
    before(async function startTestServer() {
        const env = Object.assign({}, TEST_ENV, {
            PATH: process.env.PATH,
            PORT: await getPort(),
        });

        const testServer = await spawnServer(env);

        const api = await axios.create({
            baseURL: `http://localhost:${env.PORT}`,
        });

        this.testServer = testServer;
        this.api = api;
    });

    after(function stopTestServer() {
        this.testServer.kill();

        return new Promise((resolve) =>
            this.testServer.on('close', () => resolve())
        );
    });
};