/** Provides helper functions that assert errors are thrown as expected.
 * @module test-helpers/assert-response
 * @requires chai
 * @requires chai-as-promised
 */

/**
 * Chai expect object with chai-as-promised middleware
 * @type {object}
 * @const
 */
const { expect } = require('chai').use(require('chai-as-promised'));

/**
 * Helper funcion to verify a returned ValidationError has the expected status
 * code, name and error content.
 * @param  {Object} request - Request object that is expected to raise the
 *      ValidationError.
 * @param  {Object} invalidFields - An object containing the expected invalid
 *      property names along with the expected error strings as values.
 */
exports.isValidationError = async function isValidationError(
    request,
    invalidFields
) {
    const error = await expect(request).to.eventually.be.rejected;

    const response = error.response;

    expect(response).to.have.property('status', 400);

    expect(response).to.have.nested.property(
        'data.error.name',
        'ValidationError'
    );

    Object.entries(invalidFields).forEach(([fieldName, expectedFieldError]) => {
        expect(response).to.have.nested.property(
            `data.error.invalidFields.${fieldName}`,
            expectedFieldError
        );
    });
};

/**
 * Helper funcion to verify a returned ResourceNotFoundError has the expected
 * status code, name and error content.
 * @param  {Object} request - Request object that is expected to raise the
 *      ResourceNotFoundError.
 * @param  {String} resource - The name of the resource that could not be found.
 */
exports.isResourceNotFoundError = async function isResourceNotFoundError(
    request,
    resource
) {
    const error = await expect(request).to.eventually.be.rejected;

    const response = error.response;

    expect(response).to.have.property('status', 404);

    expect(response).to.have.nested.property(
        'data.error.name',
        'ResourceNotFoundError'
    );

    expect(response).to.have.nested.property('data.error.resource', resource);
};