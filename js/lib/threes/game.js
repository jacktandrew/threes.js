window.models = window.models || {}
models.Game = Class.extend({
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
      for (i = 0; i < activePlayer.remaining; i++) {
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
        activePlayer.adjustScore(die)
      }
    }
    this.isAbleToEnd()
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
        activePlayer.adjustScore(-die)
      }
    }
    this.isAbleToEnd()
    return tempKeepers
  },
  
  finalizeChoices: function() {
    allKeepers = activePlayer.getKeepers().concat(tempKeepers)
    activePlayer.setKeepers(allKeepers)
    return allKeepers
  },

  betUp: function(integer) {
    activePlayer.adjustPurse(-integer)
    activePlayer.adjustBet(integer)
    this.isAbleToEnd()
    return activePlayer.bet
  },
  
  resetBet: function() {
    activePlayer.adjustPurse(activePlayer.bet - this.highBet)
    activePlayer.adjustBet(-(activePlayer.bet - this.highBet))
    this.isAbleToEnd()
    return activePlayer.bet
  },
  
  findHighBet: function() {
    return this.highBet = _.max(_.pluck(this.playerArray, 'bet'))
  },
  
  nextPlayer: function() {
    idx = this.playerArray.indexOf(activePlayer)
    if ( idx + 1 < this.playerArray.length ) {
      activePlayer = this.playerArray[idx + 1]
    } else if( idx + 1 === this.playerArray.length) {
      activePlayer = this.playerArray[0]
    }
    if (this.isAbleToPlay() === false && this.isGameOver() === false) { 
      return this.nextPlayer() 
    }
    return activePlayer.active = true;
  },
  
  isAbleToPlay: function() {
    if (activePlayer.folded === true) { return false }
    else if (activePlayer.remaining === 0 && activePlayer.bet === this.highBet) { return false }
    else { return true }
  },
  
  isThereALeader: function() {
    this.projArr = _.sortBy(this.playerArray, function(pl) { return pl.projection } );
    if (this.projArr[0].projection === this.projArr[1].projection) {
      return false
    } else {
      return this.projArr[0]
    }
  },
  
  isAbleToEnd: function() {
    if (activePlayer.bet >= this.findHighBet() || activePlayer.purse === 0 ) {
      if (typeof(tempKeepers) !== "undefined") {
        if (tempKeepers.length > 0) { return this.ableToEnd = true } 
      } else {
        if (activePlayer.keepers.length === 5) { return this.ableToEnd = true }
      }
    } 
    return this.ableToEnd = false
  },
  
  isGameOver: function() {
    mostRemainingDice = _.max(_.pluck(this.playerArray, 'remaining'))
    if (mostRemainingDice === 0) { return true }   
    else { return false }
  },
  
  fold: function() {
    activePlayer.folded = true;
    activePlayer.projection = 100;
    activePlayer.remaining = 0;
    this.ableToEnd = true;
  },
  
  endTurn: function() {
    if (this.ableToEnd === false) { return false }
    if (typeof(tempKeepers) !== "undefined"){
      this.finalizeChoices()
    }
    if(this.isGameOver() === true) {
      console.log('tournement.endGame()')
      tournement.endGame()
    }
    theRoll = undefined;
    tempKeepers = undefined;
    this.ableToEnd = false;
    activePlayer.active = false;
    return this.nextPlayer()
  }
});