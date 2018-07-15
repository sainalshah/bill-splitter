var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Bill = require('../models/bill');
var User = require('../models/user');

var rentRouter = express.Router();
rentRouter.use(bodyParser.json());
rentRouter.route('/')
    .get(function (req, res, next) {
        User.find({}).lean()
            .exec(function (err, users) {
                if (err) throw err;
                Bill.find({})
                    .exec(function (err, bills) {
                        if (err) throw err;
                        res.json(determineRent(users, bills));
                    });
            });
    });
function updateRent(users, index, rent) {
    if (index > -1) {
        users[index].rent = typeof users[index].rent !== 'undefined' ?
            users[index].rent + rent : users[index].baseRent + rent;
    }
    return users;
}
function determineRent(users, bills) {
    console.log("inside determine Rent()");
    bills.forEach(bill => {
        n = bill.payableUsers.length ? bill.payableUsers.length : 1;
        share = bill.amount / n;
        console.log("share amount :", share);

        bill.payableUsers.forEach(payableUser => {

            payableUserIndex = users.findIndex(function (user) { return user._id == payableUser && user._id != bill.createdBy; });
            // console.log("userIndex: ", payableUserIndex);
            users = updateRent(users, payableUserIndex, share);
            // console.log("printing users from foreach bill", users);
            billCreatedUserIndex = users.findIndex(function (user) { return user._id == payableUser && user._id == bill.createdBy; });
            // console.log("bill Creators index", billCreatedUserIndex);

            billCreatorReduction = -1 * share * (n - 1);
            users = updateRent(users, billCreatedUserIndex,billCreatorReduction);
        });
    });
    console.log("print user before returning", users);
    return users;
}
module.exports = rentRouter;