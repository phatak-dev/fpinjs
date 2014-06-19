(function TreeFunctions(){
	var println = console.log;
	function Tree(){
	}

	Tree.prototype= { 			
		size :function(){ 	
			if(this instanceof Leaf) return 1;
			else { 			
				var leftTree = this.leftTree;
				var rightTree = this.rightTree; 			
				return 1 + leftTree.size() + rightTree.size();
			}
		},
		maximum : function() {
			if(this instanceof Leaf) {return this.value;}
			else return Math.max(this.leftTree.maximum(),this.rightTree.maximum());
		},
		map : function(fn,context) {
			if(this instanceof Leaf) {return new Leaf(fn(this.value));}
			else return new Branch(this.leftTree.map(fn,context),this.rightTree.map(fn,context));
		},
		depth : function() {
			if(this instanceof Leaf) return 0;
			else return 1 + Math.max(this.leftTree.depth(),this.rightTree.depth());
		},
		fold : function(f,g) {
			if(this instanceof Leaf) return f(this.value);
            else return g(this.leftTree.fold(f,g),this.rightTree.fold(f,g));
		}

	}

	function Leaf(value){ 	
		this.value = value;   
	}
	Leaf.prototype = new Tree();

	function Branch(leftTree,rightTree){ 	
		this.leftTree = leftTree;
		this.rightTree = rightTree; 	 	
	}
	Branch.prototype = new Tree();
	

 //main
 var simpleTree = new Leaf(10);
 var complexTree = new Branch(new Leaf(10),new Branch(new Leaf(20),new Leaf(30)));
 println("size of simple tree is "+ simpleTree.size());
 println("size of complexTree is "+complexTree.size());
 println("max is complexTree is " + complexTree.maximum());
 println("max of square tree of  complexTree is " + complexTree.map(
 	function(value){return value*2;}).maximum());
 println("depth of complexTree is "+ complexTree.depth());
 println("max is using fold for complexTree is " + complexTree.fold(function(value){
   return value;
 },function(a,b){
    return Math.max(a,b);
 }));
 println("max is using fold for squared complexTree is " + complexTree.fold(function(value){
   return value*2;
 },function(a,b){
    return Math.max(a,b);
 }));


})();