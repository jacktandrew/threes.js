$(document).ready(function(){
  tournement = new Tournement();
  test = new Test();
  allPlayers = $.jStorage.get("allPlayersKey");
});

function verifyUser(e){
  console.log('a user is being verified')
  name = $( e + ' .uname').attr('value');
  password = $( e + ' .pword').attr('value');
  password2 = $( e + ' .pword2').attr('value');
  
  if($(e + ' .newuser').attr('checked') === "checked"){
    console.log('the newuser box was checked')
    tournement.verifyNewUser(name, password, password2);
  } else {
    console.log('the box was unchecked, this is an existing user')
    tournement.verifyExistingUser(name, password);
  }
}

$('.start').live('click', function(){  
  
  verifyUser('#p1')
  verifyUser('#p2')
  tournement.setupGame();
  if(playerArray.length >= 2){
    console.log('both users were verified!')
    $(this).html('End Turn').removeClass('start').addClass('end_turn unavailable')
    $('.roll').removeClass('unavailable')
    $('#outer form, #outer h1, #outer h3').hide()
    $('#left_col').removeClass('red').addClass('green')
    $('#left_col .purse').html(playerArray[0].purse)
    $('#right_col .purse').html(playerArray[1].purse)
    $('#left_col h4').html(playerArray[0].name)
    $('#right_col h4').html(playerArray[1].name)
  } else {
    console.log('one or more users was not verified')
    alert('You entered bogus information, not cool dude, not cool...')
  }
  
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
    var idx = game.tempKeepers.indexOf(parseInt( $(this).html() )); // Find the index
    if(idx!=-1) game.tempKeepers.splice(idx, 1); // Remove it if really found!
    game.adjustScore(-parseInt( $(this).html() ))
    $('.green .score').html(player.getScore())
  } else {
    $(this).addClass('selected')
    game.tempKeepers.push(parseInt( $(this).html() ))
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
  if(playerArray[0].active === true){
    $('#left_col').removeClass('red').addClass('green')
    $('#right_col').removeClass('green').addClass('red')
  } else if(playerArray[1].active === true){
    $('#right_col').removeClass('red').addClass('green')
    $('#left_col').removeClass('green').addClass('red')
  }
}

$('.end_turn').live('click', function(){
  game.finalizeChoices(game.tempKeepers)
  html = intToHTML(game.tempKeepers);  
  $('.green .keepers').append(html)
  
  game.nextPlayer();
  switchWhoIsActive();
  
  $('.end_turn').addClass('unavailable')
  
  $('#inner').html('')
  $('.roll').removeClass('unavailable')
});

function winning(){
  $('.green .bet, .red .bet, .green .score, .red .score').html('0')
  $('#left_col .purse').html(playerArray[0].getPurse())
  $('#right_col .purse').html(playerArray[1].getPurse())
  
  $('#outer h1, #outer h3, #new_game').show()
  $('#outer h1').prepend(test.sortArray[0].name)
  $('#outer h3 span').append(game.winnings - test.sortArray[0].bet)
  
  $('.roll').html('New Game').removeClass('roll unavailable').addClass('new_game')
  $('.end_turn').html('Reset Scores').removeClass('end_turn unavailable').addClass('reset_scores')
    
  $('.new_game').click(function(){
     window.location.reload()
  });
  
  $('.reset_scores').click(function(){
    tournement.resetScores()
    window.location.reload();
  });
  
};
