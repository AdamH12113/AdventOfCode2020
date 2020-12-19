import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example16b.txt', 'utf8').trim();
const input = readFileSync('src/Input16.txt', 'utf8').trim();

//The input's complicated for this one. There are three groups of items. The first gives ranges of
//valid values for each of the ticket fields (two ranges per field). The second gives the fields on
//our ticket. The third gives the fields on multiple nearby tickets.
const groups = input.split(/\r?\n\r?\n/);
const fieldRangeRows = groups[0].split(/\r?\n/);
const myTicketText = groups[1].split(/\r?\n/)[1];
const nearbyTicketRows = groups[2].split(/\r?\n/).slice(1);

type Ranges = {[field: string]: {min: number, max: number}[]};
const ranges: Ranges = fieldRangeRows.reduce((acc: Ranges, line: string) => {
	const matches = line.match(/([a-z ]+): ([0-9]+)-([0-9]+) or ([0-9]+)-([0-9]+)/);
	if (matches) {
		const field = matches[1];
		const min1 = parseInt(matches[2], 10) as number;
		const max1 = parseInt(matches[3], 10) as number;
		const min2 = parseInt(matches[4], 10) as number;
		const max2 = parseInt(matches[5], 10) as number;
		acc[field] = [{min: min1, max: max1}, {min: min2, max: max2}];
	}
	return acc;
}, {} as Ranges);

const myTicket = myTicketText.split(',').map(s => parseInt(s, 10) as number);
const nearbyTickets = nearbyTicketRows.map(row => row.split(',').map(s => parseInt(s, 10) as number));


//Part 1: Determine the ticket scanning error rates, which is defined as the sum of all invalid
//values on nearby tickets. Invalid values are not in a valid range for any field.
function isValid(num: number, field: string): boolean {
	for (var range of ranges[field]) {
		if (num >= range.min && num <= range.max)
			return true;
	}
	return false;
}

function isValidSomewhere(num: number): boolean {
	for (var f in ranges) {
		if (isValid(num, f))
			return true;
	}
	return false;
}

var errorRate = 0;
for (var ticket of nearbyTickets) {
	for (var value of ticket) {
		if (!isValidSomewhere(value))
			errorRate += value;
	}
}
console.log('Part 1: The ticket error rate is', errorRate);


//Part 2: Discard the invalid tickets, and use the remaining tickets to determine which field is
//which. Once that's done, take the values for the six fields whose names start with "departure" on
//our ticket and multiply them together.
const validNearbyTickets = nearbyTickets.filter(ticket => ticket.every(isValidSomewhere));
const numFields = validNearbyTickets[0].length;

var fieldNameCandidates: string[][] = new Array(numFields);
for (var f = 0; f < fieldNameCandidates.length; f++) {
	fieldNameCandidates[f] = Object.keys(ranges);
}

//Filter out invalid field names based on the field values
for (var fieldIdx = 0; fieldIdx < numFields; fieldIdx++) {
	for (var ticket of validNearbyTickets) {
		const value = ticket[fieldIdx];

		var fieldNameIdx = 0;
		while (fieldNameIdx < fieldNameCandidates[fieldIdx].length) {
			if (isValid(value, fieldNameCandidates[fieldIdx][fieldNameIdx])) {
				fieldNameIdx++;
			} else {
				fieldNameCandidates[fieldIdx].splice(fieldNameIdx, 1);
			}
		}
	}
}

//Use process of elimination to narrow down which fields are which
var fieldNames: string[] = new Array(numFields);
var fieldIdx = 0;
while (fieldIdx < numFields) {
	const cList = fieldNameCandidates[fieldIdx];
	if (cList.length == 1) {
		const name = cList[0];
		cList.splice(0, 1);
		fieldNames[fieldIdx] = name;
		fieldIdx = 0;
	} else {
		var f = 0;
		while (f < cList.length) {
			if (fieldNames.indexOf(cList[f]) >= 0) {
				cList.splice(f, 1);
			} else {
				f++;
			}
		}
		fieldIdx++;
	}
	
	if (fieldIdx == numFields && !fieldNameCandidates.every(cl => cl.length == 0))
		fieldIdx = 0;
}

var product = 1;
for (var nameIdx = 0; nameIdx < fieldNames.length; nameIdx++) {
	const name = fieldNames[nameIdx];
	if (name.match(/^departure/))
		product *= myTicket[nameIdx];
}
console.log('The product of all departure fields is', product);
	


