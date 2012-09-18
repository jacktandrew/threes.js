var AI = Class.extend({
  init: function() {},
  
  selectDice: function() {
    var die = 0;
    var anySelected = false;
    console.log(activePlayer.username + ' rolled [' + theRoll + ']')
    theRoll.forEach(function(die) {
      if (die === 1 || die === 3) {
        anySelected = true
        window.setTimeout(function(){
          $('#inner div._' + die).addClass('selected').css({'background':'yellow'})
          tournement.game.choose(die)
        }, 500);
      }
    });

    if (anySelected === false) {
      theRoll.sort()
      die = theRoll[0]
      $('#inner div._' + die + ':first-child').addClass('selected').css({'background':'yellow'})
      window.setTimeout(function(){
        tournement.game.choose(die)
      }, 500);
    }
    return tempKeepers    
  },

  selectBet: function() {
    var aiBet = 0;
    var call = tournement.game.highBet - activePlayer.bet;
    var leader = tournement.game.isThereALeader();
    var secondPlace = tournement.game.projArr[1];
    
    console.log('call = ' + call)
    if (leader === false) {         // there is a tie
      return aiBet = call + 1       // call and raise one
    } else {                        // otherwise 
      if (activePlayer === leader) {      // find out who is the leader
        var diff = secondPlace.projection - leader.projection;
        // console.log(activePlayer.username + ' is the leader')
      } else {
        var diff = leader.projection - activePlayer.projection;       // and what is the lead
        // console.log(activePlayer.username + ' is behind')
      }
      console.log('diff = ' + diff)
      if (diff > 0) {
        return aiBet = call + Math.ceil(diff * 2)
      } else if (-3 <= diff && diff <= 0) {
        console.log('-3 < diff && diff <= 0')
        return aiBet = call
      } else if (call < 3) {
        console.log('call = ' + call)
        return aiBet = call
      } else {
        console.log('folding')
        console.log(tournement.game.playerArray)
        return false 
      }
    }
  },
  
  play: function() {
    gameView.rollAction();
    window.setTimeout(function() {
      tournement.ai.selectDice();
    }, 500);
    window.setTimeout(function() {
      tournement.ai.wrapUp();
    }, 3000);
  },

  wrapUp: function() {
    gameView.moveKeepers()
    tournement.game.finalizeChoices()
    console.log('this turn it kept [' + tempKeepers + '] >>> giving it a total of [' + allKeepers + ']')
    tempKeepers = undefined
    var theBet = tournement.ai.selectBet();
    if (theBet === false) {
      console.log('theBet = ' + theBet)
      tournement.game.fold()
      tournement.endGame()
      gameView.winning()
    } else {
      console.log('this turn it bet (' + theBet + ') >>> bringing the total bet to (' + (activePlayer.bet + theBet) + ')')
      if (theBet > activePlayer.purse) { theBet = activePlayer.purse }
      tournement.game.betUp(theBet)
      gameView.displayBet()
      tournement.game.ableToEnd = true;
      activePlayer.active = false;
      tournement.game.endTurn()
      gameView.actionEndTurn()  
    }
  }
});
