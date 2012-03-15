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



