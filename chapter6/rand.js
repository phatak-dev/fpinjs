(function randomNumberGenerator(){
  var println = console.log;
  function RNG() {   
  }

   RNG.prototype = {
  	positiveInt : function (){
  	var values  = this.nextInt();
  	var randomValue = 0;
  	if ( values._1 < 0) randomValue = -(values._1); else randomValue = values._1;
  	var nextRNG = values._2;
    return {'_1':randomValue,'_2':nextRNG};
    },
     double : function() {
      var random = this.positiveInt();
      return {'_1': (random._1 / (Number.MAX_VALUE+1)),'_2':random._2}
    },
    intDouble : function() {
      var first = this.positiveInt();
      var second = first._2.double();
      return {'_1':{'_1':first._1,'_2':second._1},'_2':second._2}; 	
    },
    ints : function(count) {    
      var randomList = [];      
      var newRNG = this;
      for(var i =0;i<count;i++){
        var newValue = newRNG.positiveInt();
        randomList.push(newValue._1);
        newRNG = newValue._2;
      }
      return randomList;
    }
  }
  
  function Simple(seed) {
    this.nextInt = function() {      
      var newSeed = (seed * 0x5DEECE66D + 0xBF ) & 0xFFFFFFFFFFFF;
      var nextRNG = new Simple(newSeed);
      var n = newSeed >>> 16 | 0;
      return { '_1':n ,'_2':nextRNG}
    }

  }
  Simple.prototype = new RNG();

  function randomPair(rng)  {
  	var first = rng.nextInt();
  	var second = first._2.nextInt();
  	return {'_1':{'_1':first._1,'_2':second._1},'_2':second._2};
  }

  
  var rng = new Simple(10);
  println(rng.nextInt()._1);
  println(rng.nextInt()._2.nextInt()._1);
  println(randomPair(rng)._1);  
  println(new Simple(20).positiveInt()._1);
  println(new Simple(30).double()._1);  
  println(new Simple(40).intDouble()._1);  
  println(new Simple(50).ints(10));

})()