const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/', userController.index);
router.get('/new', userController.new);
router.get('/:id', userController.show);
router.post('/', userController.create);
router.get('/:id/edit', userController.edit);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);
