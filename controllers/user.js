'use strict'
var validator =require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

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

    },
    uploadAvatar: function (req,res) {

        var file_name = 'Avatar no subido...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        var file_path = req.files.file0.path;

        ///Cuidado en linux o Mac se utiliza / en lugar de \\
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext= ext_split[1];

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext!= 'gif' ){
            fs.unlink(file_path, (err)=>{
                return res.status(200).send({
                    status: 'error',
                    message: 'la extension del archivo no es valida',
                    file: file_ext
                });
            });
        }else{
            var userId = req.user.sub;

            User.findOneAndUpdate({_id: userId},{image: file_name},{new:true},(err,userUpdated)=>{
                if(err || !userUpdated){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar el usuario'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    message: 'Uload avatar',
                    user: userUpdated
                });
            });


        }

    },
    avatar: function (req,res) {
        var file_name = req.params.file_name;
        var path_file = './uploads/users/'+file_name;

        fs.exists(path_file, (exits)=>{
            if(exits){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    message: 'La imagen no existe'
                });
            }
        })
    },
    getUsers: function (req, res) {
        User.find().exec((err, users)=>{
           if(err || !users){
               return res.status(404).send({
                   status: 'error',
                   message: 'No existe usuarios'
               });
           }

           return res.status(200).send({
              status: 'success',
              users
           });
        });
    },
    getUser: function (req, res) {
        var userId = req.params.userId;

        User.findById(userId).exec((err, user)=>{
            if(err || !user){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe usuario'
                });
            }

            return res.status(200).send({
                status: 'success',
                user
            });
        });

    }
};


module.exports = controller;
