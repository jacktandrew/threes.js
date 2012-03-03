var left = new Player('lefty');
var right = new Player('righty');
playerArray = [ left, right ]

var Game = Class.extend({
  init: function(playerArray){
    this.highBet = 0;
    this.winnings = 0;
    this.playersDone = [];
    this.newArray = [];
    this.tempKeepers = [];
  },

  betUp: function(theBet){
    player.adjustPurse(-theBet)
    player.adjustBet(theBet)
  },
  
  resetBet: function(){
    player.adjustPurse(player.getBet() - game.highBet)
    player.adjustBet(-(player.getBet() - game.highBet))
  },

  roll: function(){
    game.tempKeepers = [];
    remaining = player.remaining();
    theRoll = [];
    for (i = 0; i < remaining; i++) {
      var randNum = Math.floor(Math.random()*6) + 1;
      theRoll.push(randNum)
    }
    return theRoll
  },

  adjustScore: function(theInteger){
    score = player.getScore();
    score += theInteger
    player.setScore(score)
  },
  
  ableToEnd: function(){
    if(player.getBet() >= game.highBet && game.tempKeepers.length > 0){
      player.ableToEnd = true
      return true
    } else {
      player.ableToEnd = false
      return false
    }
  },
  
  finalizeChoices: function(newArray){
    comboArray = player.getKeepers().concat(newArray)
    player.setKeepers(comboArray)
    player.setProjection()
    if(player.getBet() > game.highBet){
      game.highBet = player.getBet()
    }
  },
  
  finalizeBet: function(){
    if(player.getBet() > game.highBet){
      game.highBet = player.getBet()
    }
  },
  
  nextPlayer: function(){
    player.active = false;
    var paIdx = playerArray.indexOf(player)
    if(paIdx + 1 < playerArray.length){
      player = playerArray[paIdx + 1]
    } else if(paIdx + 1 === playerArray.length){
      player = playerArray[0]
    }
    player.active = true;    
  },
  
  isTheGameOver: function(){
    if (player.folded === true) { return true }
    
    game.playersDone = []
    for(i = 0; i < playerArray.length; i++){
      if(playerArray[i].keepers.length === 5){
        game.playersDone.push(i)
        console.log('game.playersDone = ' + game.playersDone)
      }
    }
    
    if(game.playersDone.length === playerArray.length){
      console.log('all the players have roll all their dice')
      return true
    }
    return false
  },
  
  fold: function(){
    player.folded = true;
  },
  
  findLeader: function() {
    test.sortArray = [playerArray[0]]
    for(i = 1; i < playerArray.length; i++){
      if(playerArray[i].projection < test.sortArray[0].projection){
        test.sortArray.unshift(playerArray[i])
      } else {
        test.sortArray.push(playerArray[i])
      }
    }
  },
  
  transferWinnings: function(){
    for(i = 0; i < playerArray.length; i++){
      game.winnings += playerArray[i].bet
    }
    test.sortArray[0].adjustPurse(game.winnings)
    
    for(i = 0; i < playerArray.length; i++){
      $.jStorage.set(playerArray[i].name, playerArray[i].purse )
    }
  },
  
  resetScores: function(){
    for(i = 0; i < playerArray.length; i++){
      $.jStorage.deleteKey(playerArray[i].name)
    }
  }
});