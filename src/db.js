var nano = require('nano');
var seed = require('couchdb-seed-design');

var db = nano('https://owise1.cloudant.com/convo');

seed(db, {
  convo: {
    views: {
      byWord : function(doc){
        if(doc.convo){
          doc.convo.forEach(function(line, i){
            if(doc.convo[i+1]){
              emit(line.toLowerCase().split(" "), doc.convo[i+1]);
            }
          });
        }
      },
      byLine : {
        map : function(doc){
          if(doc.convo){
            emit(doc.convo);
          }
        },
        reduce : "_count"
      },
      byTime : function(doc){
        if(doc.convo){
          emit(doc.time, doc._id);
        }
      },
      questionsByTime : function(doc){
        if(doc.convo && /\?$/.test(doc.convo[(doc.convo.length-1)])){
          emit(doc.time, doc._id);
        }
      }
    }
  }
}, function () {
  console.dir(arguments);
});
