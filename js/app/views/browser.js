$(document).ready(function() {
  tournement = new Tournement();
  gameView = new views.Game({el: $('body'), model: tournement} );
  allPlayers = $.jStorage.get("allPlayersKey", [ {username: "Username1", password: "Password", purse: 50}, {username: "Username2", password: "Password", purse: 50}, {username: "Computer 1", password: "Password", purse: 50}, {username: "Computer 2", password: "Password", purse: 50} ] );
});

function isHuman(e){
  $(e + ' .uname, ' + e + ' .pword').removeClass('red')
}

function isCPU(e){
  $(e + ' .pword2').css('visibility', 'hidden');
  $(e + ' .newuser').attr('checked', false);
  $(e + ' .uname, ' + e + ' .pword').addClass('red')
}

function reveal(e){
  $(e + ' .pword2').css('visibility', 'visible');
  $(e + ' .cpu').attr('checked', false);
  $(e + ' .uname, ' + e + ' .pword').removeClass('red')
}

function conceal(e){
  $(e + ' .pword2').css('visibility', 'hidden');
}
