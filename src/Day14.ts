import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example14b.txt', 'utf8').trim();
const input = readFileSync('src/Input14.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);


//Part 1: What is the sum of all values left in memory after the initialization program completes?
//Since the input contains both mask updates and memory writes, it's easier to process the input
//on the fly.
type MaskSet = {and: bigint, or: bigint, x: bigint};
var mask: MaskSet = {and: 0x000000000n, or: 0x000000000n, x: 0x000000000n};
var memory: {[address: number]: bigint} = {};

//JavaScript is one of those languages that thought double-precision floating-point was a good
//enough format for all numbers. Like other such languages (e.g. Lua), this turned out to be more
//of a limiting factor that one would hope. JavaScript's workaround is BigInts, which can be created
//with either the BigInt() constructor or an 'n' suffix on numeric literals. Unfortunately, like
//many of the nice features in JavaScript, it's only available in bleeding-edge versions. But this
//is the Advent of Code, so who cares about browser compatibility?
function readMask(maskCommand: string): MaskSet {
	const bits = maskCommand.slice(7).split('');
	const newAnd = bits.reduce((acc: bigint, c: string) => {
		acc <<= 1n;
		if (c == '0')
			acc += 1n;
		return acc;
	}, 0n);
	const newOr = bits.reduce((acc: bigint, c: string) => {
		acc <<= 1n;
		if (c == '1')
			acc += 1n;
		return acc;
	}, 0n);
	const newX = bits.reduce((acc: bigint, c: string) => {
		acc <<= 1n;
		if (c == 'X')
			acc += 1n;
		return acc;
	}, 0n);
	return {and: newAnd, or: newOr, x: newX};
}

for (var line of lines) {
	if (line.match(/mask/)) {
		mask = readMask(line);
	} else {
		const parse = line.match(/mem\[([0-9]+)\] = ([0-9]+)/);
		if (!parse)
			throw new Error('Bad input: ' + line);
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


//Part 2: The mask now generates multiple addresses for the writes. Floating bits contain all
//possible values.
function generateAddressPair(xMask: bigint, addr: bigint): any {
	for (var b = 0n; b < 36n; b++) {
		const bit = 1n << b;
		if (xMask & bit) {
			const newMask = xMask & ~bit;
			const addr1 = addr & ~bit;
			const addr2 = addr | bit;
			return [generateAddressPair(newMask, addr1), generateAddressPair(newMask, addr2)];
		}
	}
	return addr;
}

//New rule: If the bitmask is 0, the address bit is unchanged
function generateMaskedAddresses(mask: MaskSet, addr: bigint): bigint[] {
	const maskedAddr = (addr | mask.or) & ~mask.x;
	const newAddrs = generateAddressPair(mask.x, maskedAddr);
	
	//Nobody told TypeScript that Array.prototype.flat() exists :-(
	return (newAddrs as any).flat(36);
}

memory = {} as {[address: number]: bigint};
for (var line of lines) {
	if (line.match(/mask/)) {
		mask = readMask(line);
	} else {
		const parse = line.match(/mem\[([0-9]+)\] = ([0-9]+)/);
		if (!parse)
			throw new Error('Bad input: ' + line);
		const addr = BigInt(parseInt(parse[1]) as number);
		const maskedAddrs = generateMaskedAddresses(mask, addr);
		const value = BigInt(parseInt(parse[2]) as number);
		
		for (var a of maskedAddrs) {
			memory[Number(a)] = value;
		}
	}
}
	
var sum2 = 0n;
for (var addr in memory) {
	sum2 += memory[addr];
}
console.log('Part 2: The sum of all values in memory is', Number(sum2));





