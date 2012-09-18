Tournement = Class.extend({
  init: function() {
    this.ai = new AI();
    this.game = new models.Game();
  },
  
  setupPlayers: function(moniker, purse) {
    var human = new Player(moniker, purse)
    var artIntel = _.find(allPlayers, function(obj) { return obj.username === 'Art Intel' })
    var ai = new Player(artIntel.username, artIntel.purse)
    ai.human = false;
    this.game.playerArray.push(human)
    this.game.playerArray.push(ai)
    activePlayer = this.game.playerArray[0]
    activePlayer.active = true;
    gameView.startGame();
    return activePlayer
  },
  
  poolWinnings: function() {
    winnings = $.jStorage.get('winnings', 0)
    $.jStorage.deleteKey('winnings')
    this.game.playerArray.forEach( function(plyr) {
      winnings += plyr.bet
      console.log('winnings = ' + winnings)
      var plyrDB = _.find(allPlayers, function(obj) { return obj.username === plyr.username } )
      plyrDB.purse = plyr.purse
    });
    return winnings
  },

  transferWinnings: function() {
    if(this.game.isThereALeader() === false) {
      console.log('game.isThereALeader === false, the winnings are being stored')   
      $.jStorage.set('winnings', winnings)                 // store the winnings for next round
    } else {                                              
      var winner = this.game.isThereALeader()
      console.log('winner = ' + winner.username)
      var winnerDB = _.find(allPlayers, function(obj) { return obj.username === winner.username } )
      winner.adjustPurse(winnings)                         // add the winnings to his purse
      winnerDB.purse = winner.purse
      $.jStorage.set('allPlayersKey', allPlayers)
    }
  },
  
  resetScores: function() {
    this.game.playerArray.forEach( function(pl) {
      pl.purse = 50;
      var aPlayer = _.find(allPlayers, function(obj) { return obj.username === pl.username } )
      aPlayer.purse = 50;
    });
    return $.jStorage.set('allPlayersKey', allPlayers)
  },
  
  newPlayers: function() {
    this.game.playerArray = []
  },
  
  refresh: function() {
    this.game.playerArray.forEach( function(p) {
      p.keepers = [];
      p.score = 0
      p.ableToEnd = false
      p.folded = false
      p.active = false
      p.bet = 0
      p.remaining = 5;
      p.projection = 7.5;
      winnings = 0;                                              // clear out any old winnings
      theRoll = undefined
      tempKeepers = undefined;
    });
    activePlayer.active = true;
    return this.game.playerArray
  },
  
  endGame: function() {
    this.poolWinnings()
    this.transferWinnings()
  }
});