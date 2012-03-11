var game = {};
var test = {};
var player = {};

var Tournement = Class.extend({
  init: function() {
    this.stillAfloat = [];
    this.winnings = 0;
    this.allPlayers = $.jStorage.get("allPlayersKey");
  },
  
  findPlayer: function(moniker, array) {
    for (i = 0; i < array.length; i++) {  
      if(array[i].username === moniker) { 
        return array[i]
      }
    }
  },
  
  verifyNewUser: function(moniker, password, password2) {
    if (tournement.findPlayer(moniker, allPlayers) != undefined) {
      console.log('sorry another user is already using that name')
      return false
    } else if (password != password2) {        
      console.log('sorry, the passwords you entered did not match')
      return false
    } else {
      newPlayer = {username: moniker, password: password, purse:  50};  // 50 is the default purse value
      allPlayers.push(newPlayer);
      $.jStorage.set("allPlayersKey", allPlayers);
      tournement.setupPlayers(newPlayer.username, newPlayer.purse)
      return true
    }
  },
  
  verifyExistingUser: function(moniker, password) {
    if(tournement.findPlayer(moniker, allPlayers) != undefined) {
      singlePlayer = tournement.findPlayer(moniker, allPlayers)
      if(singlePlayer.password === password) {
        tournement.setupPlayers(singlePlayer.username, singlePlayer.purse)
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
  
  setupPlayers: function(moniker, purse) {
    p = new Player(moniker, purse)
    game.playerArray.push(p)
    idx = game.playerArray.indexOf(p)
    game.playerArray[idx].idxNum = idx
    tournement.stillAfloat.push(moniker)
    player = game.playerArray[0]
    player.active = true;
  },
  
  transferWinnings: function(p) {
    tournement.winnings += p.bet                                    // add all of their bets to the winnings
    console.log('winnings = ' + tournement.winnings)
    dataBaseEntry = tournement.findPlayer(p.moniker, allPlayers)    // find each player in AllPlayers database
    dataBaseEntry.purse = p.purse                                      // update the database with the new data from the array
  },

  storeWinnings: function() {
    console.log('storeWinnings')
    if(game.isATie() === true) {
      console.log('game.isATie() === true the winnings are being stored')   
      $.jStorage.set('winnings', tournement.winnings)                 // store the winnings for next round
    } else {                                              
      var winner = game.playerArray.sort(tournement.orderByProj)[0]
      winner.adjustPurse(tournement.winnings)                         // add the winnings to his purse
      console.log(winner.moniker + ' just received ' + tournement.winnings + ' in winnings')
      $.jStorage.set('allPlayersKey', allPlayers)
      console.log('allPlayersKey is being set with value allPlayers')
    }
  },
  
  resetScores: function(p) {
    console.log('resetScores')
    tournement.findPlayer(p, allPlayers).purse = 50;
    $.jStorage.set('allPlayersKey', allPlayers)
    console.log(p.moniker + "'s purse = 50")
  },
  
  refresh: function(p) {
    p.keepers = [];
    p.score = 0
    p.ableToEnd = false
    p.folded = false
    p.active = false
    p.bet = 0
    p.projection = 0;
    tournement.winnings = 0;                                              // clear out any old winnings
    console.log(player.moniker + ' refreshed')
  },
  
  endGame: function() {
    game.playerArray.sort(tournement.orderByProj)
    for(j = 0; j < game.playerArray.length; j++) {
      console.log('calling on tournement.transferWinnings j = ' + j)
      tournement.transferWinnings(game.playerArray[j])
    }
    tournement.storeWinnings()
  },
  
  checkForOverallWinner: function(p) {
    if(p.purse = 0) {
      idx = tournement.stillAfloat.indexOf(p.moniker)
      tournement.stillAfloat.splice(idx, 1)
      console.log('tournement.stillAfloat = ' + tournement.stillAfloat)
      console.log(p.moniker + ' = ' + p.purse)
    }
    if (tournement.stillAfloat.length === 0) {
      console.log('WE HAVE AN OVER WINNER!!!!')
    }    
  }
});