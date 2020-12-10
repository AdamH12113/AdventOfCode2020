import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example10a.txt', 'utf8').trim();
//const input = readFileSync('src/Example10b.txt', 'utf8').trim();
const input = readFileSync('src/Input10.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);

//The input this time is just one integer per line
const adapters = lines.map(n => parseInt(n, 10));


//Part 1
adapters.sort((n: number, m: number) => n - m);
var numOnes = 0;
var numThrees = 0;
var prev = 0;
for (var a = 0; a < adapters.length; a++) {
	const diff = adapters[a] - prev;
	prev = adapters[a];
	if (diff == 1)
		numOnes++;
	else if (diff == 3)
		numThrees++;
}
numThrees++;

console.log('Part 1:', numOnes, 'one-jolt differences and', numThrees, 'three-jolt differences');
console.log('        The product is', numOnes * numThrees);

