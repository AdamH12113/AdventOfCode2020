import {readFileSync} from 'fs';


//Read and parse the input file. Nifty Windows-compatible newline split courtesy of:
//https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
//If the input ends with a newline, split() will provide an extra empty string. Nasty!
//const input = readFileSync('src/Example02.txt', 'utf8').trim();
const input = readFileSync('src/Input02.txt', 'utf8');
const lines = input.trim().split(/\r?\n/);

//Just for thrills, let's do this with a regex capture so we get input validation for free. The
//input format is:
//  N-M C: XXXXXXX
//where C is a character that must be present, N and M are the minimum and maximum number of times
//that character must be present, and XXXXXXX is a password of arbitrary length. Note that N and M
//may be multi-digit numbers.
const passwordList = lines.map(line => {
	const parseRegex = /([0-9]+)-([0-9]+) ([a-z]): ([a-z]+)/;
	const matchResult = line.match(parseRegex);
	if (matchResult == null)
		throw new Error('Bad input line: ' + line);
	return {min: parseInt(matchResult[1], 10), max: parseInt(matchResult[2], 10), char: matchResult[3], pw: matchResult[4]};
});

//Part 1: Count the number of valid passwords in the input. Let's do this the efficient way.
var validCount = 0;
for (var p of passwordList) {
	var charCount = 0;
	for (var c = 0; c < p.pw.length; c++) {
		if (p.pw[c] == p.char)
			charCount++;
	}
	if (charCount >= p.min && charCount <= p.max) {
		//console.log('Valid password:', p);
		validCount++;
	}
}
console.log('Part 1: There were', validCount, 'valid passwords in the list.');

//Part 2: Reinterpret the input. N and M now represent positions within the password string, and
//the character C must appear in exactly one of those positions.
validCount = 0;
for (var p of passwordList) {
	const c1 = (p.pw[p.min-1] == p.char);
	const c2 = (p.pw[p.max-1] == p.char);
	if ((c1 || c2) && !(c1 && c2)) {
		//console.log('Valid password:', p);
		validCount++;
	}
}
console.log('Part 2: There were', validCount, 'valid passwords in the list.');