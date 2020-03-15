'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

router.get('/probando', UserController.probando);
router.get('/testeando', UserController.testeaando);

router.post('/register',UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated, UserController.update);

module.exports = router;
