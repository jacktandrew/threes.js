var Test = Class.extend({
  init: function(){
  },
  
  roll: function(){
    $('#outer form').hide();
    var theRoll = game.roll();
  },
    
  select: function(){
    anySelected = false
    for(i = 0; i < theRoll.length; i++){
      if (theRoll[i] === 1 || theRoll[i] === 3){
        anySelected = true
        game.tempKeepers.push(theRoll[i])
        if (theRoll[i] === 1){
          game.adjustScore(theRoll[i])
        }
      }  
    }

    if (anySelected === false && player.folded === false){
      theRoll.sort()
      game.tempKeepers.push(theRoll[0])
      game.adjustScore(theRoll[0])
    }
    
    if (player.folded === false) {
      $('.green .score').html(player.getScore())
      $('.green .keepers').append(intToHTML(game.tempKeepers))
    }
  },
  
  bet: function(){
    game.playerArray.sort(game.orderByProj)
    var bet = 0;
    var leader = game.playerArray[0];
    var secondPlace = game.playerArray[1];
    var call = game.highBet - player.bet
    
    if(player === leader){
      var diff = secondPlace.projection - leader.projection;
    } else {
      var diff = leader.projection - player.projection;
    }
    
    if (diff >= 2) {
      bet = call + 5
    } else if (0 <= diff && diff < 2) {
      bet = call + 1
    } else if (-4 <= diff && diff < 0) {
      bet = call
    } else if (diff < -4 && call <= 0) {
      bet = 0
    } else if (diff < -4) {
      if (player.remaining <= 1 && call < 5){
        bet = call
      } else {
        $('#test_results table').append('<tr><td>' + player.moniker + '</td><td colspan="7">FOLDED!!!</td></tr>')
        game.fold()
        winning()
      }
    }
    
    if(bet > player.purse){
      bet = player.purse
    }
    
    game.betUp(bet)
    $('.green .bet').html(player.getBet())
    $('.green .purse').html(player.getPurse())
    $('#test_results table').append('<tr><td>' + player.moniker + '</td><td>' + theRoll + '</td><td>' + player.keepers + '</td><td>' + player.score + '</td><td>' + (bet - game.highBet) + '</td><td>' + player.bet  + '</td><td>' + player.projection + '</td></tr>')
  },
    
  play: function(boo){
    if(boo == true){
      while(game.isTheGameOver === false){
        console.log('take auto turn')
        takeTurn();
      }
    } else {
      takeTurn();
    }
    
    function takeTurn(){
      if(game.isTheGameOver === true){
        // $('#test_results table').append('<tr><td  colspan="8"></td></tr>')
        $('#test_results table').append('<tr><td colspan="8">THE GAME IS OVER</td></tr>')
        return false
      }
      if(player.remaining > 0){
        test.roll()
        test.select()
        game.finalizeChoices(game.tempKeepers)
        game.clearKeepers()
      } else {
        game.isEveryoneDone()
      }
      test.bet()
      game.findHighBet()
      game.ableToEnd()
      
      if(game.isTheGameOver === true){
        $.jStorage.set('results', $('#test_results').html() )
        $('#test_results table').append('<tr><td  colspan="8">THE GAME IS OVER</td></tr>')
        $('#test_results table').append('<tr><td  colspan="8">and the winner is... ' + game.playerArray.sort(game.sortByProj)[0].moniker + '!!!!!!!!</td></tr>')
        tournement.endGame()
        winning()
      } else {
        game.nextPlayer()
      }
      switchWhoIsActive()
    }
  },
});