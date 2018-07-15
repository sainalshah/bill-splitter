



var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Config = require('../models/config');

var configRouter = express.Router();
configRouter.use(bodyParser.json());
configRouter.route('/')
.get( function (req, res, next) {
    Config.find({})
        .exec(function (err, config) {
        if (err) throw err;
        res.json(config);
    });
})

.put(function (req, res, next) {
    console.log(req.body);
    
    Config.update({_id:req.body.configId},req.body,function(err,config){
        res.json(config);
    });
});
module.exports = configRouter;