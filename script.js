$(document).ready(function(){

  $("#game").hide();
  
});

var userNumber = [];
var pcNumber = [];
var firstPCguess = true;
var currPCguess=0;
var currScore = [];
var S = [];
var All = [];

function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function checkBullsAndCows(guess, number){
	var count = {bulls:0, cows:0};
	
	for (var i = 0; i < number.length; i++){
		if(guess[i] == number[i]){
			count.bulls++;
		}else if(number.indexOf(parseInt(guess[i])) > -1){
			count.cows++;
		}
	}
	return count;
}

function gameOver(winner){
	document.getElementById("tryNumber").style.visibility="hidden";
	document.getElementById("pcSecretNumber").innerHTML=pcNumber[0]+" "+pcNumber[1]+" "+pcNumber[2]+" "+pcNumber[3];
	document.getElementById("winner").innerHTML = "Winner: "+winner+"!";
}

function generateS(){
	var num1 = [];
	var num2;
	for(var i=1; i<10; i++)
		for(j=0; j<10; j++){
			if(j != i)
				for(var n=0; n<10; n++){
					if(n != j && n != i)
						for(var m=0; m<10; m++)
							if(m != n && m != j && m != i){
								num1 = [parseInt(i), parseInt(j), parseInt(n), parseInt(m)];
								num2 = i*1000 + j*100 + n*10 + m;
								S.push(num1);
								All.push(num2);
							}
				}
		}
}

function nGuess(){
	
	var index = All.indexOf(currPCguess);
	All.splice(index, 1);
	
	var Pegs = [{bulls:0, cows:0}, {bulls:0, cows:1}, {bulls:0, cows:2}, {bulls:0, cows:3}, {bulls:0, cows:4},
				{bulls:1, cows:0}, {bulls:1, cows:1}, {bulls:1, cows:2}, {bulls:1, cows:3},
				{bulls:2, cows:0}, {bulls:2, cows:1}, {bulls:2, cows:2},
				{bulls:3, cows:0},
				{bulls:4, cows:0}];
	
	var min = 1000000000;
	var result = [0,0,0,0];
		
		for(var i=0; i<All.length; i++){
			var n4 = All[i] % 10;
			var n3 = ((All[i] - n4)/10) % 10;
			var n2 = ((((All[i] - n4)/10) - n3)/10) % 10;
			var n1 = (((((All[i] - n4)/10) - n3)/10) - n2)/10;
			
			var temp = [n1, n2, n3, n4];
			
			var max = 0;
			
			for(var p=0; p<Pegs.length; p++){
				var broi=0;
				
				for(var j=0; j<S.length; j++){
					
					var res = checkBullsAndCows(S[j], temp);
					
					if(parseInt(res.bulls) == parseInt(Pegs[p].bulls) && parseInt(res.cows) == parseInt(Pegs[p].cows)){
						broi++;
					}
				}
				if (broi > max){
					max = broi;
				}
			}
			if(max < min) { 
				min = max; 
				result[0] = temp[0];
				result[1] = temp[1];
				result[2] = temp[2];
				result[3] = temp[3];
			}
			
		}
		if (S.length <= 2){
			return S[0];
		}else{
		return result;
		}
}

function pcGuess(){
	
	var guess2 = [];
	
	if(firstPCguess){
		generateS();
		
		var n5 = parseInt(randomIntFromInterval(1,9));
		var n6 = parseInt(randomIntFromInterval(0,9));
		var n7 = parseInt(randomIntFromInterval(0,9));
		var n8 = parseInt(randomIntFromInterval(0,9));
		
		guess2 = [n5, n6, n7, n8];
		
		while(guess2[1] == guess2[0]){
			guess2[1] = parseInt(randomIntFromInterval(0,9));
		}
		while(guess2[2] == guess2[0] || guess2[2] == guess2[1]){
			guess2[2] = parseInt(randomIntFromInterval(0,9));
		}
		while(guess2[3] == guess2[0] || guess2[3] == guess2[1] || guess2[3] == guess2[2]){
			guess2[3] = parseInt(randomIntFromInterval(0,9));
		}
		
		firstPCguess = false;
	}else {
		guess2 = nGuess();
	}
	
	var result2 = checkBullsAndCows(guess2, userNumber);
	
	currPCguess = guess2[0]*1000 + guess2[1]*100 + guess2[2]*10 + guess2[3];
	
	currScore = [result2.bulls, result2.cows];
	
	var tryNum = document.getElementById("pcGuesses");
	var currNum = document.createElement("span");
	currNum.innerHTML = guess2[0]+" "+guess2[1]+" "+guess2[2]+" "+guess2[3]+" -> Bulls: "+result2.bulls+", Cows: "+result2.cows+";<br>";
	tryNum.appendChild(currNum);
	
	if(result2.bulls == 4){
		gameOver("Computer");
	}else{
		var arr = [] ;
		for(var i=0; i<S.length; i++){
			
			var res = checkBullsAndCows(S[i], guess2);
			
			if(parseInt(res.bulls) == parseInt(result2.bulls) && parseInt(res.cows) == parseInt(result2.cows)){
				arr.push(S[i]);
			}
		}
		S = arr;
		
		document.getElementById("tryNumber").style.visibility="visible";
		
	}
}

function userGuess(){
	var guess1 =[];
	
	var n1 = parseInt(document.getElementById("userN1").value);
	var n2 = parseInt(document.getElementById("userN2").value);
	var n3 = parseInt(document.getElementById("userN3").value);
	var n4 = parseInt(document.getElementById("userN4").value);
	
	guess1 = [n1, n2, n3, n4];
	
	var result = checkBullsAndCows(guess1, pcNumber);
	
	var tryNum = document.getElementById("userGuesses");
	var currNum = document.createElement("span");
	currNum.innerHTML = guess1[0]+" "+guess1[1]+" "+guess1[2]+" "+guess1[3]+" -> Bulls: "+result.bulls+", Cows: "+result.cows+";<br>";
	tryNum.appendChild(currNum);
	
	if(result.bulls == 4){
		
		gameOver("You");
	}else{
		document.getElementById("tryNumber").style.visibility="hidden";
		pcGuess();
	}
	
	
}



function setPcNumber(){
	var n5 = parseInt(randomIntFromInterval(1,9));
	var n6 = parseInt(randomIntFromInterval(0,9));
	var n7 = parseInt(randomIntFromInterval(0,9));
	var n8 = parseInt(randomIntFromInterval(0,9));
	
	pcNumber = [n5, n6, n7, n8];
	
	while(pcNumber[1] == pcNumber[0]){
		pcNumber[1] = parseInt(randomIntFromInterval(0,9));
	}
	while(pcNumber[2] == pcNumber[0] || pcNumber[2] == pcNumber[1]){
		pcNumber[2] = parseInt(randomIntFromInterval(0,9));
	}
	while(pcNumber[3] == pcNumber[0] || pcNumber[3] == pcNumber[1] || pcNumber[3] == pcNumber[2]){
		pcNumber[3] = parseInt(randomIntFromInterval(0,9));
	}
	
	
}

function setUserNumber(){
	var n1 = parseInt(document.getElementById("putN1").value);
	var n2 = parseInt(document.getElementById("putN2").value);
	var n3 = parseInt(document.getElementById("putN3").value);
	var n4 = parseInt(document.getElementById("putN4").value);
	
	userNumber = [n1, n2, n3, n4];
	
	var flag = false;
	
	for(var i=1; i<userNumber.length; i++){
		for(var j=0; j<i; j++){
			if(userNumber[i] == userNumber[j]) flag = true;
		}
	}
	
	if(flag){
		document.getElementById("msg").innerHTML = "Your number should not contain duplicate digits!";
	}
	else{
		document.getElementById("userSecretNumber").innerHTML=n1+" "+n2+" "+n3+" "+n4;
		
		setPcNumber();
			
		$("#setNumber").hide();
		$("#game").show();
	}
}


