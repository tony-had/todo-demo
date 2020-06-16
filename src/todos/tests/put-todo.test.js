/** Tests for the unsupported PUT method at the /todos endpoint
 * <ol>
 *   <li>Checks the response to a PUT request has the expected headers:
 *     <ul>
 *      <li>Access-Control-Allow-Origin: *</li>
 *      <li>Access-Control-Allow-Headers: X-Requested-With,
 *          X-HTTP-Method-Override, Content-Type, Accept</li>
 *      <li>Allow: GET, POST, PATCH, DELETE, OPTIONS, HEAD</li>
 *     </ul>
 *   </li>
 *   <li>Checks that a 405 Forbidden is returned when attempting a PUT request.
 *   </li>
 * </ol>
 *
 * @module tests/put-todo
 * @requires chai
 * @requires chai-http
 * @requires test-helpers/test-server
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

chai.use(chaiHttp);

/**
 * Chai expect object
 * @const
 */
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