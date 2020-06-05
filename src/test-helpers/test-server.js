const axios = require('axios');
const spawn = require('child_process').spawn;
const getPort = require('get-port');

const TEST_ENV = {
    PORT: undefined,
    MONGODB_URI: 'mongodb+srv://resty-testy:resty-testy@supply-store-db-trr6k.mongodb.net/todo-demo?retryWrites=true&w=majority',
    MONGODB_DB: 'todo-demo',
};

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

async function waitForURLReachable(url, { timeout = 10000 } = {}) {
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

exports.useInTest = function() {
    before(async function startTestServer() {
        const env = Object.assign({}, TEST_ENV, {
            PATH: process.env.PATH,
            PORT: await getPort(),
        });

        const testServer = await spawnServer(env);

        const api = await axios.create({ baseURL: `http://localhost:${env.PORT}` });

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