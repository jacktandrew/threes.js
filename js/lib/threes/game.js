var Game = Class.extend({
  init: function() {
    this.highBet = 0;
    this.playerArray = [];
    this.projArr = [];
    this.ableToEnd = false;
  },

  roll: function() {
    if(typeof(theRoll) === "undefined"){
      tempKeepers = []
      theRoll = [];
      for (i = 0; i < player.remaining; i++) {
        var randNum = Math.floor(Math.random()*6) + 1;
        theRoll.push(randNum)
      }
      return theRoll
    } else {
      return false
    }
  },
  
  choose: function() {
    for (k = 0; k < arguments.length; k++){
      die = arguments[k]
      idx = theRoll.indexOf(die)
      if ( idx !== -1 ) {
        theRoll.splice(idx, 1)
        tempKeepers.push(die)
        player.adjustScore(die)
      }
    }
    game.isAbleToEnd()
    return tempKeepers
  },
  
  unchoose: function() {
    for (k = 0; k < arguments.length; k++){
      die = arguments[k]
      idx = tempKeepers.indexOf(die)
      if ( idx === -1 ) {
        return false
      } else {
        tempKeepers.splice(idx, 1)
        theRoll.push(die)
        player.adjustScore(-die)
      }
    }
    game.isAbleToEnd()
    return tempKeepers
  },
  
  finalizeChoices: function() {
    allKeepers = player.getKeepers().concat(tempKeepers)
    player.setKeepers(allKeepers)
    return allKeepers
  },

  betUp: function(theBet) {
    player.adjustPurse(-theBet)
    player.adjustBet(theBet)
    game.isAbleToEnd()
    return player.bet
  },
  
  resetBet: function() {
    player.adjustPurse(player.bet - game.highBet)
    player.adjustBet(-(player.bet - game.highBet))
    game.isAbleToEnd()
    return player.bet
  },
  
  findHighBet: function() {
    return game.highBet = _.max(_.pluck(game.playerArray, 'bet'))
  },
  
  nextPlayer: function() {
    idx = game.playerArray.indexOf(player)
    if ( idx + 1 < game.playerArray.length ) {
      player = game.playerArray[idx + 1]
    } else if( idx + 1 === game.playerArray.length) {
      player = game.playerArray[0]
    }
    if (game.isAbleToPlay() === false && game.isGameOver() === false) { 
      return game.nextPlayer() 
    }
    return player.active = true;
  },
  
  isAbleToPlay: function() {
    if (player.folded === true) { return false }
    else if (player.remaining === 0 && player.bet === game.highBet) { return false }
    else { return true }
  },
  
  isThereALeader: function() {
    game.projArr = _.sortBy(game.playerArray, function(pl) { return pl.projection } );
    if (game.projArr[0].projection === game.projArr[1].projection) {
      return false
    } else {
      return game.projArr[0]
    }
  },
  
  isAbleToEnd: function() {
    if (player.bet >= game.findHighBet() || player.purse === 0 ) {
      if (typeof(tempKeepers) !== "undefined") {
        if (tempKeepers.length > 0) { return game.ableToEnd = true } 
      } else {
        if (player.keepers.length === 5) { return game.ableToEnd = true }
      }
    }
    return game.ableToEnd = false
  },
  
  isGameOver: function() {
    mostRemainingDice = _.max(_.pluck(game.playerArray, 'remaining'))
    if (mostRemainingDice === 0) { return true }   
    else { return false }
  },
  
  fold: function() {
    player.folded = true;
    player.remaining = 0;
    game.ableToEnd = true;
    game.endTurn()
  },
  
  endTurn: function() {
    if (game.ableToEnd === false) { return false }
    if (typeof(tempKeepers) !== "undefined"){
      game.finalizeChoices()
    }
    if(game.isGameOver() === true) {
      tournement.endGame()
    }
    theRoll = undefined;
    tempKeepers = undefined;
    game.ableToEnd = false;
    player.active = false;
    return game.nextPlayer()
  }
});








