var test = Class.extend({
  init: function(){
    this.leader = "";
    this.contender = "";
  },
  
  autoRoll: function(){
    var theRoll = game.roll();
    $('#test_results').append(player.name + " rolled = [" + theRoll.toString() + "]</br>")
  },
    
  autoSelect: function(){
    for(i = 0; i < theRoll.length; i++){
      if (theRoll[i] === 1){
        game.tempKeepers.push(theRoll[i])
        game.adjustScore(theRoll[i])
      } else if (theRoll[i] === 3){
        game.tempKeepers.push(theRoll[i])
      } else if (game.tempKeepers.length === 0){
        theRoll.sort()
        game.tempKeepers.push(theRoll[0])
        game.adjustScore(theRoll[i])
      }
    }
    
    $('#test_results').append(player.name + " kept = [" + game.tempKeepers.toString() + "]</br>")
    $('#test_results').append(player.name + "'s score is = " + player.score + "</br>")
    $('.green .score').html(player.getScore())
    $('.green .keepers').append(intToHTML(game.tempKeepers))
  },
  
  autoOpenBet: function(){
    var bet = 0;
    var projection = 1.5 * (5 - (game.tempKeepers.length + player.keepers.length))
    if (projection < 4){
      bet = 10
    } else if (projection < 5){
      bet = 5
    } else if (projection < 7){
      bet = 1
    } else {
      bet = 0
    }
    game.betUp(bet)
    // console.log("the active player is " + player.name)
    $('.green .bet').html(player.getBet())
    $('.green .purse').html(player.getPurse())
    $('#test_results').append(player.name + " bets " + bet + "</br>")
  },
  
  autoRespondBet: function(){
    // var myPro = 1.5 * (5 - (game.tempKeepers.length + player.keepers.length))
    var firstPlace = 100;
    var secondPlace = 100;
    var leader = [];
    var projection = 0;
    for(i = 0; i < playerArray.length; i++){
      projection = 1.5 * (5 - playerArray[i].keepers.length)
      if (projection < firstPlace){
        firstPlace = projection;
        test.leader = playerArray[i];
        console.log(test.leader.name + ' is in first')
      }
      
      if (projection > firstPlace && projection < secondPlace){
        secondPlace = projection
        test.contender = playerArray[i]
        console.log(test.leader.name + ' is in second')
      }
    }
    
    if (player === test.leader){
      console.log(test.leader.name + " is in the lead")
    }
    // var diff = 
    // if (projection < 4){
    //   bet = 10
    // } else if (projection < 5){
    //   bet = 5
    // } else if (projection < 7){
    //   bet = 1
    // } else {
    //   bet = 0
    // }
    // game.betUp(bet)
    // $('.green .bet').html(player.getBet())
    // $('#test_results').append(player.name + " bets " + bet + "</br>")    
  },
  
  takeTurn: function(){

      test.autoRoll();
      test.autoSelect();
      if (game.highBet > 0){
        console.log('respond bet')
        test.autoRespondBet();
      } else {
        // console.log('open bet')
        test.autoOpenBet();
      } 
      
      game.ableToEnd();
      game.endTurn(game.tempKeepers);
      game.nextPlayer();
      switchWhoIsActive();
      game.checkIfRolledAll();
  }
});



$(document).ready(function(){
  
//  while(player.keepers.length < 5){


  
});
