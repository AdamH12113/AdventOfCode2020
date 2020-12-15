import {readFileSync} from 'fs';

//The input for this one is just a short list of numbers. No point in making a separate file for it.
//const input = [0,3,6];                 //Example
const input = [1, 0, 15, 2, 10, 13];     //Input


//Part 1: Say '0' after new numbers, otherwise say the number of turns it's been since that number
//was spoken before. What's the 2020th number? Part 2 asks for the thirty millionth number, so the
//code is the same. There's probably a clever way to solve the second part (I bet there's a cycle),
//but sometimes finding a clever solution for a one-off problem is a waste of time. A better solution
//is to pick a data structure that makes memory look-ups cheap. The naive choice would be a JavaScript
//object, and that's fine for part 1, but for part 2 a Map (hash table) is a better choice.
var memory: Map<number, number> = new Map<number, number>();
var turn = 1;
const turnLimit1 = 2020;
const turnLimit2 = 30000000;

//We need all but the last number of the input to prime the pump
for (var i of input.slice(0, -1)) {
	memory.set(i, turn++);
}

var nextNum = input[input.length - 1];
while (turn < turnLimit2) {
	const memVal = memory.get(nextNum);
	if (memVal !== undefined) {
		const diff = turn - memVal;
		memory.set(nextNum, turn++);
		nextNum = diff;
	} else {
		memory.set(nextNum, turn++);
		nextNum = 0;
	}
	
	if (turn == turnLimit1) {
		console.log('Part 1: The last number was', nextNum);
	}
}

console.log('Part 2: The last number was', nextNum);
