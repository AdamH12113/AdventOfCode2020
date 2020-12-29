import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example13.txt', 'utf8').trim();
const input = readFileSync('src/Input13.txt', 'utf8').trim();

const lines = input.split(/\r?\n/);


//The input contains one line with the earliest valid timestamp and one line with a list of bus IDs.
//The bus IDs can be valid (a number) or 'x'.
const earliestValid = parseInt(lines[0], 10) as number;
const busIds = lines[1].split(',');
const validBusIds = busIds.filter(i => i != 'x').map(i => parseInt(i, 10) as number);


//Part 1: Find the bus ID that departs the soonest after the earliest valid timestamp. This is a
//simple application of ceiling division.
const relativeDepartureTimes = validBusIds.map(i => {
	const nextDeparture = Math.ceil(earliestValid / i) * i;
	return {id: i, departure: nextDeparture - earliestValid};
});
	
relativeDepartureTimes.sort((a: any, b: any) => a.departure - b.departure);
const firstId = relativeDepartureTimes[0].id;
const waitTime = relativeDepartureTimes[0].departure;
console.log('Part 1: The first bus to leave is ID', firstId, 'with a wait time of', waitTime, '=', firstId * waitTime);


//Part 2: Find the earliest timestamp such that all of the listed bus IDs depart at offsets matching
//their position in the list. The bus IDs are all prime, which should probably give me a hint...
var idPositions: any = {};
for (var p = 0; p < busIds.length; p++) {
	if (busIds[p] != 'x')
		idPositions[busIds[p]] = p;
}

//There's an iterative solution to this -- find the timestamp where two buses sync up in the right
//way, then add the combined period of those two buses (the product of their timestamps) until we
//reach a point where the next bus syncs up too. Rinse and repeat. The buses need to be synced in
//numeric order to keep the multiplier as small as possible and avoid skipping timestamps.
const bus0 = validBusIds[0];
const otherBuses = [...validBusIds.slice(1)].sort((a,b) => b - a).reverse();
var ts = bus0;
var step = bus0;
for (var nextBus of otherBuses) {
	const idPos = idPositions[nextBus];
	
	//It may take more than one full bus cycle for the bus to leave at the right time offset. We
	//need to adjust our modulus division accordingly.
	const numCycles = Math.ceil(idPos / nextBus);
	const modValue = numCycles*nextBus - idPos;

	while (ts % (numCycles*nextBus) != modValue) {
		ts += step;
	}
	step *= nextBus;
}

console.log('Part 2: The final timestamp is', ts);
