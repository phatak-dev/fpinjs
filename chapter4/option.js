(function optionUses(){
	var println = console.log;
	function Option() {

	}
	Option.prototype = {
		map:function(fn,context){
			if(this instanceof None) return this;
			else return new Some(fn.call(context,this.value));
		},
		getOrElse : function(defaultValue) {
			if(this instanceof None) return defaultValue;
			else return this.value;	
		},
		flatMap : function(fn,context){
			return this.map(fn,context).getOrElse(None());
		},
		orElse : function(fn,context){
			return this.map(function(value){ return new Some(value);}).getOrElse(fn.call(context));
		}
	}

    
    

	function None() {				
	  if (None.prototype._singletonInstance ) {
          return None.prototype._singletonInstance;
       }
      if(!(this instanceof None)) { return new None();}
      None.prototype._singletonInstance = this;
      this.toString = function(){return "None";}
	}
    
    
	None.prototype = new Option();
	


	function Some(value) {
		if(!(this instanceof Some)) { return new Some(value);}
		this.value = value;
		this.toString = function() { return "Some(" + value+")"}
	}

	Some.prototype = new Option();


  //lift option
  var lift = {
  	pattern :function (string) {
  		try {
  			var pattern = new RegExp(string);
  			return Some(pattern);
  		}
  		catch(e){
  			println("###logging"+e);
  			return None();
  		}
  	},

  	mkMatcher:function(pat) {
  		return lift.pattern(pat).map(function(pattern){
  			return function(value){
  				return pattern.test(value);
  			}
  		});
  	},
  	bothMatch: function(pat1,pat2){
  		var firstRegex = lift.mkMatcher(pat1);
  		var secondRegex = lift.mkMatcher(pat2);       
  		return firstRegex.flatMap(function(r1) {
  			return secondRegex.flatMap(function(r2){
  				var fn = function(value)	{
  					return r1(value) && r2(value);
  				};
  				return Some(fn);
  			});
  		});

  	}

  }



  //main
  var someOption = Some(10);
  println("square the option " + someOption.map(function(value){  	
  	return value*2;}));
  println("map of none is " +  None().map(function(value){value*2}));
  println("getOrElse of Some "+ someOption.getOrElse(10))
  println("getOrElse of None "+ None().getOrElse(5))
  //using flatmap to chain validation
  function validCustomerId(value){
  	if(value > 100) return Some(value);else return None();
  }
  function getCustomerFromDatabase(value){
  	println("searching in database for " + value)
  	if(value ==101 || value == 102) return Some("chang"); else return None();
  }

  println("customer name for 110 " +  Some(110).flatMap(validCustomerId).
  	flatMap(getCustomerFromDatabase).getOrElse("not a valid customer"));
  println("customer name for 101 " + Some(101).flatMap(validCustomerId).
  	flatMap(getCustomerFromDatabase).getOrElse("not a valid customer"));
  println("customer name for 10 " + Some(10).flatMap(validCustomerId).
  	flatMap(getCustomerFromDatabase).getOrElse("not a valid customer"));
  
  println("orElse " + None().orElse(function(){ return Some(20);}));

  //chaining functions to check
  function isPositive(value){
  	if(value>0) return Some(value); else return  None();
  }
  function isZero(){  	
  	return Some(0);
  }

  println("do we have right number otherwise try to generate "+isPositive(-10).orElse(isZero));
  println("do we have right number otherwise try to generate "+isPositive(20).orElse(isZero));

  //lift examples

  var regex = lift.mkMatcher("abc*");
  var matched = regex.map(function(fn){return fn.call(null,"abc")});
  println("matched "+matched.getOrElse(false));

  //create regex with issue
  var regex = lift.mkMatcher("ab[");
  var matched = regex.map(function(fn){return fn.call(null,"abc")});
  println("matched "+matched.getOrElse(false));

  //two regex match
  var doubleRegex = lift.bothMatch("abc*","def$");
  println("double match "+doubleRegex.map(
  	function(fn){return fn.call(null,"abcdef")}));
  println("double match "+doubleRegex.map(
  	function(fn){return fn.call(null,"abcdf")}));

  println("error patterns match? " +lift.bothMatch("abc*","de[").map(
    function(fn){ return fn.call(null,"abcdef")}).getOrElse(false));




})();