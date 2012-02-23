game = new Game(true);
gamemodel = new GameModel(true);

$('.roll').live('click', function(){
  $(this).addClass('unavailable');
  theRoll = game.roll();
  html = ""
  for (i = 0; i < theRoll.length; i++) {
    var x = theRoll[i]
    if(x === 1){
      html += '<div class="die" rel="1">1<div></div></div>'
    } else if(x === 2){
      html += '<div class="die" rel="2">2<div></div><div></div></div>'
    } else if(x === 3){
      html += '<div class="die" rel="3">0<div></div><div></div><div></div></div>'
    } else if(x === 4){
      html += '<div class="die" rel="4">4<div></div><div></div><div></div><div></div></div>'
    } else if(x === 5){
      html += '<div class="die" rel="5">5<div></div><div></div><div></div><div></div><div></div></div>'
    } else if(x === 6){
      html += '<div class="die" rel="6">6<div></div><div></div><div></div><div></div><div></div><div></div></div>'
    }
  }
  $('#inner').html(html);
});

$('.die').live('click', function(){
  if($(this).hasClass('selected')){
    $(this).removeClass('selected')
    game.unchoose(parseInt( $(this).html() ))
    // if you unselect your only dice, ending your turn is no longer an option
    if($('.selected').length === 0){
      $('.end_turn').addClass('unavailable')
    }
  } else {
    $(this).addClass('selected')
    game.choose(parseInt( $(this).html() ))
    $('.end_turn').removeClass('unavailable')
  }
});

$('.end_turn').click(function(){
  $(this).addClass('unavailable')
});