var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var Verify = require('./verify');

var commentRouter = express.Router();
commentRouter.use(bodyParser.json());


// handling all comments
commentRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Dishes.find({'comments.postedBy': req.decoded._id})
    .populate('comments.postedBy')
    .exec(function (err, dish) {
        if (err) next(err);
        dish.push({userId:req.decoded._id});
        res.json(dish);
    })
})

module.exports = commentRouter;