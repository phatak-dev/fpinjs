(function PolymorphicFunctions(){
	var println = console.log;

	function isSorted(array,gt,context) {
		function matchList(array) { 
			if(array==null) return true;
			var length = array.length;        
			for(var i=0;i<length;i++){
				var first = array[i];
				var second = array[i+1];
				if(first==undefined || second==undefined) return true;
				if(!gt.call(context,first,second)) return false;
			}     
		}
		return matchList(array);
	}

  //partial functions
  function partial1(a, fn) {
  	return function(b) {
  		return fn(a,b);
  	}
  }

  function curry(fn) {
  	return function(a) { return function(b) { return fn(a,b);}}
  }

  function uncurry(fn) {
  	return function(a,b) { return fn(a)(b);}
  }

  function compose(f,g) {
  	return function(a) { return f(g(a));}
  }



  //main method 
  console.log(isSorted([1,4,5],function gt(a,b) { return a < b}));
  console.log(isSorted([1,4,5],function gt(a,b) { return a > b}));

  //partial sum
  var sumFunction  = function(a,b){ return a+b };
  var partialSum = partial1(5,sumFunction);
  println(partialSum(10))
  println(partialSum(35))

  //curry
  var currySum = curry(sumFunction);
  println(currySum(10)(20));
  println(currySum(80)(200));

  //uncurry the sum function
  var uncurrySum = uncurry(currySum);
  println(uncurrySum(10,20));

  //compose
  var f = function(x){return Math.PI / 2 - x; }
  var cos = compose(Math.sin,f);
  println(cos(0));

})();