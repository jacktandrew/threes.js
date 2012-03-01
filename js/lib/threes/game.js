var left = new Player('lefty');
var right = new Player('righty');
playerArray = [ left, right ]

var Game = Class.extend({
  init: function(playerArray){
    this.highBet = 0;
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
//      console.log('able to end = true')
      return true
    } else {
      player.ableToEnd = false
      console.log('able to end = false')
      return false
    }
  },
  
  endTurn: function(newArray){
    comboArray = player.getKeepers().concat(newArray)
    player.setKeepers(comboArray)
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
  
  checkIfRolledAll: function(){
    if(game.playersDone.length === playerArray.length){
      console.log('all players have kept 5 dice')
      game.findWinner()
      game.transferWinnings()
    } else if(player.keepers.length === 5){
      var paIdx = playerArray.indexOf(player)
      console.log(player.name + " has kept 5 dice")
      if(game.playersDone.indexOf(paIdx) === -1){
        game.playersDone.push(paIdx)
      }
      game.nextPlayer()
    }
  },
  
  
  findWinner: function(){
    console.log('find winner')
    lowestScore = 29
    for(i = 0; i + 1 < playerArray.length; i++){
      if(playerArray[i].score < lowestScore){
        lowestScore = playerArray[i].score
        return i
      }
      console.log('winner ' + playerArray[i].name)
      console.log('winning score ' + playerArray[i].score)
    }
  },
  
  transferWinnings: function(){
    for(i = 0; i + 1 < playerArray.length; i++){
      playerArray[game.findWinner()].adjustPurse( playerArray[i].getBet() )
      console.log('transferWinnings ' + i)
    }
  },
  
  resetScores: function(){
    for(i = 0; i < playerArray.length; i++){
      $.jStorage.deleteKey(playerArray[i].name)
    }
  }
});