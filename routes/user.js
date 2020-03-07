'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

router.get('/probando', UserController.probando);

router.get('/testeando', UserController.testeaando);

module.exports = router;
