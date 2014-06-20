	(function EitherUses(){
		var println = console.log;
		function Either(e,a){
			if(!(this instanceof Either)) return new Either(e,a);
			this.left = e;
			this.right = a;
		}
		function Left(value){
			if(!(this instanceof Left)) return new Left(value);
			this.either = new Either(value,null);	
			this.toString = function(){return "Left("+value+")"};		
		}
        Left.prototype = new Either();

		function Right(value){
			if(!(this instanceof Right)) return new Right(value);
			this.either=Either(null,value);
			this.toString = function(){return "Right("+value+")"};		
		}
		Right.prototype = new Either();

		Either.prototype.map = function(fn,context){
		  if(this instanceof Left) return this;
		  return Right(fn.call(context,this.either.right));
		}
		Either.prototype.flatMap = function(fn,context){
			if(this instanceof Left) return this;
			return fn.call(context,this.either.right);
		}

		Either.prototype.orElse = function(fn,context) {
			if(this instanceof Left) return fn.call(context);
			return this;
		}

		Either.prototype.map2 = function(b,fn,context){
			if(this instanceof Left) return this;
			var rightValue = this.either.right;
			return b.map(function(value){
               return fn.call(context,rightValue,value);
			});
		}


        



		function mean(array) {
			if(array==null || array.length ==0)
				return Left("mean of empty list");
			else
				var sum = 0;
			for(var i=0;i<array.length;i++){
				sum += array[i];
			}

			return Right( sum / array.length);

		}

		function safeDiv(x,y) {
			try{
				if(y==0) 
					throw("divide by zero error");
				else return Right(x/y);              			  
			}
			catch(e){		
				return Left(e);
			}
		}
		

     //main
     println("mean of the empty array "+mean([]));
     println("mean of the normal array "+mean([1,2]));
     println("div by zero "+safeDiv(4,0));

    println(safeDiv(5,0).map(function(value){return value*2;}).toString());
    println(safeDiv(5,1).map(function(value){return value*2;}).toString());

    println(safeDiv(5,0).orElse(function(){
     return Right(10);
    }).orElse(function(){return Right(3);}).toString());

    //Person example
    function Person(name,age) {
    	this.name = name;
    	this.age = age;
    	this.toString = function(){ return "name:"+name+" age:"+age ;}
    }

    function mkName(name) {
    	if(name=="" || name==null) return Left("name cannot be empty");
        return Right(name);
    }

    function mkAge(age) {
    	if(age <0) return Left("age is out of range");
        return Right(age);
    }

    function mkPerson(name,age) {
    	return mkName(name).map2(mkAge(age),function(n,a){
    		return new Person(n,a);
    	});
    }

    println("mkPerson " +mkPerson("test",20));
    println("mkPerson negative age " +mkPerson("test",-2));
    println("mkPerson null name " +mkPerson(null,2));

 })();