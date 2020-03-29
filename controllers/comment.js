'use strict'

var Topic = require('../models/topic');
var validator = require('validator');

var controller ={
    add: function (req, res) {

        var topicId = req.params.topicId;
        var params = req.body;

        Topic.findById(topicId).exec((err, topic)=>{
           if(err){
               return res.status(500).send({
                   status: 'error',
                   message: 'Error en al peticion'
               });
           }

           if(!topic){
               return res.status(404).send({
                   status: 'error',
                   message: 'No existe'
               });
           }

           if(req.body.content){
               try{
                   var validate_content = !validator.isEmpty(params.content);
               }catch (e) {
                   return res.status(200).send({
                       message : 'No has comentado nada'
                   });
               }
           }

            if(validate_content){
                var comment = {
                    user: req.user.sub,
                    content: req.body.content,
                };

                topic.comments.push(comment);

                topic.save((err)=>{

                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error al guardar'
                        });
                    };


                    return res.status(200).send({
                       status: 'succes',
                       topic
                    });
                });


            }else{
                return res.status(200).send({
                    message : 'No se han validado los datos del comentario'
                });
            }


        });


    },
    update: function (req, res) {
        return res.status(200).send({
            message: "metodo de actualizar comentario"
        });
    },
    delete: function (req, res) {
        return res.status(200).send({
            message: "metodo de borrar comentario"
        });
    },
};

module.exports = controller;
