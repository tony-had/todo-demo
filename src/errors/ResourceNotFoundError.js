/** Error to be thrown when a resource can not be found.
 * @module errors/ResourceNotFoundError
 */

/** Custom error to be thrown when a resource can not be found
 *  @extends Error
 */
class ResourceNotFoundError extends Error {
    /**
     * Create a ResourceNotFoundError
     * @param  {String} resource - The name of the resource that could not be
     *      found.
     */
    constructor(resource) {
        super();

        this.name = 'ResourceNotFoundError';
        this.resource = resource;
    }
}

/** Error to be thrown when a resource can not be found */
module.exports = ResourceNotFoundError;