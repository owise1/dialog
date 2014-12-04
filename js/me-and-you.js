$(function(){

  var convo = new (function(){
    var that = this;
    var db   = "https://owise1.cloudant.com/convo";
    var doc, possibs, isMe;

    function reset(){
      doc  = {
        convo : []
      };
      possibs = [];
      isMe = true; // I speak first 
      $('#us').html('');
    }
    reset();

    this.whoSay = function(who, what){
      $('#us').append($('<li>').addClass(who).text(what));
    }

    this.fetchQuestion = function(){
      $.ajax({
        url : db + "/_design/convo/_view/questionsByTime",
        data : {
          descending : true,
          limit : 1
        },
        dataType : 'json'
      })
      .done(function(res){
        if(res.rows[0]){
          window.location.hash = res.rows[0].value;
        }
      });
    }

    var _loading = false;
    this.load = function(initialLoad){
      initialLoad = initialLoad === true;
      var id = window.location.hash.replace('#', '');
      if(id === '') return initialLoad ? this.fetchQuestion() : reset();
      _loading = true;
      doc.convo = [];
      $.ajax({
        url : db + '/' + id,
        dataType : 'json',
      })
      .done(function(res){
        reset();
        res.convo.forEach(that.say.bind(that));
        _loading = false;
      })
      .fail(function(){
        if(initialLoad) return this.fetchQuestion();
        window.location.hash = '';
      });
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

      if(_loading) return;

      // is there an answer?
      if(possibs.length > 0){
        var answer = possibs[0];
        possibs = [];
        return this.say(answer); // we'll save on the next go round
      }

      // save the convo
      if(doc.convo.length < 2) return;
      doc.time = Date.now();
      var ajaxOpts = {
        data : JSON.stringify(doc),
        dataType : 'json',
        contentType: "application/json",
        xhrFields: {
          withCredentials:true
        }
      }
      ajaxOpts.url  = db;
      ajaxOpts.type = 'post';

      $.ajax(ajaxOpts)
      .done(function(res){
        if(res.ok){
          $('#us li:last').append(" <a href='#"+res.id+"'>>></a>");
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
  var hashChanges = $(window).asEventStream('hashchange');
  var returns = codeStream.filter(R.eq(13));
  var spaces  = codeStream.filter(R.eq(32));


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

  hashChanges.onValue(convo.load);

  convo.load(true);

  //var you = codeStream;
  //you.onValue(function(a){
    //console.log(a);
  //});


  
  $('#you').focus();

});
