import {readFileSync} from 'fs';
import {AssemblyInterpreter} from './AssemblyInterpreter';

//Read the input file.
//const input = readFileSync('src/Example08.txt', 'utf8').trim();
const input = readFileSync('src/Input08.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);


//Part 1: There is an infinite loop in the program. What is the value in the accumulator immediately
//before an instruction is executed for the second time?
const interpreter = new AssemblyInterpreter(lines);
var seenAddresses1: number[] = [];
var nextAddress1 = 0;
do {
	seenAddresses1.push(nextAddress1);
	nextAddress1 = interpreter.step();
} while (!seenAddresses1.includes(nextAddress1));

console.log('Part 1: First duplicate instruction was at address', interpreter.pc, 'with ACC', interpreter.acc);


//Part 1: Fix the infinite loop by converting one NOP to a JMP or one JMP to a NOP. The obvious
//thing to try is changing the instruction right before we hit the infinite loop in part 1, and
//continue working backward to change other instructions as we find them.
while (true) {
	const nextChange = seenAddresses1.pop() as number;  //Type coercion because we know the array isn't empty
	const fromOpMatch = lines[nextChange].match(/(acc|jmp|nop)/);
	const fromOp = (fromOpMatch) ? fromOpMatch[1] : undefined;
	
	if (fromOp && fromOp != 'acc') {
		const toOp = (fromOp == 'jmp') ? 'nop' : 'jmp';
		const modInterpreter = new AssemblyInterpreter(lines);
		modInterpreter.program[nextChange] = modInterpreter.program[nextChange].replace(fromOp, toOp);
		
		var seenAddresses2: number[] = [];
		var nextAddress2 = 0;
		do {
			seenAddresses2.push(nextAddress2);
			nextAddress2 = modInterpreter.step();
		} while (!seenAddresses2.includes(nextAddress2) && nextAddress2 != -1);
		
		if (nextAddress2 == -1) {
			console.log('Part 2: Program fixed by changing address', nextChange, 'from', fromOp, 'to', toOp);
			console.log('        Program terminated with ACC', modInterpreter.acc);
			break;
		}
	}
}
