(function pureFunctions() {
	
	
	function Player(name,count) { this.name=name;this.count=count;}

	function printWinner(player) { console.log(player.name + " "+player.count); }

	function winner(p1,p2) { if ( p1.count > p2.count ) return p1; else return p2;}

	function declareWinner(p1,p2)  { printWinner(winner(p1, p2));}
	
 //main
 var sue = new Player("sue",10)
 var bob = new Player("bob",20)

 //normal usage
 declareWinner(sue,bob)

 //using es5 reduce
 var listOfPlayers = [sue,bob,new Player("some",50)];
 console.log(listOfPlayers.reduce(winner,listOfPlayers[0]).name);


})();