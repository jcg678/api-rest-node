'use strict'

exports.authenticated = function (req, res, next) {
        console.log('estas pasando por el middleware');
    next();
}
