/** The service that handles all CRUD operations on the todo database.
 * @module TodosService
 * @requires mongodb
 * @requires errors/ValidationError
 * @requires errors/ResourceNotFoundError
 */

/**
 * ObjectId type from mongodb
 * @const
 */
const { ObjectId } = require('mongodb');

/**
 * Custom error to be thrown when a body fails validation
 * @const
 */
const ValidationError = require('../errors/ValidationError');

/**
 * Custom error to be thrown when a todo is not found
 * @const
 */
const ResourceNotFoundError = require('../errors/ResourceNotFoundError');

/** Service to handle all CRUD operations to the todo database.
 */
class TodosService {
    /**
     * Initialize the service.
     * @param  {} db - Mongo DB object
     */
    constructor(db) {
        this.db = db;
    }

    /**
     * List all todos in the database sorted by ID.
     */
    async listTodos() {
        const todos = await this.db
            .collection('todos')
            .find({})
            .sort({ _id: 1 })
            .toArray();

        return todos;
    }

    /**
     * Create a new todo in the database.
     * @param  {Object} todoData - Object containing the data for the new todo.
     */
    async createTodo(todoData) {
        if (!todoData.title) {
            throw new ValidationError({ title: 'required' });
        }

        if (typeof todoData.title != 'string') {
            throw new ValidationError({ title: 'must be a string' });
        }

        todoData.title = todoData.title.trim();

        const result = await this.db.collection('todos').insertOne({
            title: todoData.title,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const todo = result.ops[0];

        return todo;
    }

    /**
     * Update an existing todo in the database
     * @param  {String} todoId - The ID of the todo to update.
     * @param  {Object} todoData - Data to update the todo with.
     */
    async patchTodo(todoId, todoData) {
            if (!ObjectId.isValid(todoId)) {
                throw new ResourceNotFoundError('Todo');
            }

            todoId = new ObjectId(todoId);

            todoData = sanitize(todoData);

            validate(todoData);

            todoData.updatedAt = new Date();

            const result = await this.db
                .collection('todos')
                .findOneAndUpdate({ _id: todoId }, { $set: todoData }, { returnOriginal: false });

            if (!result.value) {
                throw new ResourceNotFoundError('Todo');
            }

            return result.value;

            /**
             * Sanitize the provided todo data to update with.
             * @param  {Object} todoData - Data to update the todo with.
             */
            function sanitize(todoData) {
                const sanitizedTodoData = {};

                if (todoData.title != null) {
                    sanitizedTodoData.title = todoData.title;
                }

                if (typeof todoData.title === 'string') {
                    sanitizedTodoData.title = todoData.title.trim();
                }

                if (todoData.completed != null) {
                    sanitizedTodoData.completed = todoData.completed;
                }

                return sanitizedTodoData;
            }

            /**
             * Validate the provided todo data to update with - "title" must be a
             * string that is not empty and "completed" must be a boolean.
             * @param  {Object} todoData - Data to update the todo with.
             */
            function validate(todoData) {
                const invalidFields = {};

                if (todoData.title != null && typeof todoData.title !== 'string') {
                    invalidFields.title = 'must be a string';
                } else if (todoData.title === '') {
                    invalidFields.title = 'cannot be an empty string';
                }

                if (
                    todoData.completed != null &&
                    typeof todoData.completed !== 'boolean'
                ) {
                    invalidFields.completed = 'must be a boolean';
                }

                if (Object.keys(invalidFields).length > 0) {
                    throw new ValidationError(invalidFields);
                }
            }
        }
        /**
         * Delete an existing todo from the database.
         * @param  {String} todoId - The ID of the todo to delete.
         */
    async deleteTodo(todoId) {
        if (!ObjectId.isValid(todoId)) {
            throw new ResourceNotFoundError('Todo');
        }

        todoId = new ObjectId(todoId);

        const result = await this.db
            .collection('todos')
            .deleteOne({ _id: todoId });

        if (result.deletedCount !== 1) {
            throw new ResourceNotFoundError('Todo');
        }
    }
}

module.exports = TodosService;