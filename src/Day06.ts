import {readFileSync} from 'fs';


//Read the input file.
//const input = readFileSync('src/Example06.txt', 'utf8').trim();
const input = readFileSync('src/Input06.txt', 'utf8').trim();

//The input contains list of questions answered "yes" for each person in each group. There's one
//person per line, and each group is separated by a blank line.
const groups = input.split(/\r?\n\r?\n/).map(group => group.split(/\r?\n/));

//Part 1: For each group, count the number of questions to which anyone answered "yes" and find the
//sum of those counts. We can use the built-in Set data structure to count unique items.
const scores1 = groups.map(group => {
	var answers = new Set();
	group.forEach(person => person.split('').forEach(answer => answers.add(answer)));
	return answers.size;
});

const total1 = scores1.reduce((a: number, b: number) => a + b, 0);
console.log('Part 1: The total of all the scores is', total1);

//Part 2: For each group, count the number of questions to which everyone answered "yes" and find
//the sum of those counts. Since we used sets before, let's stick with that and use an intersection
//of sets to find common answers. JavaScript's Set type doesn't do this natively, but we can make
//our own implementation.
const scores2 = groups.map(group => {
	const answerSets = group.map(person => {
		var answers = new Set();
		person.split('').forEach(answer => answers.add(answer));
		return answers;
	});

	const intersection = answerSets.reduce((asa, asb) => new Set([...asa].filter(a => asb.has(a))), answerSets[0]);
	return intersection.size;
});

const total2 = scores2.reduce((a: number, b: number) => a + b, 0);
console.log('Part 2: The total of all the scores is', total2);
