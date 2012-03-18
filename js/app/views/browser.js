// $(document).ready(function() {
  var tournement = new models.Tournement();
  var gameView = new views.Game({el: $('body'), model: tournement} );
  var allPlayers = $.jStorage.get("allPlayersKey", [ {username: "Username 1", password: "Password", purse: 50}, {username: "Username 2", password: "Password", purse: 50}, {username: "Computer 1", password: "Password", purse: 50}, {username: "Computer 2", password: "Password", purse: 50} ] );
// });