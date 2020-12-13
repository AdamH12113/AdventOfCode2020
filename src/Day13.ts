import {readFileSync} from 'fs';

//Read the input file.
const input = readFileSync('src/Example13.txt', 'utf8').trim();
//const input = readFileSync('src/Input13.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);


//The input contains one line with the earliest valid timestamp and one line with a list of bus IDs.
//The bus IDs can be valid (a number) or 'x'.
const earliestValid = parseFloat(lines[0]) as number;
const busIds = lines[1].split(',');
const validBusIds = busIds.filter(i => i != 'x').map(i => parseFloat(i) as number);


//Part 1: Find the bus IDs that departs the soonest after the earliest valid timestamp. This is a
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

