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
