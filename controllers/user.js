'use strict'
var validator =require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

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

        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch (e) {
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }


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
    },
    login: function (req, res) {
        var params = req.body;

        try{
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch (e) {
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }

        if(!validate_email || !validate_password) {
            return res.status(200).send({
                message: "los datos son incorrectos"
            });
        }

        User.findOne({email: params.email.toLowerCase()},(err,user)=>{

            if(err){
                return res.status(500).send({
                    message: "Error al intentar identificarse"
                });
            }

            if(!user){
                return res.status(404).send({
                    message: "El usuario no existe"
                });
            }

            bcrypt.compare(params.password, user.password, (err, check)=>{

            if(check){

                if(params.gettoken){
                    return res.status(200).send({
                        token: jwt.createToken(user)
                    });
                }

                user.password = undefined;
                return res.status(200).send({
                    message: "Metodo de Login",
                    user
                });
             }else{
                return res.status(200).send({
                    message: "La contraseña no es correcta"
                });
            }
            });
        });
    },
    update: function (req, res) {
        var params = req.body;

        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        }catch (e) {
            return res.status(200).send({
                message: "Faltan datos por enviar",
                params
            });
        }
        delete params.password;

        var userId = req.user.sub;

        if(req.user.email != params.email){
            User.findOne({email: params.email.toLowerCase()},(err,user)=> {

                if (err) {
                    return res.status(500).send({
                        message: "Error al intentar actualizar"
                    });
                }

                if (user && user.email == params.email) {
                    return res.status(404).send({
                        message: "El email no puede ser modificado"
                    });
                }
            }
            );
        }else{

            User.findOneAndUpdate({_id:userId},params,{new:true},(err,userUpdated)=>{
                if(err){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al actulializar el usuario'
                    });
                }

                if(!userUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'No llega el user actualizado'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user: userUpdated
                });

            });
        }

    }
};


module.exports = controller;
