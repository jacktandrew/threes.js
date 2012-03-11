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

$('#start').live('click', function() {
  verifyUser('#p1')
  verifyUser('#p2')
  if(game.playerArray.length >= 2) {
    // console.log('both users were verified!')
    $('#start').hide()
    $('#end_turn').show()
    $('#roll').removeClass('unavailable')
    
    $('#outer form, #outer h1, #outer h3').hide()
    $('#left_col').removeClass('red').addClass('green')
    $('#left_col .purse').html(game.playerArray[0].purse)
    $('#right_col .purse').html(game.playerArray[1].purse)
    $('#left_col h4').html(game.playerArray[0].moniker)
    $('#right_col h4').html(game.playerArray[1].moniker)
  } else {
    // console.log('one or more users was not verified')
    alert('You entered bogus information, not cool dude, not cool...')
  }
});

$('#roll').live('click', function() {
  $(this).hide();
  $('#fold').show()
  theRoll = game.roll();
  html = intToHTML(theRoll);
  $('#inner').html(html);
});

function intToHTML(array) {
  html = ""
  for (i = 0; i < array.length; i++) {
    var x = array[i]
    if(x === 1) {
      html += '<div class="die" rel="1">1<div></div></div>'
    } else if(x === 2) {
      html += '<div class="die" rel="2">2<div></div><div></div></div>'
    } else if(x === 3 || x === 0) {
      html += '<div class="die" rel="3">0<div></div><div></div><div></div></div>'
    } else if(x === 4) {
      html += '<div class="die" rel="4">4<div></div><div></div><div></div><div></div></div>'
    } else if(x === 5) {
      html += '<div class="die" rel="5">5<div></div><div></div><div></div><div></div><div></div></div>'
    } else if(x === 6) {
      html += '<div class="die" rel="6">6<div></div><div></div><div></div><div></div><div></div><div></div></div>'
    }
  }
  return html;
};

$('.die').live('click', function() {
  if($(this).hasClass('selected')) {
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

function toggleCoins() {
  $('.green .cash_box a').each(function() {
    coin = parseInt($(this).html())
    purse = parseInt($('.green .purse').html())      
    if(coin > purse) {
      $(this).addClass('unavailable')
    }
    if(coin < purse) {
      $(this).removeClass('unavailable')
    }
  });
};

// bet up
$('.green .cash_box a').live('click', function() {
  game.betUp( parseInt($(this).html()) )
  $('.green .purse').html(player.getPurse())
  $('.green .bet').html(player.getBet())
  isAbleToEnd()
  if(player.getPurse() < 10) {
    toggleCoins();
  }
});

function isAbleToEnd() {
  if(game.ableToEnd() === true) {
    $('#end_turn').removeClass('unavailable');
    return true
  } else {
    $('#end_turn').addClass('unavailable')
    return false
  }
}

// reset bet
$('.purse').live('click', function() {  
  game.resetBet();
  $('.green .purse').html(player.getPurse())
  $('.green .bet').html(player.getBet())
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
  game.endTurn()
  html = intToHTML(game.tempKeepers)
  $('.green .keepers').append(html)
  $('#inner').html('')
  if (game.isTheGameOver === true) { 
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
    game.clearKeepers()
  }
});

$('#fold').live('click', function() {
  console.log('fold click')
  game.fold()
  winning()
  $('#inner').html('')
});

function clearOldHTML() {
  $('#outer h1, #outer h3 span, #left_col .keepers, #right_col .keepers').html('')
  $('#outer h1, #outer h3, #reset_scores').hide()
  $('end_turn unavailable').show()
  game.playerArray.sort(game.orderByIndex)
  $('#left_col .purse').html(game.playerArray[0].getPurse())
  $('#right_col .purse').html(game.playerArray[1].getPurse())
  // $('#new_game').html('Roll').removeClass('new_game').addClass('roll')
}

function winning() {
  $('#roll, #fold, #end_turn').hide()
  $('#new_game, #reset_scores').show()
  $('.green .bet, .red .bet, .green .score, .red .score').html('0')
  game.playerArray.sort(game.orderByIndex)
  $('#left_col .purse').html(game.playerArray[0].getPurse())
  $('#right_col .purse').html(game.playerArray[1].getPurse())
  if (game.isATie() === true) {
    $('#outer h2, #outer h5').show()
  } else {
    $('#outer h1, #outer h3').show()
    var winner = game.playerArray.sort(game.orderByProj)[0]
    $('#outer h1').html(winner.moniker + ' Won')
    $('#outer h3 span').html(tournement.winnings - winner.bet)
  }
};

$('#new_game').live('click', function() {
  $(this).hide()
  for (i = 0; i < game.playerArray.length; i++) {
    tournement.refresh(game.playerArray[i])
    console.log('player being refreshed  = ' + game.playerArray[i].moniker)
  }
  clearOldHTML();
  $('#roll').show().removeClass('unavailable')
  $('#end_turn').show().removeClass('unavailable')
  switchWhoIsActive()
});
  
$('#reset_scores').live('click', function() {
  for (i = 0; i < game.playerArray.length; i++) {
    tournement.resetScores(game.playerArray[i].moniker)
    tournement.refresh(game.playerArray[i])
  }
  clearOldHTML();
});