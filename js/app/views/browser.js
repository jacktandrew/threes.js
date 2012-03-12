$(document).ready(function() {
  tournement = new Tournement();
  game = new Game();
  test = new Test();
  allPlayers = $.jStorage.get("allPlayersKey", [ {username: "Username1", password: "Password", purse: 50}, {username: "Username2", password: "Password", purse: 50} ] );
});

function verifyUser(e) {
  moniker = $( e + ' .uname').attr('value');
  password = $( e + ' .pword').attr('value');
  password2 = $( e + ' .pword2').attr('value');
  
  if($(e + ' .newuser').attr('checked') === "checked") {
    tournement.verifyNewUser(moniker, password, password2);
  } else {
    tournement.verifyExistingUser(moniker, password);
  }
}

function startGame(){
  verifyUser('#p1')
  verifyUser('#p2')
  if(game.playerArray.length >= 2) {
    $('#start').hide()
    $('#end_turn').show()
    $('#roll').removeClass('unavailable')
    $('#outer form, #outer h1, #outer h3').hide()
    $('#left_col').removeClass('red').addClass('green')
    $('#left_col .purse').html(game.playerArray[0].purse)
    $('#right_col .purse').html(game.playerArray[1].purse)
    $('#left_col h4').html(game.playerArray[0].username)
    $('#right_col h4').html(game.playerArray[1].username)
  } else {
    // console.log('one or more users was not verified')
    alert('You entered bogus information, not cool dude, not cool...')
  }
}

$('#start').live('click', function() {
  startGame()
});

$('#roll').live('click', function() {
  $(this).hide();
  $('#fold').show()
  theRoll = game.roll();
  html = intToHTML(theRoll);
  $('#inner').html(html);
});

function intToHTML(arr) {
  var html = ""
  arr.forEach( function(x) {
    if(x === 1) {
      html += '<div class="die" rel="1"><div></div></div>'
    } else if(x === 2) {
      html += '<div class="die" rel="2"><div></div><div></div></div>'
    } else if(x === 3) {
      html += '<div class="die" rel="3"><div></div><div></div><div></div></div>'
    } else if(x === 4) {
      html += '<div class="die" rel="4"><div></div><div></div><div></div><div></div></div>'
    } else if(x === 5) {
      html += '<div class="die" rel="5"><div></div><div></div><div></div><div></div><div></div></div>'
    } else if(x === 6) {
      html += '<div class="die" rel="6"><div></div><div></div><div></div><div></div><div></div><div></div></div>'
    }
  })
  return html;
};

$('.die').live('click', function() {
  if($(this).hasClass('selected')) {
    $(this).removeClass('selected')
    game.unchoose( +$(this).attr('rel') )
    $('.green .score').html(player.score)
  } else {
    $(this).addClass('selected')
    game.choose( +$(this).attr('rel') )
    $('.green .score').html(player.score)
  }
  isAbleToEnd();
});

function toggleCoins() {
  $('.green .cash_box a').each(function() {
    coin = +$(this).html()
    purse = +$('.green .purse').html()
    if(coin > purse || typeof(tempKeepers) === undefined) {
      $(this).addClass('unavailable')
    }
    if(coin < purse) {
      $(this).removeClass('unavailable')
    }
  });
};

// bet up
$('.green .cash_box a').live('click', function() {
  game.betUp( +$(this).html() )
  $('.green .purse').html(player.purse)
  $('.green .bet').html(player.bet)
  isAbleToEnd()
  if(player.purse < 10) {
    toggleCoins();
  }
});

function isAbleToEnd() {
  if(game.ableToEnd === true) {
    $('#end_turn').removeClass('unavailable');
  } else {
    $('#end_turn').addClass('unavailable')
  }
}

// reset bet
$('.purse').live('click', function() {  
  game.resetBet();
  $('.green .purse').html(player.purse)
  $('.green .bet').html(player.bet)
  toggleCoins();
});

function switchWhoIsActive() {
  if(game.playerArray[0].active === true) {
    $('#left_col').removeClass('red').addClass('green')
    $('#right_col').removeClass('green').addClass('red')
  } else if(game.playerArray[1].active === true) {
    $('#right_col').removeClass('red').addClass('green')
    $('#left_col').removeClass('green').addClass('red')
  }
}

$('#end_turn').live('click', function() {
  if (typeof(tempKeepers) !== "undefined") {
    html = intToHTML(tempKeepers)
    $('.green .keepers').append(html)
    $('#inner').html('')
  }
  
  game.endTurn()
  if (game.isGameOver() === true) { 
    winning() 
  } else {
    if(player.remaining === 0) { 
      $('#roll').addClass('unavailable') 
    } else { 
      $('#roll').removeClass('unavailable') 
    }
    $('#fold').hide()
    $('#roll').show()
    $('#end_turn').addClass('unavailable')
    switchWhoIsActive()
    isAbleToEnd()
  }
});

$('#fold').live('click', function() {
  console.log('fold click')
  game.fold()
  winning()
  $('#inner').html('')
});

function clearOldHTML() {
  $('.green .bet, .red .bet, .green .score, .red .score').html('0')
  $('#outer h1, #outer h3 span, #left_col .keepers, #right_col .keepers').html('')
  $('#outer h1, #outer h3, #new_game, #reset_scores').hide()
  $('#left_col .purse').html(game.playerArray[0].purse)
  $('#right_col .purse').html(game.playerArray[1].purse)
  $('#roll').show().removeClass('unavailable')
  $('#end_turn').show().addClass('unavailable')
  // $('#new_game').html('Roll').removeClass('new_game').addClass('roll')
}

function winning() {
  $('#roll, #fold, #end_turn').hide()
  $('#new_game, #reset_scores').show()

  $('#left_col .purse').html(game.playerArray[0].purse)
  $('#right_col .purse').html(game.playerArray[1].purse)
  if (game.isThereALeader() === false) {
    $('#outer h2, #outer h5').show()
  } else {
    $('#outer h1, #outer h3').show()
    var winner = game.isThereALeader()
    $('#outer h1').html(winner.username + ' Won')
    $('#outer h3 span').html(tournement.winnings - winner.bet)
  }
};

function newGame() {
  tournement.refresh()
  clearOldHTML();
  switchWhoIsActive()
}

$('#new_game').live('click', function() {
  newGame();
});
  
$('#reset_scores').live('click', function() {
  tournement.resetScores()
  newGame();
});