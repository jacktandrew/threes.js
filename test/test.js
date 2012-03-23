var Test = Class.extend({
  init: function() {
    this.bet = 0
  },
  
  choose: function() {
    var keepers = []
    var anySelected = false;
    var d = 0; 
    theRoll.forEach(function(d) {
      if (d === 1 || d === 3) {
        anySelected = true
        keepers.push(d)
      }
    })

    if (anySelected === false) {
      theRoll.sort()
      keepers.push(theRoll[0])
    }
    
    keepers.forEach(function(k) {
      tournement.game.choose(k)
    })
    
    $('.green .score').html(activePlayer.score)
    $('.green .keepers').append(gameView.intToHTML(tempKeepers))
    return keepers
  },
  
  makeABet: function() {
    this.bet = 0;
    var leader = tournement.game.isThereALeader();
    var secondPlace = tournement.game.projArr[1];
    var call = tournement.game.highBet - activePlayer.bet
    
    if (activePlayer === leader) {
      var diff = secondPlace.projection - leader.projection;
    } else {
      var diff = leader.projection - activePlayer.projection;
    }
    
    if (diff >= 2) {
      this.bet = call + 5
    } else if (0 <= diff && diff < 2) {
      this.bet = call + 1
    } else if (-4 <= diff && diff < 0) {
      this.bet = call
    } else if (diff < -4 && call <= 0) {
      this.bet = 0
    } else if (diff < -4) {
      if (activePlayer.remaining <= 1 && call < 5) {
        this.bet = call
      } else {
        $('#test_results table').append('<tr><td>' + activePlayer.username + '</td><td colspan="7">FOLDED!!!</td></tr>')
        tournement.game.fold()
        gameView.winning()
      }
    }
    
    if (this.bet > activePlayer.purse) { this.bet = activePlayer.purse }
    
    if(activePlayer.folded === false) {
      $('#test_results table').append('<tr><td>' + activePlayer.username + '</td><td>' + theRoll.concat(tempKeepers) + '</td><td>' + tempKeepers + '</td><td>' + activePlayer.keepers + '</td><td>' + activePlayer.score + '</td><td>' + this.bet + '</td><td>' + (activePlayer.bet + this.bet)  + '</td><td>' + activePlayer.projection + '</td></tr>')    
    }

    tournement.game.betUp(this.bet)
    $('.green .bet').html(activePlayer.bet)
    $('.green .purse').html(activePlayer.purse)
  },

  autoPlay: function() {
    while(tournement.game.isGameOver() === false) {
      this.play();
    }
  },
    
  play: function() {
    if(tournement.game.playerArray.length === 0){
      gameView.startGame();
    }
  
    tournement.game.roll()
    this.choose()
    tournement.game.finalizeChoices()
    this.makeABet()
    if(activePlayer.folded === false) {
      theRoll = undefined;
      tempKeepers = undefined;
      tournement.game.ableToEnd = false;
      activePlayer.active = false;
      tournement.game.nextPlayer()
      gameView.switchWhoIsActive()
    }
    
    if(tournement.game.isGameOver() === true || activePlayer.folded === true) {
      tournement.endGame()
      $.jStorage.set('results', $('#test_results').html() )
      $('#test_results table').append('<tr><td  colspan="8">***THE GAME IS OVER*** and the winner is... ' + tournement.game.playerArray.sort(tournement.game.sortByProj)[0].username + '!!!!!!!!</td></tr>')
      gameView.winning()
      return false
    } 
  }
});