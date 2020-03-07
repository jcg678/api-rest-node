'use strict'

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
    }
};


module.exports = controller;
