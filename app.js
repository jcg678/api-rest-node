'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/prueba', (req, res)=>{
   return res.status(200).send({
        nombre: 'Pruebaa',
        message: 'Hola mundo desde el backend'
   });
});

module.exports =app;
