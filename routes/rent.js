var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('../config/verify');

var Bill = require('../models/bill');
var User = require('../models/user');
var Rent = require('../models/rent');
var configStore = require('../config/config');

var rentRouter = express.Router();
rentRouter.use(bodyParser.json());
rentRouter.route('/')
    .get(Verify.verifyOrdinaryUser, async function (req, res, next) {
        try {
            lastRent = await Rent.findOne().sort({ createdTstamp: -1 }).limit(1).exec();
            if (!lastRent) {
                lastRent = getDummyRent();
            }
            bills = await Bill.find({ createdTstamp: { $gt: lastRent.billEndDate } }).exec();

            users = await User.find({}).lean().exec();
            return res.json(determineRent(users, bills));
        } catch (e) {
            next(e);
        }
        res.json({ "Error": 500 });
    });
function getDummyRent() {

    cutoffDate = configStore.getCutoffDate();
    lastRent = new Date(cutoffDate.setMonth(cutoffDate.getMonth() - 1));
    return {
        id: "test",
        billStartDate: null,
        billEndDate: lastRent,
        rent: [{
            _id: "test_user",
            rent: 0.0
        }],
        created_at: new Date()
    }
}
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
            users = updateRent(users, billCreatedUserIndex, billCreatorReduction);
        });
    });
    console.log("print user before returning", users);
    return users;
}
module.exports = rentRouter;