var game = new Game();
var test = new test();
var player = left;
player.active = true;

$(document).ready(function(){
  $('#left_col .purse').html(left.purse);
  $('#right_col .purse').html(right.purse);
});

$('.roll').live('click', function(){
  $(this).addClass('unavailable');
  theRoll = game.roll();
  html = intToHTML(theRoll);
  $('#inner').html(html);
});

function intToHTML(array){
  html = ""
  for (i = 0; i < array.length; i++) {
    var x = array[i]
    if(x === 1){
      html += '<div class="die" rel="1">1<div></div></div>'
    } else if(x === 2){
      html += '<div class="die" rel="2">2<div></div><div></div></div>'
    } else if(x === 3 || x === 0){
      html += '<div class="die" rel="3">0<div></div><div></div><div></div></div>'
    } else if(x === 4){
      html += '<div class="die" rel="4">4<div></div><div></div><div></div><div></div></div>'
    } else if(x === 5){
      html += '<div class="die" rel="5">5<div></div><div></div><div></div><div></div><div></div></div>'
    } else if(x === 6){
      html += '<div class="die" rel="6">6<div></div><div></div><div></div><div></div><div></div><div></div></div>'
    }
  }
  return html;
};

$('.die').live('click', function(){
  if($(this).hasClass('selected')){
    $(this).removeClass('selected')
    var idx = tempKeepers.indexOf(parseInt( $(this).html() )); // Find the index
    if(idx!=-1) tempKeepers.splice(idx, 1); // Remove it if really found!
    game.adjustScore(-parseInt( $(this).html() ))
    $('.green .score').html(player.getScore())
  } else {
    $(this).addClass('selected')
    tempKeepers.push(parseInt( $(this).html() ))
    game.adjustScore(parseInt( $(this).html() ))
    $('.green .score').html(player.getScore())
  }
  isAbleToEnd();
});

function toggleCoins(){
  $('.green .cash_box a').each(function(){
    coin = parseInt($(this).html())
    purse = parseInt($('.green .purse').html())      
    if(coin > purse){
      $(this).addClass('unavailable')
    }
    if(coin < purse){
      $(this).removeClass('unavailable')
    }
  });
};

// bet up
$('.green .cash_box a').live('click', function(){
  game.betUp( parseInt($(this).html()) )
  $('.green .purse').html(player.getPurse())
  $('.green .bet').html(player.getBet())
  isAbleToEnd()
  if(player.getPurse() < 10){
    toggleCoins();
  }
});

function isAbleToEnd(){
  if(game.ableToEnd() === true){
    $('.end_turn').removeClass('unavailable');
  } else {
    $('.end_turn').addClass('unavailable')
  }
}

// reset bet
$('.purse').live('click', function(){  
  game.resetBet();
  $('.green .purse').html(player.getPurse())
  $('.green .bet').html(player.getBet())
  toggleCoins();
});


function switchWhoIsActive() {
  if(left.active === true){
    $('#left_col').removeClass('red').addClass('green')
    $('#right_col').removeClass('green').addClass('red')
//    console.log('left active')
  } else if(right.active === true){
    $('#right_col').removeClass('red').addClass('green')
    $('#left_col').removeClass('green').addClass('red')
//    console.log('right active')
  }
}


$('.end_turn').live('click', function(){
  game.endTurn(tempKeepers)
  html = intToHTML(tempKeepers);  
  $('.green .keepers').append(html)
  
  switchWhoIsActive();
  
  $(this).addClass('unavailable')
  $('#inner').html('')
  $('.roll').removeClass('unavailable')
  tempKeepers = []
});



function winning(winner, loser){
  $('#outer h1, #outer h3, #new_game').show()
  
  
  $('.roll').html('New Game').addClass('new_game').removeClass('roll')
  $('.end_turn').html('Reset Scores').removeClass('unavailable').addClass('reset_scores').removeClass('endTurn')
  
  $.jStorage.set()
  $.jStorage.set()
  
  $('.new_game').click(function(){
     window.location.reload();
  });
  
  $('.reset_scores').click(function(){
    game.resetScores();
    window.location.reload();
  });
};
