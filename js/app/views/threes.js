$(document).ready(function() {
  tournement = new Tournement();
  gameView = new views.Game({el: $('body'), model: tournement} );
  allPlayers = $.jStorage.get("allPlayersKey", [ {username: "Art Intel", purse: 50} ] );
});

Tournement = Class.extend({
  init: function() {
    this.ai = new AI();
    this.game = new models.Game();
  },
  
  setupPlayers: function(moniker, purse) {
    var human = new Player(moniker, purse)
    var artIntel = _.find(allPlayers, function(obj) { return obj.username === 'Art Intel' })
    var ai = new Player(artIntel.username, artIntel.purse)
    ai.human = false;
    this.game.playerArray.push(human)
    this.game.playerArray.push(ai)
    activePlayer = this.game.playerArray[0]
    activePlayer.active = true;
    gameView.startGame();
    return activePlayer
  },
  
  poolWinnings: function() {
    winnings = $.jStorage.get('winnings', 0)
    $.jStorage.deleteKey('winnings')
    this.game.playerArray.forEach( function(plyr) {
      winnings += plyr.bet
      console.log('winnings = ' + winnings)
      var plyrDB = _.find(allPlayers, function(obj) { return obj.username === plyr.username } )
      plyrDB.purse = plyr.purse
    });
    return winnings
  },

  transferWinnings: function() {
    if(this.game.isThereALeader() === false) {
      console.log('game.isThereALeader === false, the winnings are being stored')   
      $.jStorage.set('winnings', winnings)                 // store the winnings for next round
    } else {                                              
      var winner = this.game.isThereALeader()
      console.log('winner = ' + winner.username)
      var winnerDB = _.find(allPlayers, function(obj) { return obj.username === winner.username } )
      winner.adjustPurse(winnings)                         // add the winnings to his purse
      winnerDB.purse = winner.purse
      $.jStorage.set('allPlayersKey', allPlayers)
    }
  },
  
  resetScores: function() {
    this.game.playerArray.forEach( function(pl) {
      pl.purse = 50;
      var aPlayer = _.find(allPlayers, function(obj) { return obj.username === pl.username } )
      aPlayer.purse = 50;
    });
    return $.jStorage.set('allPlayersKey', allPlayers)
  },
  
  newPlayers: function() {
    this.game.playerArray = []
  },
  
  refresh: function() {
    this.game.playerArray.forEach( function(p) {
      p.keepers = [];
      p.score = 0
      p.ableToEnd = false
      p.folded = false
      p.active = false
      p.bet = 0
      p.remaining = 5;
      p.projection = 7.5;
      winnings = 0;                                              // clear out any old winnings
      theRoll = undefined
      tempKeepers = undefined;
    });
    activePlayer.active = true;
    return this.game.playerArray
  },
  
  endGame: function() {
    this.poolWinnings()
    this.transferWinnings()
  }
});

window.models = window.models || {}
models.Game = Class.extend({
  init: function() {
    this.highBet = 0;
    this.playerArray = [];
    this.projArr = [];
    this.ableToEnd = false;
  },

  roll: function() {
    if(typeof(theRoll) === "undefined"){
      tempKeepers = []
      theRoll = [];
      for (i = 0; i < activePlayer.remaining; i++) {
        var randNum = Math.floor(Math.random()*6) + 1;
        theRoll.push(randNum)
      }
      return theRoll
    } else {
      return false
    }
  },
  
  choose: function() {
    for (k = 0; k < arguments.length; k++){
      die = arguments[k]
      idx = theRoll.indexOf(die)
      if ( idx !== -1 ) {
        theRoll.splice(idx, 1)
        tempKeepers.push(die)
        activePlayer.adjustScore(die)
      }
    }
    this.isAbleToEnd()
    return tempKeepers
  },
  
  unchoose: function() {
    for (k = 0; k < arguments.length; k++){
      die = arguments[k]
      idx = tempKeepers.indexOf(die)
      if ( idx === -1 ) {
        return false
      } else {
        tempKeepers.splice(idx, 1)
        theRoll.push(die)
        activePlayer.adjustScore(-die)
      }
    }
    this.isAbleToEnd()
    return tempKeepers
  },
  
  finalizeChoices: function() {
    allKeepers = activePlayer.getKeepers().concat(tempKeepers)
    activePlayer.setKeepers(allKeepers)
    return allKeepers
  },

  betUp: function(integer) {
    activePlayer.adjustPurse(-integer)
    activePlayer.adjustBet(integer)
    this.isAbleToEnd()
    return activePlayer.bet
  },
  
  resetBet: function() {
    activePlayer.adjustPurse(activePlayer.bet - this.highBet)
    activePlayer.adjustBet(-(activePlayer.bet - this.highBet))
    this.isAbleToEnd()
    return activePlayer.bet
  },
  
  findHighBet: function() {
    return this.highBet = _.max(_.pluck(this.playerArray, 'bet'))
  },
  
  nextPlayer: function() {
    idx = this.playerArray.indexOf(activePlayer)
    if ( idx + 1 < this.playerArray.length ) {
      activePlayer = this.playerArray[idx + 1]
    } else if( idx + 1 === this.playerArray.length) {
      activePlayer = this.playerArray[0]
    }
    if (this.isAbleToPlay() === false && this.isGameOver() === false) { 
      return this.nextPlayer() 
    }
    return activePlayer.active = true;
  },
  
  isAbleToPlay: function() {
    if (activePlayer.folded === true) { return false }
    else if (activePlayer.remaining === 0 && activePlayer.bet === this.highBet) { return false }
    else { return true }
  },
  
  isThereALeader: function() {
    this.projArr = _.sortBy(this.playerArray, function(pl) { return pl.projection } );
    if (this.projArr[0].projection === this.projArr[1].projection) {
      return false
    } else {
      return this.projArr[0]
    }
  },
  
  isAbleToEnd: function() {
    if (activePlayer.bet >= this.findHighBet() || activePlayer.purse === 0 ) {
      if (typeof(tempKeepers) !== "undefined") {
        if (tempKeepers.length > 0) { return this.ableToEnd = true } 
      } else {
        if (activePlayer.keepers.length === 5) { return this.ableToEnd = true }
      }
    } 
    return this.ableToEnd = false
  },
  
  isGameOver: function() {
    mostRemainingDice = _.max(_.pluck(this.playerArray, 'remaining'))
    if (mostRemainingDice === 0) { return true }   
    else { return false }
  },
  
  fold: function() {
    activePlayer.folded = true;
    activePlayer.projection = 100;
    activePlayer.remaining = 0;
    this.ableToEnd = true;
  },
  
  endTurn: function() {
    if (this.ableToEnd === false) { return false }
    if (typeof(tempKeepers) !== "undefined"){
      this.finalizeChoices()
    }
    if(this.isGameOver() === true) {
      console.log('tournement.endGame()')
      tournement.endGame()
    }
    theRoll = undefined;
    tempKeepers = undefined;
    this.ableToEnd = false;
    activePlayer.active = false;
    return this.nextPlayer()
  }
});

var Player = Class.extend({
  init: function(moniker, purse) {
    this.active = false;
    this.bet = 0;
    this.folded = false;
    this.human = true;
    this.keepers = [];
    this.remaining = 5;
    this.projection = 7.5;
    this.purse = purse;
    this.score = 0;
    this.username = moniker;
  },
  
  adjustBet: function(integer) {
    this.bet += integer;
  },
  
  adjustPurse: function(integer) {
    this.purse += integer;
  },
  
  adjustScore: function(integer) {
    if (integer === 3 || integer === -3) { integer = 0 }              // idiosyncrasy of the game :)
    this.score += integer;
  },
  
  getKeepers: function() {
    return this.keepers;
  },
  
  setKeepers: function(array) {
    this.keepers = array;
    this.remaining = (5 - array.length)
    this.projection = this.score + (1.5 * this.remaining);
  }
});

var AI = Class.extend({
  init: function() {},
  
  selectDice: function() {
    var die = 0;
    var anySelected = false;
    console.log(activePlayer.username + ' rolled [' + theRoll + ']')
    theRoll.forEach(function(die) {
      if (die === 1 || die === 3) {
        anySelected = true
        window.setTimeout(function(){
          $('#inner div._' + die).addClass('selected').css({'background':'yellow'})
          tournement.game.choose(die)
        }, 500);
      }
    });

    if (anySelected === false) {
      theRoll.sort()
      die = theRoll[0]
      $('#inner div._' + die + ':first-child').addClass('selected').css({'background':'yellow'})
      window.setTimeout(function(){
        tournement.game.choose(die)
      }, 500);
    }
    return tempKeepers    
  },

  selectBet: function() {
    var aiBet = 0;
    var call = tournement.game.highBet - activePlayer.bet;
    var leader = tournement.game.isThereALeader();
    var secondPlace = tournement.game.projArr[1];
    
    console.log('call = ' + call)
    if (leader === false) {         // there is a tie
      return aiBet = call + 1       // call and raise one
    } else {                        // otherwise 
      if (activePlayer === leader) {      // find out who is the leader
        var diff = secondPlace.projection - leader.projection;
        // console.log(activePlayer.username + ' is the leader')
      } else {
        var diff = leader.projection - activePlayer.projection;       // and what is the lead
        // console.log(activePlayer.username + ' is behind')
      }
      console.log('diff = ' + diff)
      if (diff > 0) {
        return aiBet = call + Math.ceil(diff * 2)
      } else if (-3 <= diff && diff <= 0) {
        console.log('-3 < diff && diff <= 0')
        return aiBet = call
      } else if (call < 3) {
        console.log('call = ' + call)
        return aiBet = call
      } else {
        console.log('folding')
        console.log(tournement.game.playerArray)
        return false 
      }
    }
  },
  
  play: function() {
    gameView.rollAction();
    window.setTimeout(function() {
      tournement.ai.selectDice();
    }, 500);
    window.setTimeout(function() {
      tournement.ai.wrapUp();
    }, 3000);
  },

  wrapUp: function() {
    gameView.moveKeepers()
    tournement.game.finalizeChoices()
    console.log('this turn it kept [' + tempKeepers + '] >>> giving it a total of [' + allKeepers + ']')
    tempKeepers = undefined
    var theBet = tournement.ai.selectBet();
    if (theBet === false) {
      console.log('theBet = ' + theBet)
      tournement.game.fold()
      tournement.endGame()
      gameView.winning()
    } else {
      console.log('this turn it bet (' + theBet + ') >>> bringing the total bet to (' + (activePlayer.bet + theBet) + ')')
      if (theBet > activePlayer.purse) { theBet = activePlayer.purse }
      tournement.game.betUp(theBet)
      gameView.displayBet()
      tournement.game.ableToEnd = true;
      activePlayer.active = false;
      tournement.game.endTurn()
      gameView.actionEndTurn()  
    }
  }
});

window.views = window.views || {}
views.Game = Backbone.View.extend({
  
  initialize: function() {
    _.bindAll(this)
  },

  events: {
    "click #start":               "setupUser", 
    "click #roll":                "rollAction",
    "click .die":                 "selectOrUnselect",
    "click #fold":                "fold",
    "click #sure_fold":           "sureFold",
    "click #rematch":             "newGame",
    "click #reset_scores":        "resetScore",
    "click #new_player":         "newPlayers",
    "click #left_col.green .cash_box a":   "increaseBet",
    "click #end_turn":            "actionEndTurn"
  },

  render: function() {},
  
  startGame: function(){
    if(this.model.game.playerArray.length >= 2) {
      $('.green .bet, .red .bet, .green .score, .red .score').html('0')
      $('#start').hide()
      $('#end_turn').show()
      $('#roll').removeClass('unavailable')
      $('#outer form, #outer h1, #outer h3').hide()
      $('#left_col').removeClass('red').addClass('green')
      $('#left_col .purse').html(this.model.game.playerArray[0].purse)
      $('#right_col .purse').html(this.model.game.playerArray[1].purse)
      $('#left_col h4').html(this.model.game.playerArray[0].username)
      $('#right_col h4').html(this.model.game.playerArray[1].username)
    } 
    if (activePlayer.human === false) {
      this.model.ai.play()
    }
  },
  
  setupUser: function() {
    var name = $('div#outer form input.uname').val()
    var existing = _.find(allPlayers, function(obj) { return obj.username === name })
    if (existing != undefined) {
      tournement.setupPlayers(name, existing.purse)
    } else {
      tournement.setupPlayers(name, 50)
      allPlayers.push({username: name, purse: 50});
      $.jStorage.set("allPlayersKey", allPlayers);
    }
  },
  
  rollAction: function() {
    $('#roll').hide();
    $('#fold').show()
    this.model.game.roll();
    html = this.intToHTML(theRoll);
    $('#inner').html(html);
  },

  intToHTML: function(arr) {
    var dice = $('<div></div>')
    arr.forEach( function(x) {
      var die = $("<div class='die'></div>")
      die.addClass('_' + x)
      die.append( makePips(x) )
      dice.append( die )

      function makePips(x) {
        var starter = "<div></div>"
        if (x < 1) { return "" }
        else { return starter.concat( makePips(x-1) ); }
      }
    })
    return dice;
  },

  selectOrUnselect: function(event) {
    var die = event.currentTarget
    var val = +die.className.charAt(5)
    if($(die).hasClass('selected')) {
      $(die).removeClass('selected')
      this.model.game.unchoose(val)
      $('.green .score').html(activePlayer.score)
    } else {
      $(die).addClass('selected')
      this.model.game.choose(val)
      $('.green .score').html(activePlayer.score)
    }
    this.ableToEnd()
  },

  toggleCoins: function(event) {
    $('.green .cash_box a').each(function(index, domEle) {
      var coin = +$(domEle).html()
      if(coin > activePlayer.purse || typeof(tempKeepers) === undefined) {
        $(this).addClass('unavailable')
      }
      if(coin < activePlayer.purse) {
        $(this).removeClass('unavailable')
      }      
    });
  },

  moveKeepers: function() {
    if (typeof(tempKeepers) !== "undefined") {
      html = this.intToHTML(tempKeepers)
      $('.green .keepers').append(html)
      $('.green .score').html(activePlayer.score)
      $('#inner').html('')
    }
  },
  
  increaseBet: function(event) {
    event.preventDefault();
    var coin = +event.currentTarget.innerText
    this.model.game.betUp(coin)
    this.displayBet()
    this.ableToEnd()
  },
  
  displayBet: function() {
    $('.green .purse').html(activePlayer.purse)
    $('.green .bet').html(activePlayer.bet)
    if(activePlayer.purse < 10) {
      this.toggleCoins();
    }
  },

  ableToEnd: function() {
    if(this.model.game.isAbleToEnd() === true) {
      $('#end_turn').removeClass('unavailable');
    } else {
      $('#end_turn').addClass('unavailable')
    }
  },

  switchWhoIsActive: function() {
    if(this.model.game.playerArray[0].active === true) {
      $('#left_col').removeClass('red').addClass('green')
      $('#right_col').removeClass('green').addClass('red')
    } else if (this.model.game.playerArray[1].active === true) {
      $('#right_col').removeClass('red').addClass('green')
      $('#left_col').removeClass('green').addClass('red')
    }
  },
  
  fold: function() {
    $('#fold').hide()
    $('#sure_fold').show()
  },

  sureFold: function() {
    this.model.game.fold()
    this.model.game.isGameOver()
    this.model.endGame()
    this.winning()
  },

  clearOldHTML: function() {
    $('.green .bet, .red .bet, .green .score, .red .score').html('0')
    $('#outer h1, #outer h3 span, #left_col .keepers, #right_col .keepers').html('')
    $('#outer h1, #outer h2, #outer h3, #outer h4, #outer h5, #rematch, #new_player, #reset_scores').hide()
    $('#left_col .purse').html(this.model.game.playerArray[0].purse)
    $('#right_col .purse').html(this.model.game.playerArray[1].purse)
    $('#roll').show().removeClass('unavailable')
    $('#end_turn').show().addClass('unavailable')
  },

  winning: function() {
    $('#inner').html('')
    $('#roll, #fold, #sure_fold, #end_turn').hide()
    $('#rematch, #reset_scores, #new_player').show()
    $('#right_col, #left_col').removeClass('green').addClass('red')
    $('#left_col .purse').html(this.model.game.playerArray[0].purse)
    $('#right_col .purse').html(this.model.game.playerArray[1].purse)
    this.toggleCoins()
    if (this.model.game.isThereALeader() === false) {
      $('#outer h2, #outer h5').show()
    } else {
      $('#outer h1, #outer h3').show()
      var winner = this.model.game.isThereALeader()
      $('#outer h1').html(winner.username + ' Won')
      $('#outer h3 span').html(winnings - winner.bet)
    }
  },

  actionEndTurn: function() {
    this.moveKeepers();
    this.model.game.endTurn()
    if (this.model.game.isGameOver() === true) { 
      this.winning() 
    } else {
      if(activePlayer.remaining === 0) {
        $('#roll').hide()
        $('#fold').show().removeClass('unavailable')
      } else {
        $('#fold, #sure_fold').hide()
        $('#roll').show().removeClass('unavailable') 
      }
      $('#end_turn').addClass('unavailable')
      this.switchWhoIsActive()
      this.ableToEnd()
      if (activePlayer.human === false) {
        this.model.ai.play()
      }
    }
  },
  
  resetScore: function() {
    this.model.resetScores()
    this.newGame();
  },
  
  newPlayers: function() {
    this.clearOldHTML()
    this.model.newPlayers();
    $('#left_col h4, #right_col h4').html('Username')
    $('#left_col .purse, #right_col .purse').html('0')
    $('#rematch, #reset_scores, #new_player, #end_turn').hide()
    $('#outer form, #outer form h4, #roll, #start').show()
    $('#roll').addClass('unavailable')
    $('#left_col, #right_col').addClass('red')
  },

  newGame: function() {
    this.model.refresh()
    this.clearOldHTML()
    this.switchWhoIsActive()
    if (activePlayer.human === false) {
      this.model.ai.play()
    }
  }
});
