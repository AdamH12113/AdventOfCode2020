//There's no input file this time -- just a sequence of numbers.
const input = [3, 8, 9, 1, 2, 5, 4, 6, 7];    //Example
//const input = [1, 9, 3, 4, 6, 7, 2, 5, 8];  //Puzzle

function move(cups: number[]): number[] {
	const minLabel = 1;
	const maxLabel = cups.length;
	
	//Pick up the three cups clockwise from the current cup
	const cwCups = cups.splice(1, 3);
	
	//Use the current cup's label as the destination, counting down until a valid cup is found
	var dest = (cups[0] == minLabel) ? maxLabel : cups[0] - 1;
	while (cwCups.includes(dest)) {
		dest--;
		if (dest < minLabel)
			dest = maxLabel;
	}
	
	//Insert the three cups after the destination cup.
	cups.splice(cups.indexOf(dest) + 1, 0, ...cwCups);
	
	//Select the cup clockwise from the current cup as the new current cup
	return [...cups.slice(1), cups[0]];
}


//Part 1: What are the labels on the cups after cup 1, moving clockwise?
var myCups = [...input];
for (var m = 0; m < 100; m++) {
	myCups = move(myCups);
}
const oneIndex = myCups.indexOf(1);
const part1Cups = [...myCups.slice(oneIndex), ...myCups.slice(0, oneIndex)];
console.log('Part 1: The order of the cups after 1 is', part1Cups.slice(1).join(''));


//Part 2: Now there are a million cups. After the labels from part 1, the labels count upward in
//order starting from one plus the largest label. There are ten million moves.
var lotsaCups = Array.from(Array(1000).keys()).map(n => n + 1);
for (var i = 0; i < input.length; i++) {
	lotsaCups[i] = input[i];
}

for (var m = 0; m < 10000000; m++) {
	lotsaCups = move(lotsaCups);
	const oneIndex = lotsaCups.indexOf(1);
	console.log('ONE', oneIndex, lotsaCups[(oneIndex+1) % lotsaCups.length], lotsaCups[(oneIndex+2) % lotsaCups.length]);
	if (m % 1000 == 0)
		console.log('Move', m);
}

const oneIndex2 = lotsaCups.indexOf(1);
const firstCup = lotsaCups[(oneIndex2 + 1) % lotsaCups.length];
const secondCup = lotsaCups[(oneIndex2 + 2) % lotsaCups.length];
console.log('Part 2: The two cups are', firstCup, 'and', secondCup, 'and their product is', firstCup*secondCup);

