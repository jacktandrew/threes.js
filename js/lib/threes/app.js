$(document).ready(function(){
  // checks for a stored purse value, defaults to 50 if none found
  leftPurse = $.jStorage.get('leftPurse', 50)
  rightPurse = $.jStorage.get('rightPurse', 50)
  $('#left_col .purse').html(leftPurse)
  $('#right_col .purse').html(rightPurse)
  

  
  function choose(){
    score = parseInt($('.green .score').html())
    remaining = parseInt($('.green .remaining').html())
  
     $('.die').click(function(){    
      // if the dice is already selected it will be unselected
      if($(this).hasClass('selected')){
        $(this).removeClass('selected');
        // if you unselect your only dice, ending your turn is no longer an option
        if($('.selected').length === 0){
          $('.end_turn').addClass('unavailable')
        }
        // reduces your score by the value of the die
        value = parseInt($(this).html())
        score -= value
        $('.green .score').html(score)
        // increass your remaining by one
        remaining += 1
        $('.green .remaining').html(remaining)
      // if the dice has not been previously selected
      }else{
        $(this).addClass('selected');
        // Bet must be equal or greater to make ending turn available
        if( parseInt($('.green .bet').html()) >= parseInt($('.red .bet').html()) ){
          $('.end_turn').removeClass('unavailable');
        }
        // increases to your score by the value of the ide
        value = parseInt($(this).html())
        score += value
        $('.green .score').html(score)
        // reduces your remaining by one
        remaining -= 1
        $('.green .remaining').html(remaining)
      }
    });
  };
  


  $('.roll').live('click', function(){
    remaining = parseInt($('.green .remaining').html())
    $(this).html('Fold').removeClass('roll').addClass('fold')

    // $(this).addClass('unavailable')
    var i = 0
    html = ""
    for (i = 0; i < remaining; i++) {
      var randNum = Math.floor(Math.random()*6) + 1;
      if(randNum === 1){
        html += '<div class="die" rel="1">1<div></div></div>'
      } else if(randNum === 2){
        html += '<div class="die" rel="2">2<div></div><div></div></div>'
      } else if(randNum === 3){
        html += '<div class="die" rel="3">0<div></div><div></div><div></div></div>'
      } else if(randNum === 4){
        html += '<div class="die" rel="4">4<div></div><div></div><div></div><div></div></div>'
      } else if(randNum === 5){
        html += '<div class="die" rel="5">5<div></div><div></div><div></div><div></div><div></div></div>'
      } else if(randNum === 6){
        html += '<div class="die" rel="6">6<div></div><div></div><div></div><div></div><div></div><div></div></div>'
      }
    }
    
    $('#inner').html(html);
    choose();
  });

  $('.end_turn').click(function(){
    $(this).addClass('unavailable')
    keepers = $('.selected')
    
    $('.green .keepers').append(keepers)
    $('.die').removeClass('selected')
    keepers = ""
    $('#inner').html('');    

    $('.fold').removeClass('fold').html('Roll').addClass('roll')

    function winning(winner, loser){
      $('#outer h1, #outer h3, #new_game').show()
      $('#outer h1').prepend($(winner +' h4').html())
      $('#outer h3 span').append(parseInt($(winner + ' .bet').html()))
      $(winner + ' .purse').html(parseInt($(winner + ' .purse').html()) + parseInt($(winner + ' .bet').html()) + parseInt($(loser + ' .bet').html()))
      //$('.roll').addClass('unavailable')
      $('.roll').html('New Game').addClass('new_game').removeClass('roll')
      $('.end_turn').html('Reset Scores').removeClass('unavailable').addClass('reset_scores').removeClass('endTurn')
      
      $.jStorage.set('leftPurse', $('#left_col .purse').html())
      $.jStorage.set('rightPurse', $('#right_col .purse').html())
      
      $('.new_game').click(function(){
         window.location.reload();
      });
      
      $('.reset_scores').click(function(){
       $.jStorage.deleteKey('leftPurse')
       $.jStorage.deleteKey('rightPurse')
       window.location.reload();
      });
    };

    if($('.green .remaining').html() === '0'){
      if(parseInt($('.green .score').html()) < parseInt($('.red .score').html())){
        winning('.green', '.red');
      }
    }

    if($('.red .remaining').html() === '0'){
      if(parseInt($('.red .score').html()) < parseInt($('.green .score').html())){
        winning('.red', '.green');
      }
    }

    if($('.red .remaining').html() === '0' && $('.green .remaining').html() === '0'){
      if($('.red .score').html() === $('.green .score').html()){
        tieing();
      }
    }
    
    // if other play has dice left, switch
    if($('.red .remaining').html() != '0'){
      $('#left_col').toggleClass('green red')
      $('#right_col').toggleClass('red green')
      toggleCoins()
    }
  });
  
  function toggleCoins(){
    $('.green .cash_box a').each(function(){
      coin = parseInt($(this).html())
      purse = parseInt($('.green .purse').html())      
      if(coin > purse){
        $(this).addClass('unavailable')
      }
      if(coin < purse){
        $(this).removeClass('unavailable')
      }
    });
  };
  
  // bet up
  $('.green .cash_box a').live('click', function(){
    coin = parseInt($(this).html())
    purse = parseInt($('.green .purse').html())
    bet = parseInt($('.green .bet').html())
    standingBet = parseInt($('.red .bet').html())
    bet += coin
    purse -= coin
    $('.green .purse').html(purse)
    $('.green .bet').html(bet)
    if(bet >= standingBet && $('.selected').length > 0 ){
      $('.end_turn').removeClass('unavailable');
    }
    if(purse < 10){
      toggleCoins();
    }
  });
  
  // reset bet
  $('.purse').live('click', function(){
    purse = parseInt($('.green .purse').html())
    bet = parseInt($('.green .bet').html())
    standingBet = parseInt($('.red .bet').html())
    if(bet >= standingBet){
      purse += bet - standingBet
      bet = standingBet
    }else{
      $('.end_turn').addClass('unavailable'); 
    }
    
    $('.green .purse').html(purse)
    $('.green .bet').html(bet)

    toggleCoins();
  });
});
