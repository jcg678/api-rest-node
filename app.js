'use strict'

var express = require('express');
var bodyparser = require('body-parser');

var app = express();

var user_routes = require('./routes/user');
var topic_routes = require('./routes/topics');
var comment_routes = require('./routes/comment');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/prueba', (req, res)=>{
   return res.status(200).send({
        nombre: 'Pruebaa',
        message: 'Hola mundo desde el backend'
   });
});

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use('/api',user_routes);
app.use('/api',topic_routes);
app.use('/api',comment_routes);

module.exports =app;
