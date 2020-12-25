import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example20.txt', 'utf8').trim();
const input = readFileSync('src/Input20.txt', 'utf8').trim();

const tilesText = input.split(/\r?\n\r?\n/);

//The tiles are 10x10 grids of binary values, each with a numeric tile ID. Even though part 1 only
//cares about the edges, I have a bad feeling part 2 is going to make me stack them or something,
//so let's create a full representation.
type Side = {
	pattern: string,
	matched: number
};
type Tile = {
	id: number,
	pixels: number[][],
	sides: Side[]
};

function textToTile(text: string): Tile {
	const lines = text.split(/\r?\n/);
	
	//The tile IDs are all four digits, so we can cheat here
	const id = parseInt(lines[0].substr(5, 4), 10) as number;
	
	var pixels: number[][] = [];
//	lines.slice(1).forEach((line) => {
//		pixels.push(line.split('').map(c => ((c == '#') ? 1 : 0)));
//	});
	
	var sides: Side[] = [];
	sides.push({pattern: lines[1], matched: 0});
	sides.push({pattern: lines[lines.length - 1], matched: 0});
	sides.push({pattern: lines.slice(1).reduce((acc: string, line: string) => acc + line[0], ''), matched: 0});
	sides.push({pattern: lines.slice(1).reduce((acc: string, line: string) => acc + line[line.length - 1], ''), matched: 0});
	
	return {id: id, pixels: pixels, sides: sides};
}

const countMatchedEdges = (tile: Tile) => tile.sides.reduce((acc: number, side: Side) => acc + ((side.matched != 0) ? 1 : 0), 0);

function matchTiles(tiles: Tile[]) {
	for (var t1 = 0; t1 < tiles.length - 1; t1++) {
		for (var t2 = t1+1; t2 < tiles.length; t2++) {
			for (var s1 of tiles[t1].sides) {
				if (s1.matched != 0)
					continue;
				for (var s2 of tiles[t2].sides) {
					if (s2.matched != 0)
						continue;
					if (s1.pattern == s2.pattern || s1.pattern == s2.pattern.split('').reverse().join('')) {
						s1.matched = tiles[t2].id;
						s2.matched = tiles[t1].id;
					}
				}
			}
		}
	}
}


//Part 1: Assemble the tiles, then multiply the IDs of the corner tiles. Corner tiles are only
//connected to two other tiles, so we can count the matched edges to determine which tiles are
//in a corner.
var tiles = tilesText.map(textToTile);
matchTiles(tiles);
var cornerTileIds: number[] = [];
tiles.map((tile: Tile) => ((countMatchedEdges(tile) == 2) ? cornerTileIds.push(tile.id) : 0));
const product = cornerTileIds.reduce((acc: number, id: number) => acc * id, 1);
console.log('Part 1: The corner tiles IDs are', cornerTileIds, 'and their product is', product);





