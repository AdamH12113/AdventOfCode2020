import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example12.txt', 'utf8').trim();
const input = readFileSync('src/Input12.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);


//The input is list of movement directions followed by distance numbers
const instructions = lines.map(l => {
	const match = l.match(/([NSEWLRF])([0-9]+)/);
	if (match !== null)
		return {dir: match[1], dist: parseInt(match[2])};
	else
		throw new Error('Bad input: ' + l);
});


//Part 1: Figure out where the navigation instructions lead and find the Manhattan distance to the
//starting location.
var x = 0;
var y = 0;
var dir = [1,0];

for (var i of instructions) {
	const dist = i.dist;
	
	switch (i.dir) {
		case 'N': y += dist; break;
		case 'S': y -= dist; break;
		case 'E': x += dist; break;
		case 'W': x -= dist; break;
		case 'F':
			x += dist*dir[0];
			y += dist*dir[1];
			break;
		case 'L':
			var n = dist / 90;
			while (n--) {
				const newx = -dir[1];
				const newy = dir[0];
				dir = [newx, newy];
			}
			break;
		case 'R':
			var n = dist/90;
			while (n--) {
				const newx = dir[1];
				const newy = -dir[0];
				dir = [newx, newy];
			}
			break;
		default:
			throw new Error('Bad direction: ' + JSON.stringify(i));
	}
}

console.log('Part 1: The final X and Y coordinates are:', x, y, 'which sum to', Math.abs(x) + Math.abs(y));


//Part 2: Our interpretation of the instructions was wrong. Horribly, horribly wrong. NSEWRL move a
//waypoint, not the ship.
var wpx = 10;
var wpy = 1;
x = 0;
y = 0;

for (var i of instructions) {
	const dist = i.dist;
	
	switch (i.dir) {
		case 'N': wpy += dist; break;
		case 'S': wpy -= dist; break;
		case 'E': wpx += dist; break;
		case 'W': wpx -= dist; break;
		case 'F':
			x += dist * wpx;
			y += dist * wpy;
			break;
		case 'L':
			var n = dist / 90;
			while (n--) {
				const newwpx = -wpy;
				const newwpy = wpx;
				wpx = newwpx;
				wpy = newwpy;
			}
			break;
		case 'R':
			var n = dist/90;
			while (n--) {
				const newwpx = wpy;
				const newwpy = -wpx;
				wpx = newwpx;
				wpy = newwpy;
			}
			break;
		default:
			throw new Error('Bad direction: ' + JSON.stringify(i));
	}
}

console.log('Part 1: The final X and Y coordinates are:', x, y, 'which sum to', Math.abs(x) + Math.abs(y));
