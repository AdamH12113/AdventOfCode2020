//There's no input file this time -- just a sequence of numbers.
//const input = [3, 8, 9, 1, 2, 5, 4, 6, 7];    //Example
const input = [1, 9, 3, 4, 6, 7, 2, 5, 8];  //Puzzle

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
//order starting from one plus the largest label. There are ten million moves. Clearly we cannot
//brute-force this. After spending some time looking for patterns in the shifting of the starting
//numbers, I am ashamed to admit that I sought out hints online. Storing the successor of each
//number instead of an ordered list of numbers allows for minimal updates during each cycle.
//Should've thought of that myself...
var cupSuccessors: Map<number, number> = new Map();
for (var c = 0; c < input.length - 1; c++) {
	cupSuccessors.set(input[c], input[c+1]);
}
cupSuccessors.set(input[input.length - 1], input.length + 1);
for (var c = input.length + 1; c < 1000000; c++) {
	cupSuccessors.set(c, c + 1);
}
cupSuccessors.set(1000000, input[0]);

function moveSuccessors(current: number, max: number, succs: Map<number, number>): number {
	const pick1 = succs.get(current) as number;
	const pick2 = succs.get(pick1) as number;
	const pick3 = succs.get(pick2) as number;
	const nextCurrent = succs.get(pick3) as number;

	const findInsertionPoint = (candidate: number): number => {
		if (candidate == 0)
			return findInsertionPoint(max);
		else if (candidate == pick1 || candidate == pick2 || candidate == pick3)
			return findInsertionPoint(candidate - 1);
		else
			return candidate;
	};

	succs.set(current, nextCurrent);
	const insertionPoint = findInsertionPoint(current - 1);
	const hangingCup = succs.get(insertionPoint) as number;
	succs.set(insertionPoint, pick1);
	succs.set(pick3, hangingCup);
	return nextCurrent;
}

var current = input[0];
for (var m = 0; m < 10000000; m++) {
	current = moveSuccessors(current, 1000000, cupSuccessors);
}

const next1 = cupSuccessors.get(1) as number;
const next2 = cupSuccessors.get(next1) as number;
console.log('Part 2: The two cups are', next1, 'and', next2, 'and their product is', next1 * next2);

