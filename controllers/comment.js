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


                    Topic.findById(topic._id).
                    populate('user').
                    populate('comments.user')
                        .exec((err,topic)=>{

                            if(err){
                                return res.status(500).send({
                                    status: 'error',
                                    message: 'Error en la peticion'
                                });
                            }

                            if(!topic){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'No existe ningun topic'
                                });
                            }

                            return res.status(200).send({
                                status: 'success',
                                topic
                            });
                        });

                    /*return res.status(200).send({
                       status: 'success',
                       topic
                    });*/
                });


            }else{
                return res.status(200).send({
                    message : 'No se han validado los datos del comentario'
                });
            }


        });


    },
    update: function (req, res) {

        var commentId = req.params.commentId;
        var params = req.body;


        try{
            var validate_content = !validator.isEmpty(params.content);
        }catch (e) {
            return res.status(200).send({
                message : 'No has comentado nada'
            });
        }

        if(validate_content){
            Topic.findOneAndUpdate({"comments._id": commentId},
                {"$set":{
                    "comments.$.content": params.content
                    }},
                    {new: true},(err,topicUpdate)=>{

                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion'
                        });
                    };

                    if(!topicUpdate){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe'
                        });
                    }

                        return res.status(200).send({
                            status: "success",
                            topicUpdate
                        });

                    });


        }


    },
    delete: function (req, res) {
        var commentId = req.params.commentId;
        var topicId = req.params.topicId;

        Topic.findById(topicId, (err, topic)=>{

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            };

            if(!topic){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe'
                });
            }

            var comment = topic.comments.id(commentId);

            if(comment){
                comment.remove();

                topic.save((err, topic)=>{
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la peticion guardar topic'
                        });
                    };


                    Topic.findById(topic._id).
                    populate('user').
                    populate('comments.user')
                        .exec((err,topic)=>{

                            if(err){
                                return res.status(500).send({
                                    status: 'error',
                                    message: 'Error en la peticion'
                                });
                            }

                            if(!topic){
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'No existe ningun topic'
                                });
                            }

                            return res.status(200).send({
                                status: 'success',
                                topic
                            });
                        });

                    /*return res.status(200).send({
                        status: 'success',
                        topic
                    });*/
                });
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }


        });

    },
};

module.exports = controller;
