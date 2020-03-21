'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'});

router.get('/probando', UserController.probando);
router.get('/testeando', UserController.testeaando);

router.post('/register',UserController.save);
router.post('/login', UserController.login);
router.put('/update', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_upload,md_auth.authenticated], UserController.uploadAvatar);

module.exports = router;
