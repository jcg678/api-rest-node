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
        

    }

};

module.exports = controller;
