(function streamExamples(){
 var println = console.log;
 function Stream(head,tail)	{
     
 } 

 Stream.prototype = {
 	toList : function() {
 		if(this instanceof Empty) return [];
 		else 
 		{ 			
 			return [this.h()].concat(this.t().toList());
 		} 		
 	},
 	take : function(n) {
      if(n>0) {      	
      	if(this instanceof Empty) thisStream;
      	else {      		
      		var head = this.h;
      		var tail = this.t;
      		return new Cons(head,
      		function(){return tail().take(n-1)});
      	}
      }
      else
      	return new Empty();
 	},
 	foldRight : function(initialValue,fn,context){
 		if(this instanceof Empty) return initialValue;
 		else { 			
 			var thisStream = this;
 			return fn.call(context,this.h(),
 				function(){return thisStream.t().foldRight(initialValue,fn,context)});
 		}
 	},

 	map : function(fn,context){
 		return this.foldRight(new Empty(),(function(value,t){
 			return new Cons(fn.call(context,value),t);
 		}))
 	},
 	filter : function(fn,context) {
 		return this.foldRight(new Empty(),(function(value,t){
           if(fn.call(context,value)) return new Cons(value,t); else return t();
 		}))
 	},
 	exists : function(fn,context) {
 		return this.foldRight(true,function(value,t){ 		  
 		  return fn.call(context,value) || t();
 		});
 	},
 	forAll : function(fn,context){
 	  return this.foldRight(true,function(value,t){ 		  
 		  return fn.call(context,value) && t();
 		});	
 	},
 	zip : function(stream) {
 		if(this instanceof Empty || stream instanceof Empty) return new Empty();
 		var h1 = this.h;
 		var h2 = stream.h;
 		var t1 = this.t;
 		var t2 = stream.t;        
 		return new Cons({"_1":h1(),"_2":h2()},function(){return t1().zip(t2());});
 	},
 	unfold : function(initialValue,fn,context) {
 		
 	}


 }

 Stream.constant = function(value) {
 		return new Cons(value,function(){return Stream.constant(value);});
 }
 Stream.from = function(startValue) {
 	return new Cons(startValue,function(){return Stream.from(startValue+1)});
 }
 Stream.fibs = function() {
 	function fibGen(first,second) {
 		return new Cons(first,function(){ return fibGen(second,first+second);});
 	}
 	return fibGen(0,1);
 }


 function Empty(){

 }
 Empty.prototype = new Stream();
 function Cons(h,t){
 	var hValue,tValue;
 	if(h instanceof Function) hValue = h; else hValue = function(){return h;}
    if(t instanceof Function) tValue = t; else tValue = function(){return t;}    
    //rewrite functions to evaluate once
    this.h = function() {
    	var returnValue = hValue();
    	this.h = function() { return returnValue;}
    	return returnValue;
    }
    this.t = function() {
    	var returnValue = tValue();    	
    	this.t = function() { return returnValue;}
    	return returnValue;
    }

 }
 Cons.prototype = new Stream();

 

 //main program
var emptyStream = new Empty();
println(emptyStream.toList());

//
var firstStream = new Cons(function(){return 1;},function(){return emptyStream});
var newStream = new Cons(function(){println("hello");return 2;},function(){
	return firstStream});
println(newStream.toList());
var numberStream =  new Cons(function(){println("five");return 5}, 
	new Cons(function(){println("six");return 6}, 
	new Cons(function(){println("seven");return 7},new Cons(function(){println("seven");return 8}, 
		function(){return emptyStream}))));

var take2 = numberStream.take(3);
var mapped = take2.map(function(value){ return value*5;});
var mapAgain = mapped.map(function(value){return value*6;});
var filtered = mapped.filter(function(value){ return value%2==0;});
println(mapped.toList());
println(mapAgain.toList());
println(take2.toList());
println(filtered.toList());


//infinite streams 
var makeOnes = function() {
   return new Cons( 1, makeOnes);    
};
println(makeOnes().take(10).toList());
println(makeOnes().map(function(value){return value+1}).take(7).toList());


//use constant
println(Stream.constant(5).map(function(value){return value*5;}).take(7).toList());
println(Stream.from(1).take(20).toList());

//Fibonacci numbers
println(Stream.fibs().take(10).toList());
//check whether given number is there
println(Stream.fibs().exists(function(value){ return value==34;}));
println(Stream.fibs().forAll(function(value){ return value%2==0;}));

var zipped = makeOnes().zip(Stream.fibs());
println(zipped.take(5).toList());







})();	