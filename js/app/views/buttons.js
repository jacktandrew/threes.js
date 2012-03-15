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
  console.log( $(this) )
  selectOrUnselect( $(this) );
  isAbleToEnd();
});

// fold
$('#fold').live('click', function() {
  reallyFold = confirm('Are you sure you want to fold?')
  if (reallyFold) {
    game.fold()
    game.isGameOver()
    tournement.endGame()
    winning()
    $('#inner').html('')
  }
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
  game.isAbleToEnd()
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