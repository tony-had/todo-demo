/** Express router providing routes to todos
 * @module routes
 * @requires express
 * @requires TodosService
 */

/**
 * express module
 * @const
 */
const express = require('express');

/**
 * TodosService module
 * @const
 */
const TodosService = require('./TodosService');

/**
 * Express router to mount todos-related functions on.
 * @type {Object}
 * @const
 */
const router = express.Router();

/**
 * Route serving all todos.
 * @name get/todos
 * @function
 * @memberof module:routes
 * @inner
 * @param {String} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/todos', function(req, res, next) {
    const { db } = req;

    const todosService = new TodosService(db);

    todosService
        .listTodos()
        .then((todos) => res.status(200).json({ todos }))
        .catch(next);
});

/**
 * Route for creating a new todo.
 * @name post/todos
 * @function
 * @memberof module:routes
 * @inner
 * @param {String} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/todos', function(req, res, next) {
    const { db, body } = req;

    const todosService = new TodosService(db);

    todosService
        .createTodo(body)
        .then((todo) => res.status(201).json({ todo }))
        .catch(next);
});

/**
 * Route for updating an existing todo, identified by provided id.
 * @name patch/todos/:todoId
 * @function
 * @memberof module:routes
 * @inner
 * @param {String} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.patch('/todos/:todoId', function(req, res, next) {
    const { db, body } = req;

    const { todoId } = req.params;

    const todosService = new TodosService(db);

    todosService
        .patchTodo(todoId, body)
        .then((todo) => res.status(200).json({ todo }))
        .catch(next);
});

/**
 * Route for deleting an existing todo, identified by provided id.
 * @name delete/todos/:todoId
 * @function
 * @memberof module:routes
 * @inner
 * @param {String} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.delete('/todos/:todoId', function(req, res, next) {
    const { db } = req;

    const { todoId } = req.params;

    const todosService = new TodosService(db);

    todosService
        .deleteTodo(todoId)
        .then(function() {
            res.status(204).json({});
        })
        .catch(next);
});

module.exports = router;