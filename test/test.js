var Test = Class.extend({
  init: function() {
    this.aRoll = []
    this.bet = 0
    this.keepers = []
  },
  
  roll: function(){
    return test.aRoll = game.roll()
  },
  
  choose: function() {
    test.keepers = []
    var anySelected = false
    test.aRoll.forEach(function(die) {
      if (die === 1 || die === 3) {
        anySelected = true
        test.keepers.push(die)
      }
    })

    if (anySelected === false) {
      test.aRoll.sort()
      test.keepers.push(test.aRoll[0])
    }
    
    test.keepers.forEach(function(k) {
      game.choose(k)
    })
    
    $('.green .score').html(activePlayer.score)
    $('.green .keepers').append(intToHTML(tempKeepers))
    return test.keepers
  },
  
  makeABet: function() {
    test.bet = 0;
    var leader = game.isThereALeader();
    var secondPlace = game.projArr[1];
    var call = game.highBet - activePlayer.bet
    
    if (activePlayer === leader) {
      var diff = secondPlace.projection - leader.projection;
    } else {
      var diff = leader.projection - activePlayer.projection;
    }
    
    if (diff >= 2) {
      test.bet = call + 5
    } else if (0 <= diff && diff < 2) {
      test.bet = call + 1
    } else if (-4 <= diff && diff < 0) {
      test.bet = call
    } else if (diff < -4 && call <= 0) {
      test.bet = 0
    } else if (diff < -4) {
      if (activePlayer.remaining <= 1 && call < 5) {
        test.bet = call
      } else {
        $('#test_results table').append('<tr><td>' + activePlayer.username + '</td><td colspan="7">FOLDED!!!</td></tr>')
        game.fold()
        winning()
      }
    }
    
    if (test.bet > activePlayer.purse) { test.bet = activePlayer.purse }
    
    if(activePlayer.folded === false) {
      $('#test_results table').append('<tr><td>' + activePlayer.username + '</td><td>' + test.aRoll.concat(test.keepers) + '</td><td>' + test.keepers + '</td><td>' + activePlayer.keepers + '</td><td>' + activePlayer.score + '</td><td>' + test.bet + '</td><td>' + (activePlayer.bet + test.bet)  + '</td><td>' + activePlayer.projection + '</td></tr>')    
    }

    game.betUp(test.bet)
    $('.green .bet').html(activePlayer.bet)
    $('.green .purse').html(activePlayer.purse)
  },

  autoPlay: function() {
    console.log('auto turn')
    while(game.isGameOver() === false) {
      console.log('take auto turn')
      test.play();
    }
  },
    
  play: function() {
    if(game.playerArray.length === 0){
      startGame();
    }
  
    test.roll()
    test.choose()
    game.finalizeChoices()
    test.makeABet()
    if(activePlayer.folded === false) {
      theRoll = undefined;
      tempKeepers = undefined;
      game.ableToEnd = false;
      activePlayer.active = false;
      game.nextPlayer()
      switchWhoIsActive()
    }
    
    if(game.isGameOver() === true || activePlayer.folded === true) {
      tournement.endGame()
      $.jStorage.set('results', $('#test_results').html() )
      $('#test_results table').append('<tr><td  colspan="8">***THE GAME IS OVER*** and the winner is... ' + game.playerArray.sort(game.sortByProj)[0].username + '!!!!!!!!</td></tr>')
      winning()
      return false
    } 
  }
});