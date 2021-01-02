import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example20.txt', 'utf8').trim();
const input = readFileSync('src/Input20.txt', 'utf8').trim();

const tilesText = input.split(/\r?\n\r?\n/);

//The tiles are 10x10 grids of binary values, each with a numeric tile ID. Even though part 1 only
//cares about the edges, I have a bad feeling part 2 is going to make me stack them or something,
//so let's create a full representation.
type Tile = {id: number, coords?: [number, number], rows: string[]};

function textToTile(text: string): Tile {
	const lines = text.split(/\r?\n/);
	
	//The tile IDs are all four digits, so we can cheat here
	const id = parseInt(lines[0].substr(5, 4), 10) as number;
	
	return {id: id, rows: lines.slice(1)};
}

const tileString = (tile: Tile) => tile.rows.join('\n');
const topEdge = (tile: Tile) => tile.rows[0];
const bottomEdge = (tile: Tile) => tile.rows[tile.rows.length - 1];
const leftEdge = (tile: Tile) => tile.rows.reduce((acc: string, row: string) => acc + row[0], '');
const rightEdge = (tile: Tile) => tile.rows.reduce((acc: string, row: string) => acc + row[row.length - 1], '');

function rotateRight(rows: string[]): string[] {
	var newRows: string[] = [];
	
	for (var c = 0; c < rows[0].length; c++) {
		var newRow: string[] = [];
		for (var r = rows.length - 1; r >= 0; r--) {
			newRow.push(rows[r][c]);
		}
		newRows.push(newRow.join(''));
	}
	return newRows;
}

function flip(rows: string[]): string[] {
	return rows.map((row: string) =>
		row.split('').reduceRight((acc, c) => {
			acc.push(c);
			return acc;
		}, [] as string[]).join(''));
}


//Check whether a candidate tile can connect to a fixed tile in any orientation. This function
//mutates the candidate tile, but returns it to its original state unless a match is found.
type TileMatch = {tile: Tile, location: 'above'|'below'|'left'|'right'};

function matchTile(base: Tile, candidate: Tile): TileMatch | undefined {
	const top = topEdge(base);
	const bottom = bottomEdge(base);
	const left = leftEdge(base);
	const right = rightEdge(base);
	
	for (var flipState = 0; flipState < 2; flipState++) {
		for (var rotation = 0; rotation < 4; rotation++) {
			if (top == bottomEdge(candidate))
				return {tile: candidate, location: 'above'};
			if (bottom == topEdge(candidate))
				return {tile: candidate, location: 'below'};
			if (left == rightEdge(candidate))
				return {tile: candidate, location: 'left'};
			if (right == leftEdge(candidate))
				return {tile: candidate, location: 'right'};
			
			candidate.rows = rotateRight(candidate.rows);
		}
		candidate.rows = flip(candidate.rows);
	}
	
	return undefined;
}


//Part 1: Assemble the tiles, then multiply the IDs of the corner tiles. Corner tiles are only
//connected to two other tiles, so we can count the matched edges to determine which tiles are
//in a corner.
var unmatchedTiles = tilesText.map(textToTile);
const firstTile = unmatchedTiles.splice(0, 1)[0];
firstTile.coords = [0, 0];
var matchedTiles = [firstTile];

while (unmatchedTiles.length > 0) {
	var match: TileMatch | undefined = undefined;
	
	for (var m of matchedTiles.keys()) {
		const fixed = matchedTiles[m];
		if (fixed.coords === undefined)
			throw new Error('Undefined coordinates: ' + JSON.stringify(fixed));

		for (var u of unmatchedTiles.keys()) {
			const match = matchTile(fixed, unmatchedTiles[u]);
			
			if (match !== undefined) {
				unmatchedTiles.splice(u, 1);
				var newCoords = [fixed.coords[0], fixed.coords[1]] as [number, number];
				switch (match.location) {
					case 'above': newCoords[1]++; break;
					case 'below': newCoords[1]--; break;
					case 'right': newCoords[0]++; break;
					case 'left':  newCoords[0]--; break;
				}
				match.tile.coords = newCoords;
				matchedTiles.push(match.tile);
				break;
			}
		}
		
		//Restart the outer loop to prevent problems from iterating over a changing list
		if (match !== undefined)
			break;
	}
}

//Sort the tiles by coordinate to align them on a grid
matchedTiles.sort((a, b) => {
	if (a.coords === undefined || b.coords === undefined)
		throw new Error('Bad coords in sort: ' + JSON.stringify(a) + JSON.stringify(b));

	if (a.coords[1] > b.coords[1]) {
		return 1;
	} else if (a.coords[1] < b.coords[1]) {
		return -1;
	} else {
		if (a.coords[0] > b.coords[0])
			return 1;
		else if (a.coords[0] < b.coords[0])
			return -1;
		else
			return 0;
	}
});

const gridSize = Math.sqrt(matchedTiles.length);
const cornerIds: number[] = [matchedTiles[0].id, matchedTiles[gridSize-1].id, matchedTiles[gridSize**2 - 1].id, matchedTiles[gridSize**2 - gridSize].id];
const product = cornerIds.reduce((acc, i) => acc * i, 1);
console.log('Part 1: The corner tiles IDs are', cornerIds, 'and their product is', product);


//Part 2: Count how many sea monsters there are in the image. Subtract those squares and count the
//number of '#' squares that remain.
function countWaves(map: string[]): number {
	//No pun intended
	return map.reduce((acc: number, row: string) => acc + (row.match(/#/g) || []).length, 0);
}

const seaMonster = [
'..................#.',
'#....##....##....###',
'.#..#..#..#..#..#...'
];
const mwidth = seaMonster[0].length;
const mheight = seaMonster.length;
const mfilled = countWaves(seaMonster);

//Merge the tiles into a single "image"
const tsize = matchedTiles[0].rows.length;
var sea: string[] = [];
for (var r = 0; r < gridSize * tsize; r++) {
	if (r % tsize == 0 || r % tsize == tsize - 1)
		continue;
		
	var row: string[] = [];
	for (var c = 0; c < gridSize * tsize; c++) {
		if (c % tsize == 0 || c % tsize == tsize - 1)
			continue;
		
		const t = gridSize*Math.floor(r / tsize) + Math.floor(c / tsize);
		const trow = (tsize - 1) - (r % tsize);
		const tcol = c % tsize;
		
		row.push(matchedTiles[t].rows[trow][tcol]);
	}
	sea.push(row.join(''));
}

function checkForMonster(map: string[]): boolean {
	for (var r = 0; r < mheight; r++) {
		for (var c = 0; c < mwidth; c++) {
			if (seaMonster[r][c] == '#' && map[r][c] != '#')
				return false;
		}
	}
	return true;
}

//Only one orientation will have any sea monsters
var monsterCount = 0;
for (var f = 0; f < 2 && monsterCount == 0; f++) {
	for (var rot = 0; rot < 4 && monsterCount == 0; rot++) {
		for (var r = 0; r < sea.length - mheight; r++) {
			for (var c = 0; c < sea[0].length - mwidth; c++) {
				const mapPiece = sea.slice(r, r + mheight).map(row => row.substr(c, mwidth));
				if (checkForMonster(mapPiece))
					monsterCount++;
			}
		}
		sea = rotateRight(sea);
	}
	sea = flip(sea);
}

const numRealWaves = countWaves(sea) - monsterCount * mfilled;
console.log('Part 2: The number of real waves is', numRealWaves);
