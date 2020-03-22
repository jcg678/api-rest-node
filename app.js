'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

var user_routes = require('./routes/user');
var topic_routes = require('./routes/topics');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/prueba', (req, res)=>{
   return res.status(200).send({
        nombre: 'Pruebaa',
        message: 'Hola mundo desde el backend'
   });
});

app.use('/api',user_routes);
app.use('/api',topic_routes);

module.exports =app;
