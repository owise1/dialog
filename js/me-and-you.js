$(function(){
  //clippy.load('Merlin', function(agent) {
    //agent.show();
    //function music(){
      //agent.speak("Oh!");
      //agent.speak("What's that?!") ;
      //agent.play("StartListening");
      //agent.speak("That must be our community radio station, courtesy of ~maze");
      //agent.play("StartListening");
      //var radio = document.createElement('iframe');
      //radio.src = '/~maze/radio.html';
      //radio.height = 0;
      //radio.width = 0;
      //document.getElementsByTagName('body')[0].appendChild(radio);
    //}

    //agent.speak("Hi");
  //});
  var allClicks = $('div').asEventStream('click');
  var codeStream = $('#you').asEventStream('keyup')
                      .map(R.prop('keyCode'))

  var returns = codeStream.filter(R.eq(13));
  var convo= new (function(){
    this.say = function(who, what){
      $('#us').append($('<li>').addClass(who).text(what));
    }
  })();
  convo.say('me', "How's it going?");

  var text = $('#you')
    .asEventStream('keydown')
    .debounce(300)
    .map(R.path('target.value'))
    .skipDuplicates();

  var clickLocations = allClicks.map(function(ev){
    return { x : ev.pageX, y : ev.pageY };
  })

  var clickIDs = allClicks.map(function(ev){
    console.log($(ev.target).css('background'));
  });
  
  returns.onValue(function(){
    var $you = $('#you');
    if($you.val() === '') return;
    if($you.is('.me')){
      $you.removeClass('me');
      convo.say('me', $you.val());
    } else {
      convo.say('you', $you.val());
      $you.addClass('me');
    }
    $you.val('');
  });

  var you = returns;
  you.onValue(function(a){
    console.log(a);
  });


  
  $('#you').focus();

});
