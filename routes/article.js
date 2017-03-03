var express = require('express');
var models = require('../models/Jewelry');
var UserModel = require('../models/User');
var Jewelry = models.Jewelry;
var User = UserModel.User
var router = express.Router();
var path = require('path')
require('express-mongoose');
const fs = require('fs-extra')
const file = path.resolve(__dirname, '../public/json/fuck.json'); 
var moment = require('moment');
var fetchUtil  = require('../fetchData')
/* GET home page. */
router.post('/jewelry', function(req, res, next) {
   console.log(req.body.condition)
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var limit = req.body.limit ? parseInt(req.body.limit) : 10;
  var condition = req.body.condition || null
  if(condition && condition.title != ''){
    condition.title = new RegExp(condition.title,'i')
  }
  // condition = JSON.parse(condition)

	Jewelry.count({}, function(err, count) {
    Jewelry.find(condition, null, {skip: (page-1)*limit, limit: limit,sort:{createdAt: -1 }}, function(err, lists) {
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
router.get('/jewelry/init',function(req,res,next){
  var xin = new User({
    username: 'anxin',
    _jewelry: [],
    createdAt: moment().format()
  })
  res.send(xin.save())

})

router.get('/jewelry/all', function(req, res, next) {
  Jewelry.count({}, function(err, count) {
    Jewelry.find({}, function(err, lists) {
      var cat = [
          {
            "_id": {
              "$oid": "58b5770385dfa57985aa8b57"
            },
            "title": "Atlas Tie Choker",
            "price": "$32.00 SGD",
            "imageUrl": "http://cdn.shopify.com/s/files/1/0709/8469/products/Atlas_Tie_Choker_large.jpg?v=1480780980",
            "isSoldOut": false,
            "isExist": false,
            "kind": "necklaces",
            "createdAt": "2017-02-28T21:11:02+08:00"
          },
          {
            "_id": {
              "$oid": "58b5770385dfa57985aa8b58"
            },
            "title": "Avril Necklace (Gold)",
            "price": "$16.00 SGD",
            "imageUrl": "http://cdn.shopify.com/s/files/1/0709/8469/products/Avril_gold_01_large.jpg?v=1468666827",
            "isSoldOut": false,
            "isExist": false,
            "kind": "necklaces",
            "createdAt": "2017-02-28T21:11:02+08:00"
          },
          {
            "_id": {
              "$oid": "58b5770385dfa57985aa8b59"
            },
            "title": "Avril Necklace (Silver)",
            "price": "$16.00 SGD",
            "imageUrl": "http://cdn.shopify.com/s/files/1/0709/8469/products/Avril_Silver_1_large.jpg?v=1468653640",
            "isSoldOut": true,
            "isExist": false,
            "kind": "necklaces",
            "createdAt": "2017-02-28T21:11:02+08:00"
          }]
      lists.map(item =>{
        for (let i = 0 ; i < cat.length ; i++){
          if(item.title == cat[i].title && item.isSoldOut != cat[i].isSoldOut ){
            Jewelry.findOneAndUpdate({_id:cat[i]._id.$oid}, { $set: { isSoldOut:cat[i].isSoldOut  }},function(err,res){
              console.log(err)
            })
          }
        }
      })
    });
  });
              res.send("down 1123123")

});
router.post('/jewelry/find', function(req, res, next) {
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var limit = req.body.limit ? parseInt(req.body.limit) : 10;
	var title = req.body.value;
  var condition =  req.body.condition || {}
  condition = Object.assign(condition,{title:new RegExp(condition.title,'i')})
	Jewelry.count(condition, function(err, count) {
    Jewelry.find(condition, null, {skip: (page-1)*limit, limit: limit}, function(err, lists) {
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
router.post('/jewelry/myjewelry',function(req, res, next) {
  var username = req.body.username;

  User.findOne({username: username }).populate('_jewelry').exec(function(err, lists){
    res.send(lists)
  })
  
})
router.post('/jewelry/update',function(req, res, next) {
  var list = req.body.list;

  User.findOne({username: 'anxin'}).exec(function(err,user){
    list.map(item=>{
      user._jewelry.push(item)
      Jewelry.findByIdAndUpdate(item._id,{ $set: { isExist: true }},function(err,jewelry){
        console.log("修改成功")
      })
    })
    user.save(function(err){
        if (err) return handleError(err);
        res.json({
          code:'00'
        });
    });
  });
  
})
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
