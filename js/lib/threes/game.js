var Game = Class.extend({
  init: function() {
    this.highBet = 0;
    this.playerArray = [];
    this.tempKeepers = [];
    this.isTheGameOver = false;
    this.aTie = true;
  },

  betUp: function(theBet) {
    player.adjustPurse(-theBet)
    player.adjustBet(theBet)
  },
  
  resetBet: function() {
    player.adjustPurse(player.getBet() - game.highBet)
    player.adjustBet(-(player.getBet() - game.highBet))
  },

  roll: function() {
    theRoll = [];
    for (i = 0; i < player.remaining; i++) {
      var randNum = Math.floor(Math.random()*6) + 1;
      theRoll.push(randNum)
    }
    return theRoll
  },

  adjustScore: function(theInteger) {
    score = player.getScore();
    score += theInteger
    player.setScore(score)
  },
  
  ableToEnd: function() {
    if (player.getBet() >= game.highBet || player.purse === 0 ) {
      if (game.tempKeepers.length > 0 || player.keepers.length === 5) {
        player.ableToEnd = true
        return true
      }
    } else {
      player.ableToEnd = false
      return false
    }
  },
  
  finalizeChoices: function(array) {
    player.setKeepers(player.getKeepers().concat(array))
    player.setProjection()
  },
  
  clearKeepers: function() {
    game.tempKeepers = []
  },
  
  findHighBet: function() {
    // if(player.getBet() > game.highBet) {
    //   game.highBet = player.getBet()
    // }
    // return game.highBet
    return game.highBet = _.max(_.pluck(game.playerArray, 'bet'))
  },
  
  nextPlayer: function() {
    game.playerArray.sort(game.orderByIndex)
    player.active = false;
    if(player.idxNum + 1 < game.playerArray.length) {
      player = game.playerArray[player.idxNum + 1]
    } else if(player.idxNum + 1 === game.playerArray.length) {
      player = game.playerArray[0]
    }
    player.active = true;
  },
  
  isAbleToPlay: function(player) {
    if (player.folded === true) {
      return false
    } else if (player.remaining === 0 && player.bet === game.highBet) {
      return false
    } else {
      return true
    }
  },
  
  isATie: function() {
    if (game.playerArray[0].projection === game.playerArray[1].projection) {
      return game.aTie = true
    } else {
      return game.aTie = false
    }
  },
  
  orderByProj: function(a, b) {
    console.log('orderByProj')
    return a.projection - b.projection;
  },
  
  orderByIndex: function(a, b) {
    console.log('orderByIndex')
    return a.idxNum - b.idxNum;
  },
  
  // orderByRemaining: function(a, b) {
  //   console.log('orderByRemaining')
  //   return b.remaining - a.remaining
  // },
  
  allDiceRolled: function(){
    _.max(_.pluck(game.playerArray, 'remaining'))
  }
  
  fold: function() {
    player.folded = true;
    game.nextPlayer()
    tournement.endGame()
  },
  
  endTurn: function() {
    game.finalizeChoices(game.tempKeepers)
    game.findHighBet()
    game.playerArray.sort(game.orderByRemaining)
    if (game.playerArray[0].remaining === 0) {
      game.isTheGameOver = true
      console.log(' game.isTheGameOver = ' + game.isTheGameOver)
    } else {
      game.nextPlayer()
      if (game.isAbleToPlay(player) === false) { 
        game.nextPlayer() 
      }
    }
  }
});