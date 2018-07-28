



var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../config/verify');
var Bills = require('../models/bill');

var billRouter = express.Router();
billRouter.use(bodyParser.json());
billRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Bills.find({})
        .exec(function (err, bill) {
        if (err) throw err;
        res.json(bill);
    });
})

.post(Verify.verifyOrdinaryUser,function (req, res, next) {
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

.put(Verify.verifyOrdinaryUser,function (req, res, next) {
    console.log(req.body);
    
    Bills.update({_id:req.body.billId},req.body,function(err,bill){
        res.json(bill);
    });
})
.delete(Verify.verifyOrdinaryUser,function (req, res, next) {
    Bills.findByIdAndRemove(req.body.billId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});
module.exports = billRouter;