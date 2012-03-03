var test = Class.extend({
  init: function(){
    this.sortArray = []
  },
  
  roll: function(){
    var theRoll = game.roll();
  },
    
  select: function(){
    anySelected = false
    for(i = 0; i < theRoll.length; i++){
      if (theRoll[i] === 1 || theRoll[i] === 3){
        anySelected = true
        game.tempKeepers.push(theRoll[i])
        if (theRoll[i] === 1){
          game.adjustScore(theRoll[i])
        }
      }  
    }

    if (anySelected === false){
      theRoll.sort()
      game.tempKeepers.push(theRoll[0])
      game.adjustScore(theRoll[0])
    }

    player.keepers.concat(game.tempKeepers)
    $('.green .score').html(player.getScore())
    $('.green .keepers').append(intToHTML(game.tempKeepers))
  },
  
  bet: function(){
    var bet = 0;
    var leader = test.sortArray[0];
    var call = game.highBet - player.bet
    
    if(player != leader){
      var diff = leader.projection - player.projection;
    } else {
      var diff = test.sortArray[1].projection - leader.projection;
    }
    
    if (diff >= 2) {
      bet = call + 5
    } else if (0 <= diff && diff < 2) {
      bet = call + 1
    } else if (-4 <= diff && diff < 0) {
      bet = call
    } else if (diff < -4 && game.highBet === 0) {
      bet = 0
    } else if (diff < -4 && game.highBet > 0) {
      game.fold()
    }
    
    game.betUp(bet)
    $('.green .bet').html(player.getBet())
    $('.green .purse').html(player.getPurse())
    $('#test_results table').append('<tr><td>' + player.name + '</td><td>' + theRoll + '</td><td>' + game.tempKeepers + '</td><td>' + player.keepers + '</td><td>' + player.score + '</td><td>' + bet + '</td><td>' + player.bet  + '</td><td>' + player.projection + '</td></tr>')
  },
    
  play: function(boo){
    if(boo == 'auto'){
      while(game.isTheGameOver() === false){
        takeTurn();
      }
    } else {
      takeTurn();
    }
    
    function takeTurn(){
      if(game.isTheGameOver() === true){
        // $('#test_results table').append('<tr><td  colspan="8"></td></tr>')
        $('#test_results table').append('<tr><td colspan="8">THE GAME IS OVER</td></tr>')
        return false
      }
      test.roll()
      test.select()
      game.finalizeChoices(game.tempKeepers);
      game.findLeader()
      test.bet()  
      game.finalizeBet()
      game.ableToEnd()

      if(game.isTheGameOver() === true){
        test.finishRound()
      } else {
        game.nextPlayer()
      }
      switchWhoIsActive()
    }
  },
  
  finishRound: function(){
    
    game.findLeader()
    game.transferWinnings()
    winning();
  }  
});