/** Tests for miscellaneous request methods.
 * <ul>
 *   <li>HEAD method tests:
 *     <ol>
 *       <li>Checks the response to a HEAD request has the expected headers:
 *         <ul>
 *          <li>Access-Control-Allow-Origin: *</li>
 *          <li>Access-Control-Allow-Headers: X-Requested-With,
 *              X-HTTP-Method-Override, Content-Type, Accept</li>
 *         </ul>
 *       </li>
 *       <li>Checks that a 204 status and no content are returned.</li>
 *     </ol>
 *   </li>
 *
 *   <li>OPTIONS method tests:
 *     <ol>
 *       <li>Checks the response to an OPTIONS request has the expected headers:
 *         <ul>
 *          <li>Access-Control-Allow-Origin: *</li>
 *          <li>Access-Control-Allow-Headers: X-Requested-With,
 *              X-HTTP-Method-Override, Content-Type, Accept</li>
 *          <li>Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS,
 *              HEAD</li>
 *         </ul>
 *       </li>
 *       <li>Checks that a 204 status and no content are returned.</li>
 *     </ol>
 *   </li>
 * </ul>
 *
 * @module tests/misc-todo
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