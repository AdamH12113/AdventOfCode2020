import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example14.txt', 'utf8').trim();
const input = readFileSync('src/Input14.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);


//Part 1: What is the sum of all values left in memory after the initialization program completes?
//Since the input contains both mask updates and memory writes, it's easier to process the input
//on the fly.
type MaskSet = {and: bigint, or: bigint};
var mask: MaskSet = {and: 0x000000000n, or: 0x000000000n};
var memory: {[address: number]: bigint} = {};

//JavaScript is one of those languages that thought double-precision floating-point was a good
//enough format for all numbers. Like other such languages (e.g. Lua), this turned out to be more
//of a limiting factor that one would hope. JavaScript's workaround is BigInts, which can be created
//with either the BigInt() constructor or an 'n' suffix on numeric literals. Unfortunately, like
//many of the nice features in JavaScript, it's only available in bleeding-edge versions. But this
//is the Advent of Code, so who cares about browser compatibility?
function readMask(command: string): MaskSet {
	const commandBits = command.slice(7).split('');
	const newAnd = commandBits.reduce((acc: bigint, c: string) => {
		acc <<= 1n;
		if (c == '0')
			acc += 1n;
		return acc;
	}, 0n);
	const newOr = commandBits.reduce((acc: bigint, c: string) => {
		acc <<= 1n;
		if (c == '1')
			acc += 1n;
		return acc;
	}, 0n);
	return {and: newAnd, or: newOr};
}

for (var line of lines) {
	if (line.match(/mask/)) {
		mask = readMask(line);
	} else {
		const parse = line.match(/mem\[([0-9]+)\] = ([0-9]+)/);
		if (!parse) {
			console.error('Bad input:', line);
			break;
		}
		const addr = parseInt(parse[1]) as number;
		const value = BigInt(parseInt(parse[2]) as number);
		
		const maskedValue = (value | mask.or) & ~mask.and;
		memory[addr] = maskedValue;
	}
}

var sum1 = 0n;
for (var addr in memory) {
	sum1 += memory[addr];
}
console.log('Part 1: The sum of all values in memory is', Number(sum1));