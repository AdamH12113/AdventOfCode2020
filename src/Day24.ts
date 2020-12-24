import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example24.txt', 'utf8').trim();
const input = readFileSync('src/Input24.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);

function separateDirections(dirs: string) {
	var directions: string[] = [];
	
	var i = 0;
	while (i < dirs.length) {
		const two = dirs.substr(i, 2);
		const one = dirs.substr(i, 1);
		
		if (two == 'ne' || two == 'se' || two == 'sw' || two == 'nw') {
			directions.push(two);
			i += 2;
		} else {
			directions.push(one);
			i++;
		}
	}
	return directions;
}
const tileDirs = lines.map(separateDirections);

//We need to assign unique coordinates to each hexagonal tile. It turns out an easy way to do this
//is to use a three-axis coordinate system like the one shown here:
//  https://math.stackexchange.com/questions/2254655/hexagon-grid-coordinate-system
const neUnit = [1, 0, -1];
const eUnit = [1, -1, 0];
const seUnit = [0, -1, 1];
const swUnit = [-1, 0, 1];
const wUnit = [-1, 1, 0];
const nwUnit = [0, 1, -1];

function addCoords(c1: number[], c2: number[]): number[] {
	return [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
}
function dirToCoords(dir: string) {
	switch (dir) {
		case 'ne': return neUnit;
		case 'e': return eUnit;
		case 'se': return seUnit;
		case 'sw': return swUnit;
		case 'w': return wUnit;
		case 'nw': return nwUnit;
		default: throw new Error('Bad direction: ' + dir);
	}
}


//Part 1: Count how many tiles are black after flipping all the specified tiles.
var tiles: Set<string> = new Set();

for (var dirs of tileDirs) {
	var coords = [0, 0, 0];
	dirs.forEach((dir) => coords = addCoords(coords, dirToCoords(dir)));
	const coordStr = JSON.stringify(coords);
	if (tiles.has(coordStr))
		tiles.delete(coordStr);
	else
		tiles.add(coordStr);
}
console.log('Part 1: There are', tiles.size, 'black tiles');


//Part 2: The tiled floor is now a cellular automata. A black tile with zero or more than two black
//tiles adjacent to it becomes white. A white tile with exactly two black tiles adjacent to it is
//flipped to black.


