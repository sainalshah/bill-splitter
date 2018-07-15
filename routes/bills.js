



var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Bills = require('../models/bill');

var billRouter = express.Router();
billRouter.use(bodyParser.json());
billRouter.route('/')
.get( function (req, res, next) {
    Bills.find({})
        .exec(function (err, bill) {
        if (err) throw err;
        res.json(bill);
    });
})

.post( function (req, res, next) {
    console.log(req.body);
    Bills.create(req.body, function (err, bill) {
        if (err) throw err;
        console.log(bill);
        
        console.log('bill created!');
        var id = bill._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end('Added the bill with id: ' + id);
    });
})

.put(function (req, res, next) {
    console.log(req.body);
    
    Bills.update({_id:req.body.billId},req.body,function(err,bill){
        res.json(bill);
    });
})
.delete(function (req, res, next) {
    Bills.findByIdAndRemove(req.body.billId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
module.exports = billRouter;