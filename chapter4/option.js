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
	  	bothMatch: function(pat1,pat2,str){
	  		var firstRegex = lift.mkMatcher(pat1);
	  		var secondRegex = lift.mkMatcher(pat2);       
	  		return firstRegex.flatMap(function(r1) {
	  			return secondRegex.flatMap(function(r2){  				
	  				return Some(r1(str) && r2(str));
	  			});
	  		});

	  	},

	  	map2: function(a,b,fn,context) {
	  		return a.flatMap(function(aValue){
	  			return b.flatMap(function(bValue){  	   	 	
	  				return Some(fn(aValue,bValue));	
	  			});
	  		});  	  
	  	},

	  	bothMatch_2 : function(pat1,pat2,str){
	  		return lift.map2(lift.mkMatcher(pat1),lift.mkMatcher(pat2),function(r1,r2){
	  			return r1(str) && r2(str);
	  		});
	  	},
	  	sequence : function(optionArray){
	  		var length = optionArray.length;  		
	  		var valueArray = [];
	  		for (var i=0;i<length;i++){
	  			var option = optionArray[i];
	  			if(option instanceof None) return None();  			
	  			valueArray.push(option.value);
	  		}  		
	  		return Some(valueArray);
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
	  println("regex matches abcdef? " +lift.bothMatch("abc*","def$","abcdef").getOrElse(false));
	  println("bothMatch match dce? "+lift.bothMatch("abc*","def$","dce").getOrElse(false));
	  println("bothMatch match error pattern? "+lift.bothMatch("abc*","de[","dce").getOrElse(false));

	  println("bothmatch_2 regex matches abcdef? " +lift.bothMatch_2("abc*","def$","abcdef").getOrElse(false));
	  println("bothmatch_2 match dce? "+lift.bothMatch_2("abc*","def$","dce").getOrElse(false));
	  println("bothmatch_2  match error pattern? "+lift.bothMatch_2("abc*","de[","dce").getOrElse(false));

	  println(lift.sequence([Some(5),Some(6)]).getOrElse([]));
	  println(lift.sequence([Some(5),Some(6),None()]).getOrElse([]));

	  //example of using option in hashmap
	  function HashMap(){
	  	this.values = {};
	  }
	  HashMap.prototype.put=function(key,value){
	  	this.values[key]=value
	  }
	  HashMap.prototype.get=function(key) {
	  	var value = this.values[key];
	  	if(value == null || value == undefined) return None();
	  	else return Some(value);
	  }

	  //create a hashmap
	  var customers = new HashMap();
	  customers.put('jack',100);
	  customers.put('mack',200);
	  customers.put('sack',500);

	  println("salary of mack " + customers.get('mack').getOrElse(100));
	  println("salary of fresher " + customers.get('fresher').getOrElse(100));

	})();