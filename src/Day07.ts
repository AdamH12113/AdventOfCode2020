import {readFileSync} from 'fs';


//Read the input file.
//const input = readFileSync('src/Example07.txt', 'utf8').trim();
const input = readFileSync('src/Input07.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);

//The input contains list of rules for bag contents. There's one rule per line. Each rule consists
//of a containing bag and a list of what bags (if any) are contained within.
var rules: {[color: string]: any[]} = {}
for (var line of lines) {
	//Colors are always two words. Containers only have a color, while contained bags also have a quantity.
	const containerMatch = /(\S+ \S+) bag/;
	const contentMatch = /([0-9]+) (\S+ \S+) bag/;
	
	const ruleSides = line.split(' contain ');
	const leftMatch = ruleSides[0].match(containerMatch);
	if (leftMatch) {
		const container = leftMatch[1];
		rules[container] = [];
		
		//JavaScript's support for global regex captures is still bleeding-edge, so let's stick
		//with a more manual approach for now.
		for (var item of ruleSides[1].split(',')) {
			const match = item.match(contentMatch);
			if (match) {
				const num = parseInt(match[1]);
				const color = match[2];
				rules[container].push({color: color, num: num});
			}
		}
	} else {
		throw new Error('Bad input');
	}
}


//Part 1: If we want to carry a shiny gold bag in at least one other bag, how many different bag
//colors would be valid for the outermost bag? A simple recursive algorithm lets us check whether
//one colored bag can contain another.
function canContain(outer: string, goal: string): boolean {
	//For a lanaguage that features exceptions so prominently, TypeScript is surprisingly picky
	//about null/undefined checks
	if (rules[outer]) {
		for (var rule of rules[outer]) {
			const inner = rule.color;
			if (inner == goal)
				return true;
			else if (canContain(inner, goal))
				return true;
		}
	}
	return false;
}

var total1 = 0;
for (var color in rules) {
	if (canContain(color, 'shiny gold'))
		total1++;
}
console.log('Part 1: There are', total1, 'bags that can contain a shiny gold bag.');

//Part 2: How many bags are contained inside a single shiny gold bag? This is also a recursive
//algorithm, albeit a slightly more complex one since we now have to keep count.
function countContents(outer: string): number {
	var total = 0;
	
	if (rules[outer]) {
		for (var rule of rules[outer]) {
			total += rule.num * (1 + countContents(rule.color));
		}
	}
	return total;
			
}

const total2 = countContents('shiny gold');
console.log('Part 2: There are', total2, 'bags contained within a shiny gold bag.');
