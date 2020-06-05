const chai = require('chai'),
    chaiHttp = require('chai-http');
const { ObjectId } = require('mongodb');
const testServer = require('../../test-helpers/test-server');
const testDb = require('../../test-helpers/test-db');
const assertResponse = require('../../test-helpers/assert-response');

chai.use(chaiHttp);
const expect = chai.expect;

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

        const deletedTodo = await db.collection('todos').findOne({ _id: todo._id });

        expect(deletedTodo).to.be.null;
    });
});