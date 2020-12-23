import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example19b.txt', 'utf8').trim();
const input = readFileSync('src/Input19.txt', 'utf8').trim();

const parts = input.split(/\r?\n\r?\n/);
const rulesText = parts[0].split(/\r?\n/);
rulesText.sort();

var rules: Map<number, string> = new Map();
for (var text of rulesText) {
	const matches = text.match(/([0-9]+): (.+)/)
	if (matches === null)
		throw new Error('Bad input: ' + text);
	const index = parseInt(matches[1], 10);
	const rest = matches[2];
	rules.set(index, rest);
}

const messages = parts[1].split(/\r?\n/);

//A cache isn't really necessary, but it will help with part 2.
var reCache: Map<number, string> = new Map();

//This function assumes the list of rules is sorted by index number
function constructRuleRegex(ruleNum: number, rules: Map<number, string>): string {
	const cached = reCache.get(ruleNum);
	if (cached)
		return cached;
	
	const rule = rules.get(ruleNum) as string;
	const literalMatch = rule.match(/^"([a-z])"$/);
	const rulesetMatch = rule.match(/^([0-9 ]+)$/);
	const alternativeMatch = rule.match(/^([0-9 ]+)\|([0-9 ]+)$/);

	const filterMatch = (match: string) => match.split(' ').filter(s => s != '').map(n => parseInt(n, 10) as number);

	var result;
	if (literalMatch) {
		const literal = literalMatch[1];
		result = literal;
	} else if (rulesetMatch) {
		const ruleset = filterMatch(rulesetMatch[1]).map(rs => constructRuleRegex(rs, rules)).join('');
		result = ruleset;
	} else if (alternativeMatch) {
		const alternative1 = filterMatch(alternativeMatch[1]);
		const alternative2 = filterMatch(alternativeMatch[2]);
		const altset = '(' + alternative1.map(rs => constructRuleRegex(rs, rules)).join('') +
		               '|' + alternative2.map(rs => constructRuleRegex(rs, rules)).join('') + ')';
		result = altset;
	} else {
		throw new Error('Bad rule: ' + rule);
	}
	
	reCache.set(ruleNum, result);
	return result;
}


//Part 1: Determine the number of messages that completely match rule 0. Since the rules are
//basically a subset of regular expressions, we can convert them into regular expressions and use
//the built-in regex engine to check the messages.
const countMatches = (matches: number[]): number => matches.reduce((acc: number, m: number) => acc + m, 0);
const rule0RegexText = '^' + constructRuleRegex(0, rules) + '$';
console.log(rule0RegexText);
const rule0 = new RegExp(rule0RegexText);
const matchingMessages = messages.map(msg => ((msg.match(rule0)) ? 1 : 0));
const numMatches = countMatches(matchingMessages);
console.log('Part 1: The number of messages that match rule 0 is', numMatches);


//Part 2: Replace two of the rules. The new rules are recursive. But none of the other rules are
//affected, so we don't have to implement recursive matches in general. Good thing, too, because
//JavaScript doesn't support recursive regexes!
rules.set(8, '8: 42 | 42 8');
rules.set(11, '42 31 | 42 11 31');

//The new rule 8 is simple -- it allows for any number of rule 42s in a row. The new rule 11 is
//more complex -- it allows for any number of rule 42s in a row followed by an *equal* number of
//rule 31s in a row. To solve this problem narrowly, we'll process the text manually using the
//regex engine as a helper.
const rule42RegexText = constructRuleRegex(42, rules);
const rule31RegexText = constructRuleRegex(31, rules);
const rule8RegexText = '(' + rule42RegexText + ')+';

//We'll work backwards from the end of the string, so all of our regexes will look for that end
const rule31 = new RegExp(rule31RegexText + '$');
const rule42 = new RegExp(rule42RegexText + '$');
const rule8 = new RegExp('^' + rule8RegexText + '$');

//To match rule 11, we'll start by stripping copies of rule 31 from the end of the string, then
//trying to strip an equal number of copies of rule 42 from the end of the string. The function
//returns the remainder of the string for matching with rule 8.
function matchRule11(msg: string): string|undefined {
	var numRule31s = 0;
	var reducedMsg = msg;
	
	while (true) {
		const match = reducedMsg.match(rule31);
		if (match) {
			const matchLen = match[0].length;
			reducedMsg = reducedMsg.slice(0, reducedMsg.length - matchLen);
			numRule31s++;
		} else {
			break;
		}
	}
	
	if (numRule31s == 0)
		return undefined;
	
	for (var n = 0; n < numRule31s; n++) {
		const match = reducedMsg.match(rule42);
		if (match) {
			const matchLen = match[0].length;
			reducedMsg = reducedMsg.slice(0, reducedMsg.length - matchLen);
		} else {
			return undefined;
		}
	}
	return reducedMsg;
}

//Rule 0 is: 8 11
function matchNewRules(msg: string): boolean {
	const leftover11 = matchRule11(msg);
	if (leftover11 === undefined)
		return false;
	
	return (leftover11.match(rule8)) ? true : false;
}

const matchingMessages2 = messages.map(msg => ((matchNewRules(msg)) ? 1 : 0));
const numMatches2 = countMatches(matchingMessages2);
console.log('Part 2: The number of messages that match rule 0 is', numMatches2);

