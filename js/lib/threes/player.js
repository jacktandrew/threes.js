var Player = Class.extend({
  init: function(moniker, purse){
    this.moniker = moniker;
    this.purse = purse;
    this.idxNum = 0;
    this.keepers = [];
    this.score = 0;
    this.ableToEnd = false;
    this.folded = false;
    this.active = false;
    this.bet = 0;
    this.remaining = 5 - this.keepers.length;
    this.projection = this.score + (1.5 * (5 - this.keepers.length));
  },
  
  getBet: function(){
    return this.bet;
  },
  
  adjustBet: function(integer){
    this.bet += integer;
  },

  getPurse: function(){
    return this.purse;
  },
  
  adjustPurse: function(integer){
    this.purse += integer;
  },
  
  setKeepers: function(array){
    this.keepers = array;
  },
  
  getKeepers: function(){
    return this.keepers;
  },
  
  setScore: function(integer){
    this.score = integer;
  },
  
  getScore: function(){
    return this.score;
  },
  
  setProjection: function(array){
    this.projection = this.score + (1.5 * (5 - this.keepers.length))
  }
});



