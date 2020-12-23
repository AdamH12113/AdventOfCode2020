import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example22.txt', 'utf8').trim();
const input = readFileSync('src/Input22.txt', 'utf8').trim();

const decks = input.match(/Player 1\:\r?\n([0-9\r\n]+)\r?\nPlayer 2\:\r?\n([0-9\r\n]+)/);
if (!decks || !decks[1] || !decks[2])
	throw new Error('Bad deck format: ' + JSON.stringify(decks));

var p1Deck: number[] = decks[1].trim().split(/\r?\n/).map(s => parseInt(s, 10) as number);
var p2Deck: number[] = decks[2].trim().split(/\r?\n/).map(s => parseInt(s, 10) as number);

//Making this a parameter helps with part 2
function playRound(p1Deck: number[], p2Deck: number[]) {
	const card1 = p1Deck.shift();
	const card2 = p2Deck.shift();
	
	if (card1 !== undefined && card2 !== undefined) {
		if (card1 > card2)
			p1Deck.push(...[card1, card2]);
		else
			p2Deck.push(...[card2, card1]);
	} else {
		throw new Error('Empty deck: ' + JSON.stringify(card1) + ' ' + JSON.stringify(card2));
	}
}

function calculateScore(winningDeck: number[]): number {
	var deck = [...winningDeck];
	var m = 1;
	var score = 0;
	
	while (deck.length > 0) {
		score += (deck.pop() as number) * m;
		m++;
	}
	return score;
}

function playGame(p1Deck: number[], p2Deck: number[]): number {
	var p1 = [...p1Deck];
	var p2 = [...p2Deck];
	
	while (p1.length > 0 && p2.length > 0) {
		playRound(p1, p2);
	}
	
	const winner = (p1.length > 0) ? p1 : p2;
	const score = calculateScore(winner);
	
	//Using the sign of the score to indicate the winning player helps with part 2
	return (winner == p1) ? score : -score;
}

//Part 1: Calculate the winning player's score.
const winningScore = playGame(p1Deck, p2Deck);
console.log('Part 1: The winning score is', Math.abs(winningScore));
console.log('        The winner was player', (winningScore > 0) ? '1' : '2');


//Part 2: Now some rounds are resolved by starting a recursive game.
const DEBUG = false;
const dprint = (...args: any[]) => {if (DEBUG) console.log(...args);}

function playRecursiveRound(p1Deck: number[], p2Deck: number[]) {
	dprint('Decks', p1Deck, p2Deck);
	const card1 = p1Deck.shift();
	const card2 = p2Deck.shift();
	
	if (card1 !== undefined && card2 !== undefined) {
		dprint('Played', card1, card2);
		if (p1Deck.length < card1 || p2Deck.length < card2) {
			if (card1 > card2)
				p1Deck.push(...[card1, card2]);
			else
				p2Deck.push(...[card2, card1]);
		} else {
			console.log('Recursing...');
			const score = playRecursiveGame(p1Deck.slice(0, card1), p2Deck.slice(0, card2));
			console.log('Returning -- player', (score > 0) ? '1' : '2', 'won');
			if (score > 0)
				p1Deck.push(...[card1, card2]);
			else
				p2Deck.push(...[card2, card1]);
		}
	} else {
		throw new Error('Empty deck: ' + JSON.stringify(card1) + ' ' + JSON.stringify(card2));
	}
}

type PastState = {p1: number[], p2: number[]};
function stateSeen(p1: number[], p2: number[], pastStates: PastState[]) {
	for (var state of pastStates) {
		//Surprisingly, this is the most-cited way to compare array contents in JavaScript
		if (JSON.stringify(state.p1) === JSON.stringify(p1) && JSON.stringify(state.p2) === JSON.stringify(p2))
			return true;
	}
	return false;
}

function playRecursiveGame(p1Deck: number[], p2Deck: number[]): number {
	var pastStates: PastState[] = [];
	var p1 = [...p1Deck];
	var p2 = [...p2Deck];
	
	while (p1.length > 0 && p2.length > 0) {
		if (stateSeen(p1, p2, pastStates)) {
			dprint('Duplicate state:', p1, p2);
			return 1;
		}

		pastStates.push({p1: [...p1], p2: [...p2]});
		playRecursiveRound(p1, p2);
	}
	dprint('Final lengths:', p1.length, p2.length);
	const winner = (p1.length > 0) ? p1 : p2;
	const score = calculateScore(winner);
	
	//Using the sign of the score to indicate the winning player helps with part 2
	return (winner === p1) ? score : -score;
}

const p1Test = [43, 19];
const p2Test = [2, 29, 14];

const winningScore2 = playRecursiveGame(p1Deck, p2Deck);
console.log('Part 2: The winning score is', Math.abs(winningScore2));
console.log('        The winner was player', (winningScore2 > 0) ? '1' : '2');

