window.views = window.views || {}
views.Game = Backbone.View.extend({
  
  initialize: function() {
    _.bindAll(this)
  },

  events: {
    "click #start":               "startGame", 
    "click #roll":                "rollAction",
    "click .die":                 "selectOrUnselect",
    "click #fold":                "fold",
    "click #sure_fold":           "sureFold",
    "click #new_game":            "newGame",
    "click #reset_scores":        "resetScore",
    "click .green .cash_box a":   "increaseBet",
    "click #end_turn":            "actionEndTurn"
  },

  render: function() {
    
  },
  
  startGame: function(){
    this.verifyUser('#p1')
    this.verifyUser('#p2')
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
    } else {
      // console.log('one or more users was not verified')
      alert('You entered bogus information, not cool dude, not cool...')
    }
    if (activePlayer.human === false) {
      this.model.ai.play()
    }
  },
  
  verifyUser: function(e) {
    moniker = $( e + ' .uname').attr('value');
    password = $( e + ' .pword').attr('value');
    password2 = $( e + ' .pword2').attr('value');
    if($(e + ' .cpu').attr('checked') === "checked" ) {
      number = e.charAt(2)
      this.model.setupPlayers('Computer ' + number, 50, false)
    } else {
      if($(e + ' .newuser').attr('checked') === "checked") {
        this.model.verifyNewUser(moniker, password, password2);
      } else {
        this.model.verifyExistingUser(moniker, password);
      }
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
    var html = ""
    arr.forEach( function(x) {
      if (x === 1) { html += '<div class="die 1" rel="1"><div></div></div>' } 
      else if (x === 2) { html += '<div class="die 2" rel="2"><div></div><div></div></div>' } 
      else if (x === 3) { html += '<div class="die 3" rel="3"><div></div><div></div><div></div></div>' } 
      else if (x === 4) { html += '<div class="die 4" rel="4"><div></div><div></div><div></div><div></div></div>' } 
      else if (x === 5) { html += '<div class="die 5" rel="5"><div></div><div></div><div></div><div></div><div></div></div>' } 
      else if (x === 6) { html += '<div class="die 6" rel="6"><div></div><div></div><div></div><div></div><div></div><div></div></div>' }
    })
    return html;
  },

  selectOrUnselect: function(event) {
    var die = event.currentTarget
    var val = +die.className.charAt(4)
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
    } else if(this.model.game.playerArray[1].active === true) {
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
    $('#outer h1, #outer h2, #outer h3, #outer h4, #outer h5, #new_game, #reset_scores').hide()
    $('#left_col .purse').html(game.playerArray[0].purse)
    $('#right_col .purse').html(game.playerArray[1].purse)
    $('#roll').show().removeClass('unavailable')
    $('#end_turn').show().addClass('unavailable')
  },

  winning: function() {
    $('#inner').html('')
    $('#roll, #fold, #sure_fold, #end_turn').hide()
    $('#new_game, #reset_scores').show()
    $('#left_col .purse').html(this.model.game.playerArray[0].purse)
    $('#right_col .purse').html(this.model.game.playerArray[1].purse)
    if (this.model.game.isThereALeader() === false) {
      $('#outer h2, #outer h5').show()
    } else {
      $('#outer h1, #outer h3').show()
      var winner = this.model.game.isThereALeader()
      $('#outer h1').html(winner.username + ' Won')
      $('#outer h3 span').html(this.model.winnings - winner.bet)
    }
  },

  actionEndTurn: function() {
    this.moveKeepers();
    this.model.game.endTurn()
    if (this.model.game.isGameOver() === true) { 
      this.winning() 
    } else {
      $('#fold, #sure_fold').hide()
      $('#roll').show()
      if(activePlayer.remaining === 0) { 
        $('#roll').addClass('unavailable') 
      } else { 
        $('#roll').removeClass('unavailable') 
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

  newGame: function() {
    this.model.refresh()
    this.clearOldHTML()
    this.switchWhoIsActive()
    if (activePlayer.human === false) {
      this.model.ai.play()
    }
  }
});
