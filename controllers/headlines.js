var scrape = require ('../scripts/scrape');
var makeDate = require ("../scripts/date");

// bring in the headline and note mongoose models
var article = require ("../models/article");

module.exports = {
  fetch: function (cb){
      scrape (function (data){
          var articles = data;
          for (var i = 0; i < article.length; i++){
              articles[i].date = makeDate();
              articles[i].saved = false;

          }
          article.collection.insertMany(article, {ordered:false}, function (err, docs){
            cb(err, docs);
          });
      });
  },
    delete: function (query, cb){
      article.remove(query, cb);
    },
    get: function (query, cb){
        article.find(query)
        .sort({
            _id: -1
        })
        .exec(function (err, doc){
            cb(doc);
        });
    },
    update: function (query, cb){
        article.update({_id: query._id}, {
            $set:query          
        }, {}, cb);
    } 
}