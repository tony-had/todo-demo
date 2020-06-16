/** Error to be thrown when a body fails validation.
 * @module errors/ValidationError
 */

/** Custom error to be thrown when a property fails validation
 *  @extends Error
 */
class ValidationError extends Error {
    /**
     * Create a ValidationError
     * @param  {Object} invalidFields - An object with a property for each field
     *      that fails validation and a string describing the problem as a
     *      value.
     */
    constructor(invalidFields) {
        super();

        this.name = 'ValidationError';
        this.invalidFields = invalidFields;
    }
}

module.exports = ValidationError;