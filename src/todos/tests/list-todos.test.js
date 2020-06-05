const chai = require('chai'),
    chaiHttp = require('chai-http');
const testServer = require('../../test-helpers/test-server');
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