/** Tests for getting todos at the /todos endpoint
 * <ol>
 *   <li>Checks the response to a GET request has the expected headers:
 *     <ul>
 *      <li>Access-Control-Allow-Origin: *</li>
 *      <li>Access-Control-Allow-Headers: X-Requested-With,
 *          X-HTTP-Method-Override, Content-Type, Accept</li>
 *     </ul>
 *   </li>
 *   <li>Checks that a 200 status and a list of all todos is returned upon a
 *       simple GET request and that:
 *     <ul>
 *       <li>the response body has the expected structure and property
 *           types</li>
 *       <li>the todos returned match exactly the todos that were created in the
 *           database</li>
 *     </ul>
 *   </li>
 * </ol>
 *
 * @module tests/list-todos
 * @requires chai
 * @requires chai-http
 * @requires test-helpers/test-server
 * @requires test-helpers/test-db
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

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET /todos', function() {
    testServer.useInTest();
    testDb.useInTest();

    it('returns the right response headers', async function() {
        const api = this.api;

        const response = await api.get('/todos');

        expect(response).to.have.header('access-control-allow-origin', '*');
        expect(response).to.have.header(
            'access-control-allow-headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
    });

    it('responds with 200 { todos }', async function() {
        const api = this.api;

        for (i = 0; i < 3; i++) {
            await api.post('/todos', { title: `Todo ${i}` });
        }

        const response = await api.get('/todos');

        expect(response).to.have.property('status', 200);

        expect(response)
            .to.have.nested.property('data.todos')
            .that.is.an('array')
            .with.lengthOf(3);

        const todos = response.data.todos;

        todos.forEach((todo) => {
            expect(todo).to.have.property('title').that.is.a('string');
            expect(todo).to.have.property('completed', false);
            expect(todo).to.have.property('createdAt').that.is.a('string');
            expect(todo).to.have.property('updatedAt').that.is.a('string');
        });

        expect(todos.map((todo) => todo.title)).to.deep.equal([
            'Todo 0',
            'Todo 1',
            'Todo 2',
        ]);
    });
});