'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.get('/probando', UserController.probando);
router.get('/testeando', UserController.testeaando);

router.post('/register',UserController.save);
router.post('/login', UserController.login);

module.exports = router;
