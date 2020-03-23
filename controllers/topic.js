'use strict'

var controller = {
    test: function (req, res) {
        return res.status(200).send({
            message : 'topic controller'
        });
    },
    save: function (req, res) {
        return res.status(200).send({
            message : 'Guardar Tema'
        });
    }

};

module.exports = controller;
