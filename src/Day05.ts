import {readFileSync} from 'fs';


//Read and parse the input file. Nifty Windows-compatible newline split courtesy of:
//https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
//If the input ends with a newline, split() will provide an extra empty string. Nasty!
//const input = readFileSync('src/Example06.txt', 'utf8').trim();
const input = readFileSync('src/Input06.txt', 'utf8').trim();
const lines = input.trim().split(/\r?\n/);

//The input is just a glorified binary string. B and R are 1, F and L are 0.
const seatNums: number[] = lines.map((id: string) => parseInt(id.replace(/(B|R)/g, '1').replace(/(F|L)/g, '0'), 2));

//Part 1: Find the largest seat number in the list.
const largestSeatNum = seatNums.reduce((n: number, m: number) => Math.max(n, m), 0);
console.log('Part 1: The largest seat number was', largestSeatNum);

//Part 2: Find your seat, which is the one missing in the middle of the list.
seatNums.sort((n: number, m: number) => ((n < m) ? -1 : ((n > m) ? 1 : 0)));
console.log('Part 2');
for (var s = 0; s < seatNums.length - 1; s++) {
	if (seatNums[s+1] != seatNums[s] + 1)
		console.log('Missing seat:', seatNums[s] + 1);
}
