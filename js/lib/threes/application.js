var Game = Class.extend({
  init: function(){
  },
  
  remaining: function(){
    var remaining = 5;
    return remaining
  },
  
  pushKeepers: function(array){
    keepers = array;
    return keepers
  },
  
  pullKeepers: function(){
    return keepers
  },
  
  roll: function(){
    remaining = game.remaining();
    theRoll = [];
    for (i = 0; i < remaining; i++) {
      var randNum = Math.floor(Math.random()*6) + 1;
      theRoll.push(randNum)
    }
    return theRoll
  },
  
  choose: function(theChoice){
    if(typeof(keepers) === "undefined"){
      keepers = [];
    } else {
      keepers = game.pullKeepers();
    }
    keepers.push(theChoice);
    game.pushKeepers(keepers);
    console.log(game.pullKeepers());
  },
  
  unchoose: function(theChoice){
    keepers = game.pullKeepers();
    var idx = keepers.indexOf(theChoice); // Find the index
    if(idx!=-1) keepers.splice(idx, 1); // Remove it if really found!
    game.pushKeepers(keepers);
    console.log(game.pullKeepers());
  }
});