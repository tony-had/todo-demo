const chai = require('chai'),
    chaiHttp = require('chai-http');
const testServer = require('../../test-helpers/test-server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('HEAD /todos', function() {
    testServer.useInTest();

    it('returns the right response headers', async function() {
        const api = this.api;

        const response = await api.head('/todos', {});

        expect(response).to.have.header('access-control-allow-origin', '*');
        expect(response).to.have.header(
            'access-control-allow-headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
    });

    it('responds with 204 No Content', async function() {
        const api = this.api;

        const response = await api.head('/todos', {});

        expect(response).to.have.property('status', 204);
        expect(response.noContent);
    });
});

describe('OPTIONS /todos', function() {
    testServer.useInTest();

    it('returns the right response headers', async function() {
        const api = this.api;

        const response = await api.options('/todos', {});

        expect(response).to.have.header('access-control-allow-origin', '*');
        expect(response).to.have.header(
            'access-control-allow-headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
        expect(response).to.have.header(
            'access-control-allow-methods',
            'GET, POST, PATCH, DELETE, OPTIONS, HEAD'
        );
    });

    it('responds with 204 No Content', async function() {
        const api = this.api;

        const response = await api.options('/todos', {});

        expect(response).to.have.property('status', 204);
        expect(response.noContent);
    });
});