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
type Coord = [number, number, number];
const neUnit: Coord = [1, 0, -1];
const eUnit: Coord = [1, -1, 0];
const seUnit: Coord = [0, -1, 1];
const swUnit: Coord = [-1, 0, 1];
const wUnit: Coord = [-1, 1, 0];
const nwUnit: Coord = [0, 1, -1];

function addCoords(c1: Coord, c2: Coord): Coord {
	return [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];
}
function dirToCoords(dir: string): Coord {
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
	var coords: Coord = [0, 0, 0];
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
function countAdjacentBlackTiles(coords: Coord, tiles: Set<string>) {
	return (tiles.has(JSON.stringify(addCoords(coords, neUnit))) ? 1 : 0) +
	       (tiles.has(JSON.stringify(addCoords(coords, eUnit))) ? 1 : 0) +
	       (tiles.has(JSON.stringify(addCoords(coords, seUnit))) ? 1 : 0) +
	       (tiles.has(JSON.stringify(addCoords(coords, swUnit))) ? 1 : 0) +
	       (tiles.has(JSON.stringify(addCoords(coords, wUnit))) ? 1 : 0) +
	       (tiles.has(JSON.stringify(addCoords(coords, nwUnit))) ? 1 : 0);
}

function step(tiles: Set<string>) {
	var newTiles: Set<string> = new Set();
	
	//Find the minimum and maximum coordinates
	var xmin = 0, xmax = 0, ymin = 0, ymax = 0, zmin = 0, zmax = 0;
	for (var tile of tiles) {
		const coords: Coord = JSON.parse(tile) as Coord;
		if (coords[0] < xmin) xmin = coords[0];
		if (coords[0] > xmax) xmax = coords[0];
		if (coords[1] < ymin) ymin = coords[1];
		if (coords[1] > ymax) ymax = coords[1];
		if (coords[2] < zmin) zmin = coords[2];
		if (coords[2] > zmax) zmax = coords[2];
	}
	xmin--; ymin--; zmin--;
	xmax++; ymax++; zmax++;
	
	for (var x = xmin; x <= xmax; x++) {
		for (var y = ymin; y <= ymax; y++) {
			for (var z = zmin; z <= zmax; z++) {
				//Valid three-axis coordinates always sum to zero
				if (x + y + z != 0)
					continue;
				
				const coordText = JSON.stringify([x, y, z]);
				const isBlack = tiles.has(coordText);
				const adjacentBlack = countAdjacentBlackTiles([x, y, z], tiles);
				if (isBlack && !(adjacentBlack == 0 || adjacentBlack > 2))
					newTiles.add(coordText);
				else if (!isBlack && adjacentBlack == 2)
					newTiles.add(coordText);
			}
		}
	}
	return newTiles;
}

for (var s = 0; s < 100; s++) {
	tiles = step(tiles);
}
console.log('Part 2: There are now', tiles.size, 'black tiles');
