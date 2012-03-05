var game = [];
var test = [];
var playerArray = [];
var player = [];

var Tournement = Class.extend({
  init: function(){
    this.playersBust = [];
    this.winnings = 0;
    this.allPlayers = $.jStorage.get("allPlayersKey");
  },
  
  findPlayer: function(name, array){
    for (i = 0; i < array.length; i++){  
      idx = array[i].indexOf(name)
      if (idx != -1) { return array[i] }
    }
  },
  
  verifyNewUser: function(name, password, password2){
    if (tournement.findPlayer(name, allPlayers) != undefined){
      console.log('sorry another user is already using that name')
      return false
    } else if (password != password2){        
      console.log('sorry, the passwords you entered did not match')
      return false
    } else {
      // console.log('a new user is a sucess for => ' + name)
      newPlayer = [name, password, 50];  // 50 is the default purse value
      allPlayers.push(newPlayer);
      $.jStorage.set("allPlayersKey", allPlayers);
      tournement.setupPlayers(newPlayer[0], newPlayer[2])
      return true
    }
  },
  
  verifyExistingUser: function(name, password){
    if(tournement.findPlayer(name, allPlayers) != undefined){
      // console.log('Existing name is found! for => ' + name)
      singlePlayer = tournement.findPlayer(name, allPlayers)
      if(singlePlayer[1] === password){
        // console.log('password matches for => ' + name)
        tournement.setupPlayers(singlePlayer[0], singlePlayer[2])
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
  
  setupPlayers: function(name, purse){
    p = new Player(name, purse)
    playerArray.push(p)
    player = playerArray[0]
    player.active = true;
  },
  
  setupGame: function(){
    game = new Game(playerArray);
  },
  
  transferWinnings: function(){
    tournement.winnings = 0;
    for(i = 0; i < playerArray.length; i++){
      tournement.winnings += playerArray[i].bet
    }
    if(game.isATie === true && game.isTheGameOver === true){
      console.log('game.isATie === true the winnings are being stored')
      $.jStorage.set('winnings', tournement.winnings)
    } else {
      game.sortArray[0].adjustPurse(tournement.winnings)
      aPlayer = [];
      for(k = 0; k < playerArray.length; k++){
        aPlayer = playerArray[k]
        singlePlayer = tournement.findPlayer(aPlayer.name, allPlayers)
        singlePlayer[2] = aPlayer.purse
        // console.log(aPlayer.name + "'s purse is being update in the server")
      }
    }
    console.log('allPlayerKey is being set with value allPlayers')
    $.jStorage.set('allPlayersKey', allPlayers)
  },
  
  resetScores: function(){
    for(i = 0; i < playerArray.length; i++){
      singlePlayer = tournement.findPlayer(playerArray[i].name, allPlayers)
      singlePlayer[2] = 50;
    }
    $.jStorage.set('allPlayersKey', allPlayers)
  },
  
  refresh: function(){
    for(i = 0; i < playerArray.length; i++){
      playerArray[i].keepers = []
      playerArray[i].score = 0
      playerArray[i].ableToEnd = false
      playerArray[i].folded = false
      playerArray[i].active = false
      playerArray[i].bet = 0
    }
    tournement.setupGame();
    console.log('game refreshed')
  },
  
  endGame: function(){
    game.findLeader()
    tournement.transferWinnings()
    winning();
  },
  
  endTournement: function(){
    tournement.playersBust = []
    for (i = 0; i < playerArray.length; i++){
      if(playerArray[i].purse = 0){
        playersBust.push(playerArray[i])
      }
    }
    if(tournement.playersBust.length === playerArray.length - 1){
      console.log('WE HAVE AN OVER WINNER!!!!')
    }
  }
});