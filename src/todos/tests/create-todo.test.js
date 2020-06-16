/** Tests for creating a new todo at the /todos endpoint
 * <ol>
 *   <li>Checks the response to a POST request has the expected headers:
 *     <ul>
 *      <li>Access-Control-Allow-Origin: *</li>
 *      <li>Access-Control-Allow-Headers: X-Requested-With,
 *          X-HTTP-Method-Override, Content-Type, Accept</li>
 *     </ul>
 *   </li>
 *   <li>Checks that a 400 ValidationError is returned if a todo without a title
 *       property is posted.</li>
 *   <li>Checks that a 400 ValidationError is returned if a todo with an empty
 *       title is posted.</li>
 *   <li>Checks that a 400 ValidationError is returned if a todo with a title that
 *       is not a string is posted.</li>
 *   <li>Checks that a 201 status and the created todo are returned when a valid
 *       todo is posted.</li>
 *   <li>Checks that the posted todo is actually saved to the database.</li>
 *   <li>Checks the leading and trailing spaces in the todo title are trimmed
 *       upon posting.</li>
 * </ol>
 *
 * @module tests/create-todo
 * @requires chai
 * @requires chai-http
 * @requires test-helpers/test-server
 * @requires test-helpers/test-db
 * @requires test-helpers/assert-response
 */

/**
 * chai module
 * @const
 */
const chai = require('chai');

/**
 * chai-http module
 * @const
 */
const chaiHttp = require('chai-http');

/**
 * test-server module
 * @const
 */
const testServer = require('../../test-helpers/test-server');

/**
 * test-db module
 * @const
 */
const testDb = require('../../test-helpers/test-db');

/**
 * assert-response module
 * @const
 */
const assertResponse = require('../../test-helpers/assert-response');

chai.use(chaiHttp);

/**
 * Chai expect object
 * @const
 */
const expect = chai.expect;

describe('POST /todos', function() {
    testServer.useInTest();
    testDb.useInTest();

    it('returns the right response headers', async function() {
        const api = this.api;

        const response = await api.post('/todos', { title: 'My Test Todo' });

        expect(response).to.have.header('access-control-allow-origin', '*');
        expect(response).to.have.header(
            'access-control-allow-headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
    });

    it('responds with 400 ValidationError if title is missing', async function() {
        const api = this.api;

        const request = api.post('/todos', {});

        return assertResponse.isValidationError(request, { title: 'required' });
    });

    it('responds with 400 ValidationError if title is empty', async function() {
        const api = this.api;

        const request = api.post('/todos', { title: '' });

        return assertResponse.isValidationError(request, { title: 'required' });
    });

    it('responds with 400 ValidationError if title is not a string', async function() {
        const api = this.api;

        const request = api.post('/todos', { title: 123 });

        return assertResponse.isValidationError(request, {
            title: 'must be a string',
        });
    });

    it('responds with 201 { todo }', async function() {
        const api = this.api;

        const response = await api.post('/todos', { title: 'My Test Todo' });

        expect(response).to.have.property('status', 201);
        expect(response.data).to.have.property('todo').that.is.an('object');
        expect(response.data.todo).to.have.property('_id').that.is.a('string');
        expect(response.data.todo).to.have.property('title', 'My Test Todo');
        expect(response.data.todo).to.have.property('completed', false);
        expect(response.data.todo)
            .to.have.property('createdAt')
            .that.is.a('string');
        expect(new Date(response.data.todo.createdAt).valueOf()).to.be.closeTo(
            Date.now(),
            1000
        );
        expect(response.data.todo)
            .to.have.property('updatedAt')
            .that.is.a('string');
        expect(response.data.todo.updatedAt).to.equal(
            response.data.todo.createdAt
        );
    });

    it('saves todo to the database', async function() {
        const api = this.api;
        const db = this.db;

        await api.post('/todos', { title: 'My Test Todo' });
        const [latestTodo] = await db
            .collection('todos')
            .find({})
            .sort({ _id: -1 })
            .toArray();

        expect(latestTodo).to.be.ok;
        expect(latestTodo).to.have.property('title', 'My Test Todo');
        expect(latestTodo).to.have.property('completed', false);
        expect(latestTodo)
            .to.have.property('createdAt')
            .that.is.an.instanceOf(Date);
        expect(latestTodo.createdAt.valueOf()).to.be.closeTo(Date.now(), 1000);
        expect(latestTodo)
            .to.have.property('updatedAt')
            .that.is.an.instanceOf(Date);
        expect(latestTodo.updatedAt).to.deep.equal(latestTodo.createdAt);
    });

    it('trims title from input', async function() {
        const api = this.api;

        const response = await api.post('/todos', { title: ' My Test Todo ' });

        expect(response).to.have.property('status', 201);
        expect(response.data.todo).to.have.property('title', 'My Test Todo');
    });
});