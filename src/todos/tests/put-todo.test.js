const chai = require('chai'),
    chaiHttp = require('chai-http');
const testServer = require('../../test-helpers/test-server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('PUT /todos', function() {
    testServer.useInTest();

    it('returns the right response headers', async function() {
        const api = this.api;

        const request = api.put('/todos', {});

        const error = await expect(request).to.eventually.be.rejected;

        const response = error.response;

        expect(response).to.have.header('access-control-allow-origin', '*');
        expect(response).to.have.header(
            'access-control-allow-headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
        expect(response).to.have.header(
            'allow',
            'GET, POST, PATCH, DELETE, OPTIONS, HEAD'
        );
    });

    it('responds with 405 Forbidden', async function() {
        const api = this.api;

        const request = api.put('/todos', {});

        const error = await expect(request).to.eventually.be.rejected;

        const response = error.response;

        expect(response).to.have.property('status', 405);
    });
});