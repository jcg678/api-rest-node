'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', {useNewUrlParser: true})
    .then(()=>{
            console.log('ok connenct');
        }).catch(error=> console.log(error));


