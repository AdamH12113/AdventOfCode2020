import {readFileSync} from 'fs';


//Read and parse the input file. Nifty Windows-compatible newline split courtesy of:
//https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
//const input = readFileSync('src/Example01.txt', 'utf8');
const input = readFileSync('src/Input01.txt', 'utf8');
const lines = input.split(/\r?\n/);
const numbers = lines.map(n => parseInt(n, 10));

//Part 1: Find the two numbers in the list that sum to 2020 and print their product
console.log('Part 1');
var found = false;
for (var i = 0; i < numbers.length - 1 && !found; i++) {
	for (var j = i + 1; j < numbers.length && !found; j++) {
		const ni = numbers[i];
		const nj = numbers[j];
		if (ni + nj == 2020) {
			console.log(ni, '+', nj, '=', ni + nj);
			console.log(ni, '*', nj, '=', ni * nj)
			found = true;
		}
	}
}
if (!found) {
	throw new Error("Couldn't find the right numbers in part 1!");
}

//Part 2: Find three numbers that sum to 2020 and print their product
console.log('\nPart 2');
var found = false;
for (var i = 0; i < numbers.length - 2 && !found; i++) {
	for (var j = i + 1; j < numbers.length - 1 && !found; j++) {
		for (var k = i + 2; k < numbers.length && !found; k++) {
			const ni = numbers[i];
			const nj = numbers[j];
			const nk = numbers[k];
			if (ni + nj + nk == 2020) {
				console.log(ni, '+', nj, '+', nk, '=', ni + nj + nk);
				console.log(ni, '*', nj, '*', nk, '*', ni * nj * nk);
				found = true;
			}
		}
	}
}
if (!found) {
	throw new Error("Couldn't find the right numbers in part 2!");
}
