// Assembly interpreter module for the Advent of Code 2020

export class AssemblyInterpreter {
	//Definite assignment assertion modifiers (!) tell TypeScript not to panic because pc and acc
	//are initialized when the constructor calls reset().
	pc!: number;
	acc!: number;
	debug: boolean;
	program: string[];
	
	constructor(program: string[], debug=false) {
		this.program = [...program];
		this.reset();
		this.debug = debug;
	}
	
	//Reset the PC and ACC for another run
	reset() {
		this.pc = 0;
		this.acc = 0;
	}
	
	//Run a single instruction and return the address of the next instruction to be executed, or -1
	//if the program has terminated.
	step(): number {
		if (this.pc == this.program.length) {
			//Terminate the program
			return -1;
		} else if (this.pc > this.program.length) {
			throw new Error('PC out of bounds: PC=' + this.pc + ' but program length is ' + this.program.length);
		}

		const nextInstruction = this.program[this.pc].split(' ');
		const opcode = nextInstruction[0];
		const operand = parseInt(nextInstruction[1]);
		
		switch (opcode) {
			case 'acc':
				this.acc += operand;
				this.pc++;
				break;
			case 'jmp':
				this.pc += operand;
				break;
			case 'nop':
				this.pc++;
				break;
			default:
				throw new Error('Invalid opcode: ' + JSON.stringify(nextInstruction));
		}
		
		return this.pc;
	}
	
	//This could be more concise, but we'll probably have to expand it later.
	run() {
		var done = false;
		while (!done) {
			done = (this.step() != -1);
		}
	}
}
