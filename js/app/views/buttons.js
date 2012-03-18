// start the game
$('#start').live('click', function() {
  startGame()
});

// roll the dice
$('#roll').live('click', function() {
  rollAction();
});

// select or unselect a die
$('.die').live('click', function() {
  selectOrUnselect( $(this) );
  ableToEnd();
});

// fold
$('#fold').live('click', function() {
  $('#fold').hide()
  $('#sure_fold').show()
});
  
$('#sure_fold').live('click', function() {
    game.fold()
    game.isGameOver()
    tournement.endGame()
    winning()
});

// new game
$('#new_game').live('click', function() {
  newGame();
});

// reset scores
$('#reset_scores').live('click', function() {
  tournement.resetScores()
  newGame();
});

// bet up
$('.green .cash_box a').live('click', function() {
  game.betUp( +$(this).html() )
  displayBet()
  ableToEnd()
});

// reset bet
$('.purse').live('click', function() {  
  game.resetBet();
  $('.green .purse').html(player.purse)
  $('.green .bet').html(player.bet)
  toggleCoins();
});

// end turn
$('#end_turn').live('click', function() {
  moveKeepers()
  game.endTurn()
  actionEndTurn()
});