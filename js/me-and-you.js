$(function(){

  var convo = new (function(){
    var db = "https://owise1.cloudant.com/convo";
    var doc = {
      convo : []
    };
    var possibs = [];
    var isMe = true; // I speak first 

    this.whoSay = function(who, what){
      $('#us').append($('<li>').addClass(who).text(what));
    }

    this.say = function(what){
      if(what === '') return;
      if(isMe){
        this.whoSay('me', what);
      } else {
        this.whoSay('you', what);
      }
      isMe = !isMe;

      doc.convo.push(what);

      // is there an answer?
      if(possibs.length > 0){
        var answer = possibs[0];
        possibs = [];
        return this.say(answer); // we'll save on the next go round
      }

      // save the convo
      if(doc.convo.length < 2) return;
      var ajaxOpts = {
        data : JSON.stringify(doc),
        dataType : 'json',
        contentType: "application/json",
        xhrFields: {
          withCredentials:true
        }
      }
      if(doc._id){
        ajaxOpts.url  = db + '/' + doc._id;
        ajaxOpts.type = 'put';
      } else {
        ajaxOpts.url  = db;
        ajaxOpts.type = 'post';
      }
      $.ajax(ajaxOpts)
      .done(function(res){
        if(res.ok){
          doc._id  = res.id;
          doc._rev = res.rev;
        }
      });

    }

    this.fetchPossibleAnswers = function(words){
      var startKey = words.toLowerCase().trim().split(" ");
      var endKey   = words.toLowerCase().trim().split(" ");
      endKey.push({});
      var data = { startkey :  JSON.stringify(startKey), endkey : JSON.stringify(endKey), limit : 5 };
      $.ajax({
        url : db + '/_design/convo/_view/byWord',
        data : data,
        dataType : 'json'
      })
      .done(function(res){
        possibs = res.rows.map(R.prop('value'));
      });
    }
  })();

  var allClicks  = $('div').asEventStream('click');
  var codeStream = $('#you').asEventStream('keyup')
                      .map(R.prop('keyCode'))
  var returns = codeStream.filter(R.eq(13));
  var spaces  = codeStream.filter(R.eq(32));

  convo.say("How's it going?");

  var text = $('#you')
    .asEventStream('keydown')
    .debounce(300)
    .map(R.path('target.value'))
    .skipDuplicates();

  spaces.onValue(function(){
    convo.fetchPossibleAnswers($('#you').val());
  });

  returns.onValue(function(){
    convo.say($('#you').val());
    $('#you').val('');
  });

  //var you = codeStream;
  //you.onValue(function(a){
    //console.log(a);
  //});


  
  $('#you').focus();

});
