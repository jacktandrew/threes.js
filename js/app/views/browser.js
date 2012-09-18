$(document).ready(function() {
  tournement = new Tournement();
  gameView = new views.Game({el: $('body'), model: tournement} );
  allPlayers = $.jStorage.get("allPlayersKey", [ {username: "Art Intel", purse: 50} ] );
});