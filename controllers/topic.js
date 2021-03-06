'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {
    test: function (req, res) {
        return res.status(200).send({
            message : 'topic controller'
        });
    },
    save: function (req, res) {
        
        var params = req.body;

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        }catch (e) {
            return res.status(200).send({
                message : 'Faltann datos por enviar'
            });
        }

        if( validate_content && validate_lang && validate_title){
            var topic = new Topic();
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;

            topic.save((err, topicStored)=>{

                if(err || !topicStored){
                    return res.status(404).send({
                       status: 'error',
                       message: 'El tema no se ha guardado'
                    });
                }

                return res.status(200).send({
                    status : 'success',
                    topic: topicStored
                });
            });


        }else{
            return res.status(200).send({
                message : 'Los datos no son válidos'
            });
        }
        

    },
    getTopics: function (req, res) {

        if(req.params.page == null || req.params.page == false || req.params.page == undefined || req.params.page == 0 || req.params.page == '0' ){
            var page = 1;
        }else{
            var page = parseInt(req.params.page);
        }

        var options ={
            sort: {date: -1},
            populate: 'user',
            limit: 5,
            page: page
        };

        Topic.paginate({},options, (err, topics)=>{

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al hacer la consulta',
                });
            }

            if(!topics){
                return res.status(404).send({
                    status: 'notFound',
                    message: 'No hay topics',
                });
            }

            return res.status(200).send({
                status: 'success',
                topics: topics.docs,
                totalDocs : topics.totalDocs,
                totalPages: topics.totalPages
            });

        });


    },

    getTopicsByUser: function (req, res) {
        var userId = req.params.user;

        Topic.find({
            user: userId
        }).sort([['date','descending']]).exec((err, topics)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }

            if(!topics){
                return res.status(404).send({
                    message: 'No hay temas para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                topics
            });
        });

    },
    getTopic: function (req, res) {

        var topicId = req.params.id;

        Topic.findById(topicId).
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
    },
    update: function (req, res) {
        var topicId = req.params.id;

        var params = req.body;

        console.log(params);
        console.log(topicId);

        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
        }catch (e) {
            return res.status(200).send({
                message : 'Faltann datos por enviar'
            });
        }

        if(validate_title && validate_content && validate_lang){
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            };

            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new:true}, (err, topicUpdate)=>{

                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion'
                    });
                }

                if(!topicUpdate){
                    return res.status(500).send({
                        status: 'error',
                        message: 'No se ha actualizado el tema'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    topicUpdate
                });
            });



        }else{
            return res.status(200).send({
                message: 'La validación de datos no es correcta',
            });
        }
    },
    delete : function (req, res) {

        var topicId = req.params.id;

        Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicRemove)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }

            if(!topicRemove){
                return res.status(500).send({
                    status: 'error',
                    message: 'No se ha borrado el tema'
                });
            }


            return res.status(200).send({
                status: 'success',
                topic: topicRemove
            });
        });
    },
    search: function (req, res) {

        var searchString = req.params.search;

        Topic.find({
            "$or":[
                {"title": {"$regex": searchString, "$options": "i"}},
                {"content": {"$regex": searchString, "$options": "i"}},
                {"code": {"$regex": searchString, "$options": "i"}},
                {"lang": {"$regex": searchString, "$options": "i"}},
            ]
        }).populate('user')
            .sort([['date','descending']])
            .exec((err, topics)=>{
           if(err){
               return res.status(200).send({
                   status: 'error',
                   message: 'Errro en la peticion'
               });
           }

           if(!topics){
               return res.status(404).send({
                   status: 'error',
                   message: 'No hay resultados'
               });
           }

            return res.status(200).send({
                status: 'success',
                topics
            });


        });



    }

};

module.exports = controller;
