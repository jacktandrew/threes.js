Tournement = Class.extend({
  init: function() {
    this.ai = new AI();
    this.game = new models.Game();
    this.test = new Test();
  },
  
  verifyNewUser: function(moniker, password, password2) {
    var singlePlayer = _.find(allPlayers, function(obj) { return obj.username === moniker })
    if (singlePlayer != undefined) {
      console.log('sorry another user is already using that name')
      return false
    } else if (password != password2) {        
      console.log('sorry, the passwords you entered did not match')
      return false
    } else {
      newPlayer = {username: moniker, password: password, purse:  50};  // 50 is the default purse value
      allPlayers.push(newPlayer);
      $.jStorage.set("allPlayersKey", allPlayers);
      this.setupPlayers(newPlayer.username, newPlayer.purse, true)
      return true
    }
  },
  
  verifyExistingUser: function(moniker, password) {
    var singlePlayer = _.find(allPlayers, function(obj) { return obj.username === moniker })
    if (singlePlayer != undefined) {
      if(singlePlayer.password === password) {
        this.setupPlayers(singlePlayer.username, singlePlayer.purse, true)
        return true
      } else {
        console.log('sorry your password did not match the one stored in our database')
        return false
      }
    } else {
      console.log('sorry we could not find that name in our database')
      return false
    }
  },
  
  setupPlayers: function(moniker, purse, boole) {
    var aPlayer = new Player(moniker, purse)
    aPlayer.human = boole;
    this.game.playerArray.push(aPlayer)
    activePlayer = this.game.playerArray[0]
    activePlayer.active = true;
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