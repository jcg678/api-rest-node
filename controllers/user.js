'use strict'
var validator =require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

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
            var user = new User();
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.password = params.password;
            user.role = 'ROLE_USER';
            user.image = null;

            User.findOne({email: user.email}, (err, issetUser)=>{
                if(err) {return res.status(500).send({message : "Duplicidad de usuario"});}

                if(!issetUser){

                    bcrypt.hash(params.password, null, null, (err, hash)=>{
                        user.password = hash;

                        user.save((err,userStored)=>{
                            if(err){
                                return res.status(500).send({message : "Error al guardar de usuario"});
                            }
                            if(!userStored){
                                return res.status(400).send({message : "El usuario no se ha guardado"});
                            }

                            return res.status(200).send({
                                status: 'success',
                                user:userStored});

                        });

                        //return res.status(500).send({message : "El usuario no esta registrado"});
                    });



                }else{
                    return res.status(500).send({message : "El usuario ya esta registrado"});
                }
            });

        }else{
            return res.status(200).send({
                message : "Los campos no son validos",
            });
        }


        /*return res.status(200).send({
            message : "Registro de usuarios",
        });*/
    }
};


module.exports = controller;
