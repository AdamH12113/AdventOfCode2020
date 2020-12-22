import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example17.txt', 'utf8').trim();
const input = readFileSync('src/Input17.txt', 'utf8').trim();

const initChars = input.split(/\r?\n/).map(line => line.split(''));
const initMaxX = initChars[0].length - 1;
const initMaxY = initChars.length - 1;

//We need a way of representing the position of active cubes in a 3D space. I have a feeling that
//part 2 is going to require a *lot* of iterations, so let's start with a sparse representation
//using a JS Map. It would be nice if the keys could be an array of numbers which acts as a
//coordinate tuple. Sadly, JS Maps only do shallow equality testing. Oh well -- guess we'll have
//to stringify.
type ActiveState = Map<string, boolean>;
type State = {xMin: number, xMax: number, yMin: number, yMax: number, zMin: number, zMax: number, actives: ActiveState};
var initState: State = {xMin: 0, xMax: initMaxX, yMin: 0, yMax: initMaxY, zMin: 0, zMax: 0, actives: new Map()};

const makeKey = (x: number, y: number, z: number) => JSON.stringify([x, y, z]);

for (var x = 0; x <= initMaxX; x++) {
	for (var y = 0; y <= initMaxY; y++) {
		if (initChars[y][x] == '#') {
			initState.actives.set(makeKey(x, y, 0), true);
		}
	}
}

//JavaScript doesn't provide an easy way to deep-copy objects, so let's make our own.
function duplicateState(state: State): State {
	return {xMin: state.xMin, xMax: state.xMax, yMin: state.yMin, yMax: state.yMax, zMin: state.zMin, zMax: state.zMax, actives: new Map(state.actives)};
}

//Pretty-print the state for debug
function printState(state: State) {
	var outStrings: string[] = [];
	outStrings.push(`x: ${state.xMin} ${state.xMax}   y: ${state.yMin} ${state.yMax}   z: ${state.zMin} ${state.zMax}\n`);
	
	for (var z = state.zMin; z <= state.zMax; z++) {
		for (var y = state.yMin; y <= state.yMax; y++) {
			for (var x = state.xMin; x <= state.xMax; x++) {
				outStrings.push((state.actives.get(makeKey(x, y, z))) ? '#' : '.');
			}
			outStrings.push('\n');
		}
		outStrings.push('\n');
	}
	console.log(outStrings.join(''));
}

//Count the number of active neighbors for a single coordinate
function countActiveNeighbors(cx: number, cy: number, cz: number, actives: ActiveState) {
	var count = 0;
	for (var x = cx - 1; x <= cx + 1; x++) {
		for (var y = cy - 1; y <= cy + 1; y++) {
			for (var z = cz - 1; z <= cz + 1; z++) {
				if (x == cx && y == cy && z == cz)
					continue;
				else if (actives.has(makeKey(x, y, z)))
					count++;
			}
		}
	}
	return count;
}

//Run one step of the simulation
function simStep(state: State): State {
	var newActives: ActiveState = new Map();
	
	//The range of active cubes can only expand at most one cube in every direction
	for (var x = state.xMin - 1; x <= state.xMax + 1; x++) {
		for (var y = state.yMin - 1; y <= state.yMax + 1; y++) {
			for (var z = state.zMin - 1; z <= state.zMax + 1; z++) {
				const neighborCount = countActiveNeighbors(x, y, z, state.actives);

				if (state.actives.has(makeKey(x, y, z))) {
					if (neighborCount == 2 || neighborCount == 3)
						newActives.set(makeKey(x, y, z), true);
				} else if (neighborCount == 3) {
					newActives.set(makeKey(x, y, z), true);
				}
			}
		}
	}
	
	//Update the new min and max coordinate values. It would be more efficient to fold this into
	//the active cube update.
	var xMin = 0, xMax = 0, yMin = 0, yMax = 0, zMin = 0, zMax = 0;
	for (var keyString of newActives.keys()) {
		const k = JSON.parse(keyString);
		if (k[0] < xMin) xMin = k[0];
		if (k[0] > xMax) xMax = k[0];
		if (k[1] < yMin) yMin = k[1];
		if (k[1] > yMax) yMax = k[1];
		if (k[2] < zMin) zMin = k[2];
		if (k[2] > zMax) zMax = k[2];
	}
	return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, zMin: zMin, zMax: zMax, actives: newActives};
}


//Part 1: How many cubes are active after six cycles?
var state = duplicateState(initState);
for (var c = 0; c < 6; c++) {
	state = simStep(state);
}
console.log('Part 1: There are', state.actives.size, 'active cubes');



//Part 2: Now there are four dimensions! The rules are the same, though. I'm in a hurry so let's
//do a last copy/paste/modify for this one. This is horrible and I feel horrible for doing it. :-(
type State4 = {xMin: number, xMax: number, yMin: number, yMax: number, zMin: number, zMax: number, wMin: number, wMax: number, actives: ActiveState};
var initState4: State4 = {xMin: 0, xMax: initMaxX, yMin: 0, yMax: initMaxY, zMin: 0, zMax: 0, wMin: 0, wMax: 0, actives: new Map()};

const makeKey4 = (x: number, y: number, z: number, w: number) => JSON.stringify([x, y, z, w]);

for (var x = 0; x <= initMaxX; x++) {
	for (var y = 0; y <= initMaxY; y++) {
		if (initChars[y][x] == '#') {
			initState4.actives.set(makeKey4(x, y, 0, 0), true);
		}
	}
}

//JavaScript doesn't provide an easy way to deep-copy objects, so let's make our own.
function duplicateState4(state: State4): State4 {
	return {xMin: state.xMin, xMax: state.xMax, yMin: state.yMin, yMax: state.yMax, zMin: state.zMin, zMax: state.zMax, wMin: state.wMin, wMax: state.wMax, actives: new Map(state.actives)};
}

//Pretty-print the state for debug
function printState4(state: State4) {
	var outStrings: string[] = [];
	outStrings.push(`x: ${state.xMin} ${state.xMax}   y: ${state.yMin} ${state.yMax}   z: ${state.zMin} ${state.zMax}   w: ${state.wMin} ${state.wMax}\n`);
	
	for (var w = state.wMin; w <= state.wMax; w++) {
		for (var z = state.zMin; z <= state.zMax; z++) {
			for (var y = state.yMin; y <= state.yMax; y++) {
				for (var x = state.xMin; x <= state.xMax; x++) {
					outStrings.push((state.actives.get(makeKey4(x, y, z, w))) ? '#' : '.');
				}
				outStrings.push('\n');
			}
			outStrings.push('\n');
		}
		outStrings.push('--------------------\n');
	}
	console.log(outStrings.join(''));
}

//Count the number of active neighbors for a single coordinate
function countActiveNeighbors4(cx: number, cy: number, cz: number, cw: number, actives: ActiveState) {
	var count = 0;
	for (var x = cx - 1; x <= cx + 1; x++) {
		for (var y = cy - 1; y <= cy + 1; y++) {
			for (var z = cz - 1; z <= cz + 1; z++) {
				for (var w = cw - 1; w <= cw +1; w++) {
					if (x == cx && y == cy && z == cz && w == cw)
						continue;
					else if (actives.has(makeKey4(x, y, z, w)))
						count++;
				}
			}
		}
	}
	return count;
}

//Run one step of the simulation
function simStep4(state: State4): State4 {
	var newActives: ActiveState = new Map();
	
	//The range of active cubes can only expand at most one cube in every direction
	for (var x = state.xMin - 1; x <= state.xMax + 1; x++) {
		for (var y = state.yMin - 1; y <= state.yMax + 1; y++) {
			for (var z = state.zMin - 1; z <= state.zMax + 1; z++) {
				for (var w = state.wMin - 1; w <= state.wMax + 1; w++) {
					const neighborCount = countActiveNeighbors4(x, y, z, w, state.actives);

					if (state.actives.has(makeKey4(x, y, z, w))) {
						if (neighborCount == 2 || neighborCount == 3)
							newActives.set(makeKey4(x, y, z, w), true);
					} else if (neighborCount == 3) {
						newActives.set(makeKey4(x, y, z, w), true);
					}
				}
			}
		}
	}
	
	//Update the new min and max coordinate values. It would be more efficient to fold this into
	//the active cube update.
	var xMin = 0, xMax = 0, yMin = 0, yMax = 0, zMin = 0, zMax = 0, wMin = 0, wMax = 0;
	for (var keyString of newActives.keys()) {
		const k = JSON.parse(keyString);
		if (k[0] < xMin) xMin = k[0];
		if (k[0] > xMax) xMax = k[0];
		if (k[1] < yMin) yMin = k[1];
		if (k[1] > yMax) yMax = k[1];
		if (k[2] < zMin) zMin = k[2];
		if (k[2] > zMax) zMax = k[2];
		if (k[3] < wMin) wMin = k[3];
		if (k[3] > wMax) wMax = k[3];
	}
	return {xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, zMin: zMin, zMax: zMax, wMin: wMin, wMax: wMax, actives: newActives};
}

var state4 = duplicateState4(initState4);
for (var c = 0; c < 6; c++) {
	state4 = simStep4(state4);
}
console.log('Part 2: There are', state4.actives.size, 'active cubes');




