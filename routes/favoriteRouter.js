var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify    = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.findOne({postedBy: req.decoded._id})
    .populate('dishes')
    .populate('postedBy')
    .exec(function (err, favorite){
        if (err) next(err);
        res.json(favorite);
    });
})
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
   Favorites.findOneAndUpdate(
	   {postedBy : req.decoded._id}, 
	   {$addToSet: { dishes: req.body} },
	   {upsert:true, new:true} , function (err, favorite) {
	          if (err) next(err);
              console.log(req.body);
	          console.log('dish added to favorites!');
	          res.json(favorite);
		})
})

router.route('/:dishId')
.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.findOne({postedBy: req.decoded._id}, function (err, favorite){
        if (err) next(err);
        for (var i = 0; i < favorite.dishes.length; i++) {
            console.log(favorite.dishes[i] == req.params.dishId);
            if (favorite.dishes[i] == req.params.dishId) {
                favorite.dishes.splice(i,1);
                break;
            }
        }
        favorite.save(function (err, resp) {
            if (err) next(err);
            console.log('Delete a favorite dish');
            res.json(resp);
        });
    })
});

module.exports = router;