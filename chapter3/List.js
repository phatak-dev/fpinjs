(function ListFunctions(){
  var println = console.log;
  var _ = {
  	foldLeft : function(l,initial,fn,context) {
      if(l == null) return initial;      
      var acc = initial;
      for(var i=0,length = l.length;i<length;i++) {
        acc = fn.call(context,acc,l[i]);
      }  		
      return acc;
    },
    reverse : function(l) {
      return _.foldLeft(l,[],function(acc,e){return [e].concat(acc);});
    },
    map : function(l,fn,context) {
     return _.foldLeft(l,[],function(acc,e){acc.push(fn.call(context,e));return acc;});	
   },
   tail : function(l) {
     if(l==null || l.length==0 || l.length==1)	return l;
     else return l.slice(1,l.length);
   },
   drop : function(l,howMany) {
    if(l==null || l.length==0 || l.length==1)	return l;
    else if (l.length < howMany) return [];
    else return l.slice(howMany,l.length)	
  },
dropWhile : function(l,fn,context) {
  return _.foldLeft(l,[],function(acc,e){if(fn.call(context,e)) acc.push(e); return acc;});	
},
setHead : function(l,value) {
  return [value,_.tail(l)];
},
init : function(l) {
  if(l==null || l.length==0 || l.length==1)	return l;
  return l.slice(0,l.length-1);
},
append : function(l,k) {
  return _.foldLeft(k,l.slice(),function(acc,element) {acc.push(element);return acc;});
},
concat : function(l) {
 return _.foldLeft([],l,_.append);
},
filter : function(l,fn,context) {    	
 return _.foldLeft(l,[],function(acc,element){
  if(fn.call(context,element)) {    		  
    acc.push(element);	
  }
  return acc;
});
},
flatMap : function(l,fn,context) {
 return _.foldLeft(l,[],function(acc,element){
  var values = fn.call(context,element);
  if(values)acc.push(values);
  return acc;
});
},
    //implementing filter with flatmap
    filter_flatMap : function(l,fn,context){
      return _.flatMap(l,function(a){ if (fn(a)) return [a]; else return null;});
    },

    zipWith : function(l,r,fn,context) {
    	if(l==null || r==null) return ;
    	var length = Math.min(l.length,r.length);
    	var zipArray = [];
    	for(var i=0;i<length;i++){
    		zipArray.push(fn.call(context,l[i],r[i]));
    	}
    	return zipArray;
    },

    zipWithIndex : function(l){
    	var indexArray = _.map(l,function(element){return l.indexOf(element)});
    	return _.zipWith(l,indexArray,function(a,b){return [a,b];})
    },
    

  };
  
//main
var array = [1,2,3];
var sum = _.foldLeft(array,0,function(acc,value){return acc+value;});
println("sum using foldLeft "+sum);
var length = _.foldLeft(array,0,function(acc,value){return acc+1;});
println("sum using left "+length);
println("reverse of the array " +_.reverse(array));
println("square of the array " +_.map(array,function(value){return value*value;}));  

//test with big array
var bigArray = Array.apply(null, new Array(10000)).map(Number.prototype.valueOf,5);
//println("square of bigArray " +_.map(bigArray,function(value){return value*value;}));  
println("tail of the array is " + _.tail([1,2,3]));
println("drop of the array is " + _.drop([1,2,3],1));
println("drop of the array is " + _.drop([1,2,3],5));
println("dropWhile " + _.dropWhile([1,2,3,4],function(value){return value%2==0;}));
println("setHead"+_.setHead([1,2,3,4],7));
println("init"+_.init([1,2,3,4]));
println("init"+_.append([1,2,3,4],[5,7,7,9]));
println("concat "+_.concat([[2,3],[5,6]]));
println("filter "+_.filter([2,3,4],
	function(element){if(element%2 == 0) return true; else return false;}));

println("flatMap words "+_.flatMap(["This is first line","This is second line","This is third line"],
 function(element){
  return element.split(" ");
}));

println("filter with flat map"+_.filter_flatMap([2,3,4],
	function(element){if(element%2 == 0) return true; else return false;}));

println("zip example " + _.zipWith([1,2,3],[4,5,6],function(a,b){  
  return [a,b];
}));
println("zip example " + _.zipWith([1,2,3],[4,5,6,7,8],function(a,b){  
  return [a,b];
}));

println("zipWithIndex " + _.zipWithIndex([1,2,3]));

})();

