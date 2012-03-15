var AI = Class.extend({
  init: function() {
  },
  
  choose: function() {
    var die = 0;
    var anySelected = false;
    
    theRoll.forEach(function(die) {
      if (die === 1 || die === 3) {
        anySelected = true
        tempKeepers.push(die)
      }
    })

    if (anySelected === false) {
      die = theRoll[0]
      theRoll.sort()
      tempKeepers.push(die)
    }
    selectOrUnselect( intToHTML(tempKeepers) )
    return tempKeepers    
  },

  selectBet: function() {
    var aiBet = 0;
    var call = game.highBet - player.bet;
    var leader = game.isThereALeader();
    var secondPlace = game.projArr[1];
    
    if (leader === false) {         // there is a tie
      return aiBet = call + 1       // call and raise one
    } else {                        // otherwise 
      if (player === leader) {      // find out who is the leader
        var diff = secondPlace.projection - leader.projection;
        console.log('ai is the leader')
      } else {
        var diff = leader.projection - player.projection;       // and what is the lead
        console.log('ai is behind')
      }

      if (diff >= 2) {
        return aiBet = call + 5
      } else if (0 <= diff && diff < 2) {
        return aiBet = call + 1
      } else if (-4 <= diff && diff < 0) {
        return aiBet = call
      } else if (diff < -4 && call <= 0) {
        return aiBet = 0
      } else if (diff < -4) {
        if (player.remaining <= 1 && call < 5) {
          return aiBet = call
        } else {
          return game.fold()
        }
      }
    } 
  },

  play: function() {
    rollAction()
    ai.choose()
    moveKeepers()
    game.finalizeChoices()
    tempKeepers = undefined
    aiBet = ai.selectBet()
    if (aiBet > player.purse) { aiBet = player.purse }
    game.betUp(aiBet)
    displayBet()
    game.ableToEnd = true;
    player.active = false;
    game.endTurn()
    actionEndTurn()
  }
});