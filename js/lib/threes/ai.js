var AI = Class.extend({
  init: function() {
  },
  
  choose: function() {
    var die = 0;
    var anySelected = false;
    console.log(activePlayer.username + ' rolled [' + theRoll + ']')
    theRoll.forEach(function(die) {
      if (die === 1 || die === 3) {
        anySelected = true
        game.choose(die)
      }
    })

    if (anySelected === false) {
      theRoll.sort()
      die = theRoll[0]
      game.choose(die)
    }
    return tempKeepers    
  },

  selectBet: function() {
    var aiBet = 0;
    var call = game.highBet - activePlayer.bet;
    var leader = game.isThereALeader();
    var secondPlace = game.projArr[1];
    
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
      if (diff > 0) { return aiBet = call + Math.ceil(diff * 2) } 
      else if (-2 < diff && diff <= 0) { 
        console.log('-2 < diff && diff <= 0')
        return aiBet = call 
      } else if (call < 3) {
        console.log('call < 3')
        return aiBet = call
      } else { 
        console.log(game.playerArray)
        return false 
      }
    }
  },

  play: function() {
    rollAction()
    ai.choose()
    moveKeepers()
    game.finalizeChoices()
    console.log('this turn it kept [' + tempKeepers + '] >>> giving it a total of [' + allKeepers + ']')
    tempKeepers = undefined
    if ( theBet = ai.selectBet() ) {
      console.log('this turn it bet (' + theBet + ') >>> bringing the total bet to (' + (activePlayer.bet + theBet) + ')')
      if (theBet > activePlayer.purse) { theBet = activePlayer.purse }
      game.betUp(theBet)
      displayBet()
      game.ableToEnd = true;
      activePlayer.active = false;
      game.endTurn()
      actionEndTurn()  
    } else { 
      console.log('theBet = ai.selectBet() was false somehow???')
      game.fold()
      tournement.endGame()
      winning()
    }
  }
});