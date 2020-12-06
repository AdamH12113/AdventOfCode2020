import {readFileSync} from 'fs';


//Read and parse the input file. Nifty Windows-compatible newline split courtesy of:
//https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
//If the input ends with a newline, split() will provide an extra empty string. Nasty!
//const input = readFileSync('src/Example03.txt', 'utf8').trim();
const input = readFileSync('src/Input03.txt', 'utf8');
const lines = input.trim().split(/\r?\n/);

//The input is a series of lines where each character indicates the presence or absence of a tree
//in a row. Periods (.) indicate no tree and pound signs (#) indicate trees. We need to construct
//a coordinate system whose origin is the first character on the first line.
const landscape = lines.map(line => line.split('').map(c => (c == '#' ? 1 : 0)));
const maxX = landscape[0].length;
const maxY = landscape.length;
console.log('Pattern repeats every', maxX, 'horizontal spaces');
console.log('Pattern is', maxY, 'spaces tall');

//Part 1: Count how many trees are encountered by traveling with a slope of right 3, down 1.
interface ISlope {x: number, y: number};
function countTrees(landscape: number[][], slope: ISlope): number {
	var treeCount = 0;
	var x = 0;
	
	for (var y = 0; y < maxY; y += slope.y) {
		treeCount += landscape[y][x];
		x = (x + slope.x) % maxX;
	}
	
	return treeCount;
}

const part1Count = countTrees(landscape, {x: 3, y: 1});
console.log('Part 1: Encountered', part1Count, 'trees');

//Part 2: Try several different slopes.
const slopeList: ISlope[] = [{x:1,y:1}, {x:3,y:1}, {x:5,y:1}, {x:7,y:1}, {x:1,y:2}];
var totalProduct = 1;

//Remember to use 'of' instead of 'in' in the for loop. This was one of the hardest things about
//learning JavaScript for me because 'in' does something else, so it's not a syntax error.
console.log('Part 2:');
for (var slope of slopeList) {
	const count = countTrees(landscape, slope);
	console.log('Encountered', count, 'trees with slope', slope);
	totalProduct *= count;
}
console.log('Total product:', totalProduct);
