var Player = Class.extend({
  init: function(moniker, purse){
    this.username = moniker;
    this.purse = purse;
    this.keepers = [];
    this.score = 0;
    this.folded = false;
    this.active = false;
    this.bet = 0;
    this.remaining = 5;
    this.projection = 7.5;
  },
  
  adjustBet: function(integer){
    this.bet += integer;
  },
  
  adjustPurse: function(integer){
    this.purse += integer;
  },
  
  setKeepers: function(array){
    this.keepers = array;
    this.remaining = (5 - array.length)
    this.projection = this.score + (1.5 * this.remaining);
  },
  
  getKeepers: function(){
    return this.keepers;
  },
  
  adjustScore: function(integer){
    if (integer === 3 || integer === -3) { integer = 0 }              // idiosyncrasy of the game :)
    this.score += integer;
  }
});



