import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example18.txt', 'utf8').trim();
const input = readFileSync('src/Input18.txt', 'utf8').trim();

const expressionsText = input.split(/\r?\n/);


//This looks like a job for... recursive type definitions! Let's do this functionally for fun!
type Operator = (a: number, b: number) => number;
type Step = {op: Operator, next: number | Expression};
type Expression = Step[];
function isStep(step: any): boolean {
	return (typeof step == 'object' && typeof step.op == 'function' && step.next !== undefined);
}

const plus: Operator = (a, b) => a + b;
const times: Operator = (a, b) => a * b;

function evaluateExpression(steps: Expression): number {
	var acc = 0;
	for (var step of steps) {
		if (typeof step.next == 'number')
			acc = step.op(acc, step.next);
		else
			acc = step.op(acc, evaluateExpression(step.next));
	}
	return acc;
}


//Somehow this always turns out to be the hard part
function findCloseParen(tokens: string[]): number {
	var numOpens = 0;
	for (var t = 0; t < tokens.length; t++) {
		if (tokens[t] == '(') {
			numOpens++;
		} else if (tokens[t] == ')') {
			if (numOpens == 0)
				return t;
			else
				numOpens--;
		}
	}
	throw new Error('No close parenthesis found: ' + JSON.stringify(tokens));
}

function parseExpression(tokens: string[]): Expression {
	var exp = [];
	var t = 0;
	
	//The first item is represented as an addition with the starting accumulator value of zero
	var operator = plus;
	
	while (t < tokens.length) {
		const num = parseInt(tokens[t], 10);
		if (num) {
			exp.push({op: operator, next: num});
			t++;
		} else if (tokens[t] == '+' || tokens[t] == '*') {
			operator = (tokens[t] == '+') ? plus : times;
			t++;
		} else if (tokens[t] == '(') {
			const closeParen = findCloseParen(tokens.slice(t+1));
			const next = parseExpression(tokens.slice(t+1, t+1+closeParen));
			exp.push({op: operator, next: next});
			t = t + 1 + closeParen + 1;
		} else if (tokens[t] == ')') {
			return exp;
		} else {
			throw new Error('Bad token: ' + tokens[t] + ' ' + JSON.stringify(tokens));
		}
	}
	return exp;
}


//Part 1: Find the sum of the results of all expressions in the input. All numbers are one digit,
// so we can cheat by stripping out the spaces and going character by character when parsing.
var sum1 = 0;
for (var line of expressionsText) {
	const expTokens = line.replace(/ /g, '').split('');
	const exp = parseExpression(expTokens);
	const ans = evaluateExpression(exp);
	sum1 += ans;
}
console.log('Part 1: The sum of all expressions is', sum1);


//Part 2: Now addition has higher precedence than multiplication. Given the work I've already done,
//I think the easiest way to handle this is to preprocess the token list to add parentheses around
//addition sub-expressions. Should've made a tree instead of a list for part 1. Oh well. Why do
//what everyone else is doing when I could do something harder and stupider? :-)
function findOpenParen(tokens: string[]): number {
	var numCloses = 0;
	for (var t = tokens.length - 1; t >= 0; t--) {
		if (tokens[t] == ')') {
			numCloses++;
		} else if (tokens[t] == '(') {
			if (numCloses == 0)
				return t;
			else
				numCloses--;
		}
	}
	throw new Error('No open parenthesis found: ' + JSON.stringify(tokens));
}

function parenthesizeAddition(tokens: string[]) {
	//The first and last character will never be a plus
	for (var t = 1; t < tokens.length - 1; t++) {
		if (tokens[t] == '+') {
			if (tokens[t-1] == ')') {
				const openParen = findOpenParen(tokens.slice(0, t-1))
				tokens.splice(openParen, 0, '(');
			} else {
				tokens.splice(t-1, 0, '(');
			}
			t++;
			
			if (tokens[t+1] == '(') {
				const closeParen = findCloseParen(tokens.slice(t+2)) + t+2;
				tokens.splice(closeParen, 0, ')');
			} else {
				tokens.splice(t+2, 0, ')');
			}
		}
	}
	return tokens;
}

var sum2 = 0;
for (var line of expressionsText) {
	const expTokens = line.replace(/ /g, '').split('');
	const preprocTokens = parenthesizeAddition(expTokens);
	const exp = parseExpression(preprocTokens);
	const ans = evaluateExpression(exp);
	sum2 += ans;
}
console.log('Part 2: The sum of all expressions is', sum2);

