$(document).ready(function() {
  tournement = new models.Tournement();
  gameView = new views.Game({el: $('body'), model: tournement} );
  allPlayers = $.jStorage.get("allPlayersKey", [ {username: "Username 1", password: "Password", purse: 50}, {username: "Username 2", password: "Password", purse: 50}, {username: "Computer 1", password: "Password", purse: 50}, {username: "Computer 2", password: "Password", purse: 50} ] );
});