import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example09.txt', 'utf8').trim();
const input = readFileSync('src/Input09.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);

//The preamble length for the example is 5, but for the main input it's 25.
const preambleLength = 25;

//The input this time is just one integer per line
const nums = lines.map(n => parseInt(n, 10));


//Part 1: Find the first number is the list that is not the sum of two of the 25 numbers before it.
var sumMatch = false;
var mismatchNum: number = -1;
for (var n = preambleLength; n < nums.length; n++) {
	sumMatch = false;
	for (var first = n - preambleLength; first < n - 1 && !sumMatch; first++) {
		for (var second = first + 1; second < n && !sumMatch; second++) {
			if (nums[n] == nums[first] + nums[second])
				sumMatch = true;
		}
	}
	
	if (!sumMatch) {
		mismatchNum = nums[n];
		console.log("Part 1: The first number that doesn't fit is", mismatchNum, "at position", n);
		break;
	}
}


//Part 2: Find a contiguous set of at least two numbers that adds up to the answer from part 1.
for (var n = 0; n < nums.length - 1; n++) {
	var sumNums: number[] = [];
	var sum = 0;
	var c = 0;
	
	while (sum < mismatchNum) {
		sum += nums[n + c];
		sumNums.push(nums[n + c]);
		c++;
	}
	
	if (sum == mismatchNum) {
		//Remember, JavaScript sorts arrays as strings by default. :-O
		sumNums.sort((n: number, m: number) => n - m);

		console.log('Part 2: The sequence starts at position', n, 'and ends at', n + c);
		console.log('        The smallest and largest numbers are', sumNums[0], 'and', sumNums[sumNums.length - 1]);
		console.log('        Those sum to', sumNums[0] + sumNums[sumNums.length - 1]);
		break;
	}
}
	
