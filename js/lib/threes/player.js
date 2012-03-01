var Player = Class.extend({
  init: function(name){
    this.name = name;
    this.keepers = [];
    this.score = 0;
    this.ableToEnd = false;
    this.active = false;
    this.purse = $.jStorage.get(name, 50);
    this.bet = 0;
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

  remaining: function(){
    return 5 - this.keepers.length; 
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
  }
});



