var Game = Class.extend({
  init: function(){
  },
  
  roll: function(){
    remaining = gamemodel.remaining();
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
      keepers = gamemodel.pullKeepers();
    }
    keepers.push(theChoice);
    gamemodel.pushKeepers(keepers);
    console.log(gamemodel.pullKeepers());
  },
  
  unchoose: function(theChoice){
    keepers = gamemodel.pullKeepers();
    var idx = keepers.indexOf(theChoice); // Find the index
    if(idx!=-1) keepers.splice(idx, 1); // Remove it if really found!
    gamemodel.pushKeepers(keepers);
    console.log(gamemodel.pullKeepers());
  },
  
  endTurn: function(){
    
  }
});