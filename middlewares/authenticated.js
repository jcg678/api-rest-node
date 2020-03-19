'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');


var secret = 'clave-secreta-para-generar-token';

exports.authenticated = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({
           message: 'La petición no tine la cabecera de authorization'
        });

    };

    var token = req.headers.authorization.replace(/['"]+/g, '');
    
    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: 'El token a expirado'
            });
        }
    }catch (e) {
        return res.status(404).send({
            message: 'El token no es valido'
        });
    }

    req.user = payload;

    next();
};
