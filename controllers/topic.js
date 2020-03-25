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


    }

};

module.exports = controller;
