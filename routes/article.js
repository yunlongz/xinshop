var express = require('express');
var models = require('../models/Jewelry');
var Jewelry = models.Jewelry;
var router = express.Router();
var path = require('path')
require('express-mongoose');
const fs = require('fs-extra')
const file = path.resolve(__dirname, '../public/json/fuck.json'); 
var fetchUtil  = require('../fetchData')
/* GET home page. */
router.get('/jewelry', function(req, res, next) {
	var page = req.query.page ? parseInt(req.query.page) : 1;
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	Jewelry.count({}, function(err, count) {
    Jewelry.find({}, null, {skip: (page-1)*limit, limit: limit}, function(err, lists) {
      res.json({
        categories: lists,
        page: page,
        isFirstPage: page == 1,
        isLastPage: (page-1)*limit + lists.length == count,
        count:count
        // success: req.flash('success').toString(),
        // error: req.flash('error').toString()
      });
    });
  });
});
router.get('/jewelry/find', function(req, res, next) {
	var page = req.query.page ? parseInt(req.query.page) : 1;
	var limit = req.query.limit ? parseInt(req.query.limit) : 10;
	var title = req.query.value;
	Jewelry.count({title:new RegExp(title,'i')}, function(err, count) {
    Jewelry.find({title:new RegExp(title,'i')}, null, {skip: (page-1)*limit, limit: limit}, function(err, lists) {
      res.json({
        categories: lists,
        page: page,
        isFirstPage: page == 1,
        isLastPage: (page-1)*limit + lists.length == count,
        count:count
        // success: req.flash('success').toString(),
        // error: req.flash('error').toString()
      });
    });
  });
});
router.get('/jewelry/add', function(req, res, next) {
	var categroy = [
		    'necklaces',
		    'bracelets',
		    'earrings',
		    'rings'
		]
	fetchUtil.fetchDataFromWebSit(categroy)
	res.send('Data inited'); 

});
module.exports = router;
