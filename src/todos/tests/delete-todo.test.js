/** Tests for deleting an existing todo at the /todos endpoint
 * <ol>
 *   <li>Checks the response to a DELETE request has the expected headers:
 *     <ul>
 *      <li>Access-Control-Allow-Origin: *</li>
 *      <li>Access-Control-Allow-Headers: X-Requested-With,
 *          X-HTTP-Method-Override, Content-Type, Accept</li>
 *     </ul>
 *   </li>
 *   <li>Checks that a 404 ResourceNotFoundError is returned if deleting a todo
 *       with a non-existent id.</li>
 *   <li>Checks that a 204 status and no content are returned when successfully
 *       deleting a todo.</li>
 *   <li>Checks that the deleted todo is actually removed from the
 *       database.</li>
 * </ol>
 *
 * @module tests/delete-todo
 * @requires chai
 * @requires chai-http
 * @requires mongodb
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
 * ObjectId type from mongodb
 * @const
 */
const { ObjectId } = require('mongodb');

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

// TODO: move createTodo function to utils module
/**
 * Create a new todo in the database.
 * @param  {Object} mochaContext - mocha context providing access to the api for
 *                                 calls and the database
 * @param  {Object} todoData={} - todo object
 */
async function createTodo(mochaContext, todoData = {}) {
    const { api, db } = mochaContext;

    todoData = Object.assign({}, todoData, { title: 'My Todo' });

    const response = await api.post('/todos', todoData);

    const todoId = new ObjectId(response.data.todo._id);

    return db.collection('todos').findOne({ _id: todoId });
}

describe('DELETE /todos', function() {
    testServer.useInTest();
    testDb.useInTest();

    it('returns the right response headers', async function() {
        const api = this.api;

        const todo = await createTodo(this);

        const response = await api.delete(`/todos/${todo._id}`);

        expect(response).to.have.header('access-control-allow-origin', '*');
        expect(response).to.have.header(
            'access-control-allow-headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
    });

    it('responds with 404 ResourceNotFoundError { todo } if no todo exists with given id', async function() {
        const api = this.api;

        // Test with invalid Object ID
        const request1 = api.delete('/todos/1', { completed: true });
        await assertResponse.isResourceNotFoundError(request1, 'Todo');

        // Test with non-existent Object ID
        const request2 = api.patch('/todos/5b72ecfdbf16f1384b053639', {
            completed: true,
        });

        await assertResponse.isResourceNotFoundError(request2, 'Todo');
    });

    it('responds with 204 No Content', async function() {
        const api = this.api;

        const todo = await createTodo(this);

        const response = await api.delete(`/todos/${todo._id}`);

        expect(response).to.have.property('status', 204);
        expect(response.noContent);
    });

    it('deletes todo from the database', async function() {
        const api = this.api;
        const db = this.db;

        const todo = await createTodo(this);

        await api.delete(`/todos/${todo._id}`);

        const deletedTodo = await db
            .collection('todos')
            .findOne({ _id: todo._id });

        expect(deletedTodo).to.be.null;
    });
});