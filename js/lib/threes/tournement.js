// var game = {};
// var test = {};
// var player = {};

var Tournement = Class.extend({
  init: function() {
    this.winnings = 0;
    this.ai = new AI();
    this.game = new Game();
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
      tournement.setupPlayers(newPlayer.username, newPlayer.purse, true)
      return true
    }
  },
  
  verifyExistingUser: function(moniker, password) {
    var singlePlayer = _.find(allPlayers, function(obj) { return obj.username === moniker })
    if (singlePlayer != undefined) {
      if(singlePlayer.password === password) {
        tournement.setupPlayers(singlePlayer.username, singlePlayer.purse, true)
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
    var p = new Player(moniker, purse)
    p.human = boole;
    game.playerArray.push(p)
    player = game.playerArray[0]
    player.active = true;
    return player
  },
  
  poolWinnings: function() {
    tournement.winnings = $.jStorage.get('winnings', 0)
    $.jStorage.deleteKey('winnings')
    game.playerArray.forEach( function(thisGuy) {
      tournement.winnings += thisGuy.bet
      var thisGuyDB = _.find(allPlayers, function(obj) { return obj.username === thisGuy.username } )
      thisGuyDB.purse = thisGuy.purse
    });
    return tournement.winnings
  },

  transferWinnings: function() {
    if(game.isThereALeader() === false) {
      console.log('game.isThereALeader === false, the winnings are being stored')   
      $.jStorage.set('winnings', tournement.winnings)                 // store the winnings for next round
    } else {                                              
      var winner = game.isThereALeader()
      var winnerDB = _.find(allPlayers, function(obj) { return obj.username === winner.username } )
      winner.adjustPurse(tournement.winnings)                         // add the winnings to his purse
      winnerDB.purse = winner.purse
      $.jStorage.set('allPlayersKey', allPlayers)
    }
  },
  
  resetScores: function() {
    game.playerArray.forEach( function(pl) {
      pl.purse = 50;
      var aPlayer = _.find(allPlayers, function(obj) { return obj.username === pl.username } )
      aPlayer.purse = 50;
    });
    return $.jStorage.set('allPlayersKey', allPlayers)
  },
  
  refresh: function() {
    game.playerArray.forEach( function(p) {
      p.keepers = [];
      p.score = 0
      p.ableToEnd = false
      p.folded = false
      p.active = false
      p.bet = 0
      p.remaining = 5;
      p.projection = 7.5;
      tournement.winnings = 0;                                              // clear out any old winnings
      theRoll = undefined
      tempKeepers = undefined;
    });
    player.active = true;
    return game.playerArray
  },
  
  endGame: function() {
    tournement.poolWinnings()
    tournement.transferWinnings()
  }
});