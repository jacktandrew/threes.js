game = new Game(true);



$('.roll').live('click', function(){
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
    console.log('.die click UNchoose')
    game.unchoose(parseInt($(this).html()));
  } else {
    $(this).addClass('selected')
    console.log('.die click choose')
    game.choose(parseInt($(this).html()));
  }
});