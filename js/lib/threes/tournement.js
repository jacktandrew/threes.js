Tournement = Class.extend({
  init: function() {
    this.winnings = 0;
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
    this.winnings = $.jStorage.get('winnings', 0)
    $.jStorage.deleteKey('winnings')
    this.game.playerArray.forEach( function(thisGuy) {
      this.winnings += thisGuy.bet
      var thisGuyDB = _.find(allPlayers, function(obj) { return obj.username === thisGuy.username } )
      thisGuyDB.purse = thisGuy.purse
    });
    return this.winnings
  },

  transferWinnings: function() {
    if(this.game.isThereALeader() === false) {
      console.log('game.isThereALeader === false, the winnings are being stored')   
      $.jStorage.set('winnings', this.winnings)                 // store the winnings for next round
    } else {                                              
      var winner = this.game.isThereALeader()
      var winnerDB = _.find(allPlayers, function(obj) { return obj.username === winner.username } )
      winner.adjustPurse(this.winnings)                         // add the winnings to his purse
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
      this.winnings = 0;                                              // clear out any old winnings
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