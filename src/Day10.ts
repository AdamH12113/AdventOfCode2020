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


//Part 2: Figure out how many different ways the adapters can be chained together to connect the
//device and the power source. A brute-force attempt would take way too long, but we can use a
//recursive algorithm to implement a depth-first search that effectively caches the partial results.
//We'll need a look-up table for the number of combinations "below" a given adapter.
type LookupTable = {[index: number]: number};

function lookDown(adapterVoltage: number, adapterLookup: LookupTable): number {
	if (adapterLookup[adapterVoltage] === undefined) {
		const compatible = adapters.filter((a: number) => (a < adapterVoltage && a >= adapterVoltage - 3));
		const directConnection = (adapterVoltage <= 3) ? 1 : 0;
		
		var numDownwardCombos = directConnection;
		for (var a of compatible) {
			numDownwardCombos += lookDown(a, adapterLookup);
		}
		adapterLookup[adapterVoltage] = numDownwardCombos;
	}
	
	//TypeScript doesn't realize that this can't be undefined anymore
	return adapterLookup[adapterVoltage] as number;
}

const totalCombos = lookDown(adapters[adapters.length - 1], {} as LookupTable);
console.log('Part 2: The number of possible adapter combinations is', totalCombos);
