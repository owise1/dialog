$(function(){

  var convo = new (function(){
    var db = "https://owise1.cloudant.com/convo";
    var doc = {
      convo : []
    };
    var isMe = true; // I speak first 

    this.whoSay= function(who, what){
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

      // save the convo
      doc.convo.push(what);
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
        console.log(res);
      });
    }
  })();

  var allClicks = $('div').asEventStream('click');
  var codeStream = $('#you').asEventStream('keyup')
                      .map(R.prop('keyCode'))

  var returns = codeStream.filter(R.eq(13));

  convo.say("How's it going?");

  var text = $('#you')
    .asEventStream('keydown')
    .debounce(300)
    .map(R.path('target.value'))
    .skipDuplicates();

  returns.onValue(function(){
    convo.say($('#you').val());
    $('#you').val('');
  });

  var you = returns;
  you.onValue(function(a){
    console.log(a);
  });


  
  $('#you').focus();

});
