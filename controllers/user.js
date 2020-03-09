'use strict'
var validator =require('validator');

var controller = {
    probando: function (req, res) {
        return res.status(200).send({
            message: "Soy el metodo probando"
        });
    },
    testeaando : function (req,res) {
        return res.status(200).send({
            message: "Soy el metodo testeando"
        });
    },

    save: function (req, res) {

        var params = req.body;

        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        if(validate_password && validate_name && validate_email && validate_surname){

        }else{
            return res.status(200).send({
                message : "Los campos no son validos",
            });
        }


        return res.status(200).send({
            message : "Registro de usuarios",
        });
    }
};


module.exports = controller;
