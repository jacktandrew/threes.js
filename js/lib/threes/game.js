var Game = Class.extend({
  init: function(playerArray){
    this.highBet = 0;
    this.sortArray = [];
    this.playersDone = [];
    this.tempKeepers = [];
    this.isTheGameOver = false;
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
  
  finalizeChoices: function(tempKeepers){
    comboArray = player.getKeepers().concat(tempKeepers)
    player.setKeepers(comboArray)
    player.setProjection()
    if (player.getBet() > game.highBet){
      game.highBet = player.getBet()
    }
  },
  
  finalizeBet: function(){
    if(player.getBet() > game.highBet){
      game.highBet = player.getBet()
    }
  },
  
  nextPlayer: function(){
    game.playersDone = [];
    game.tempKeepers = [];
    player.active = false;
    
    function next(){
      if (player.folded === true || player.remaining() === 0) {
        game.playersDone.push(player.name)
      }
      var paIdx = playerArray.indexOf(player)
      if(paIdx + 1 < playerArray.length){
        player = playerArray[paIdx + 1]
      } else if(paIdx + 1 === playerArray.length){
        player = playerArray[0]
      }
      if (game.playersDone.length === playerArray.length) {
        game.isTheGameOver = true;
        tournement.endGame();
      }
    }
    next();
    
    if (player.folded === true || player.remaining() === 0) {
      next();
    }
    player.active = true;
  },
  
  fold: function(){
    player.folded = true;
    $('#test_results table').append('<tr><td>' + player.name + '</td><td colspan="7">FOLDED!!!</td></tr>')
  },
  
  findLeader: function() {
    game.sortArray = [playerArray[0]]
    for(i = 1; i < playerArray.length; i++){
      if(playerArray[i].projection < game.sortArray[0].projection){
        game.sortArray.unshift(playerArray[i])
      } else {
        game.sortArray.push(playerArray[i])
      }
    }
  }
});