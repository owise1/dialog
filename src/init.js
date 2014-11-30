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
      }
    }
  }
}, function () {
  console.dir(arguments);
});
