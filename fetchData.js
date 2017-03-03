var Crawler = require("crawler");
var url = require('url');
var fs = require('fs-extra')
var moment = require('moment');
var models = require('./models/Jewelry');
var Jewelry = models.Jewelry;
var path = require('path')
require('express-mongoose');

const page = 5
var c = new Crawler({
     rateLimit: 2000,   
    maxConnections : 2,
    rotateUA:true,
    gzip:true,
    headers:{
        "Upgrade-Insecure-Requests":1,
        "User-Agent":"Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.7 (KHTML, like Gecko) Ubuntu/11.04 Chromium/16.0.912.77 Chrome/16.0.912.77 Safari/535.7"

    },
    // referer:'http://www.google.com',
     userAgents : [
                    'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
                    'Opera/9.25 (Windows NT 5.1; U; en)',
                    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
                    'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
                    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
                    'Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
                    "Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.7 (KHTML, like Gecko) Ubuntu/11.04 Chromium/16.0.912.77 Chrome/16.0.912.77 Safari/535.7",
                    "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:10.0) Gecko/20100101 Firefox/10.0 ",

                    ] ,
   
});

let jsonData = {"group":[]}
var queneFetch = function(categroy){
    var count = 0;
    for(var i = 1 ; i < page ; i++){
        for(let k = 0;k < categroy.length ; k++){
            let url = "http://fawnxfern.com/collections/"+categroy[k]+"?page="+i
            console.log(url)
             c.queue([{
                uri: url,
                // The global callback won't be called
                callback: function (error, res, done) {
                    let uriArray = res.options.uri.split('?');
                    let requestPage = uriArray[1].substring(uriArray[1].length-1)
                    let tem = uriArray[0].split('/')
                    let categroyTmp = tem[tem.length - 1]
                    // console.log(categroy)
                    if(error){
                        console.log("^^^^^^^")
                        console.log(error);
                    }else{
                        var $ = res.$;
                        var object = {
                            "kind":categroyTmp, 
                             "categories":[],
                             "page": requestPage,
                             "validNum":0           
                        }
                        // $ is Cheerio by default
                        //a lean implementation of core jQuery designed specifically for the server
                        if($('.product-item').length > 0){
                            $('.product-item').each(function(index,each){
                                let item = $(each).find('.product-title').text();
                                if(item.trim()!=''){
                                    let title = $(each).find('.product-title').text();
                                    let price = $(each).find('.money').text();
                                    let imageUrl = $(each).find('.product-image').find('a').first().children().first().attr('src');
                                    let isSoldOut = $(each).find('.product-label').children().first().text() != ""
                                    // if($(each).find('.product-label').children().first().text() == ""){
                                    //     console.log("还有货")
                                    // }else{
                                    //       console.log("售罄")
                                    // }
                                    object.validNum++
                                    jsonData.group.push({
                                        "title":title,
                                        "price":price,
                                        "imageUrl":"http:"+imageUrl,
                                        "isSoldOut":isSoldOut,
                                        "isExist":false,
                                        "kind":categroyTmp,
                                        "createdAt":moment().format()
                                    })                                    
                                }
                            })
                        }
                    }
                    if(++count == categroy.length*(page-1)){
                        Jewelry.count({},function(err,count){
                            if(count == 0){
                                console.log("init data")
                                 let docs = jsonData.group
                                Jewelry.collection.insert(docs, onInsert);
                                function onInsert(err, docs) {
                                    if (err) {
                                        // TODO: handle error
                                        console.info("err",err)
                                    } else {
                                        console.info('%d potatoes were successfully stored.', count);
                                    }
                                }
                            }
                            else{
                                console.log("add new data")
                                 Jewelry.find({}, function(err, lists) {
                                    let cat = jsonData.group
                                    lists.map(item =>{
                                    for (let i = 0 ; i < cat.length ; i++){
                                      if(item.title == cat[i].title && item.isSoldOut != cat[i].isSoldOut ){
                                        Jewelry.findOneAndUpdate({title:cat[i].title}, { $set: { isSoldOut:cat[i].isSoldOut,  "createdAt":moment().format() }},function(err,res){
                                          console.log(item._id.$oid)
                                          console.log(err)

                                        })
                                      }
                                    }
                                  })
                        })
                            }
                        })
                       
                        
                        // console.log("all down")
                        //     Jewelry.collection.drop()
                        //       var docs = jsonData.group
                        //         Jewelry.collection.insert(docs, onInsert);
                        //         function onInsert(err, docs) {
                        //             if (err) {
                        //                 // TODO: handle error
                        //                 console.info("err",err)
                        //             } else {
                        //                 console.info('%d potatoes were successfully stored.', count);
                        //             }
                        //         }
                    }
                    done();
                }
            }]);
            }
        
    }

}
module.exports.fetchDataFromWebSit = queneFetch
// c.queue('https://segmentfault.com');
// https://segmentfault.com/q/1010000000595998
