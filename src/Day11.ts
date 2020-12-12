import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example11.txt', 'utf8').trim();
const input = readFileSync('src/Input11.txt', 'utf8').trim();
const lines = input.split(/\r?\n/).map(l => l.split(''));

//The input is a rectangular grid where each character represents one space in the seat layout. We
//can get the dimensions of the grid from the input array lengths. We'll make (0, 0) the top-left
//of the grid. We'll need to pretty-print the grid for debug, so let's go ahead and make it a class.
//The meanings of the characters are:
//  'L'  Empty seat
//  '#'  Occupied seat
//  '.'  Floor
type Cell = 'L' | '.' | '#';
type GridObject = {[index: number]: {[index: number]: Cell}};

class Grid {
	static occupied: Cell = '#';
	static empty: Cell = 'L';
	static floor: Cell = '.';
	
	grid: GridObject;
	xlim: number;
	ylim: number;

	constructor(lines: string[][]) {
		this.ylim = lines.length;
		this.xlim = lines[0].length;
		this.grid = {};

		//This is mainly a self-indulgent swapping of the array indices
		for (var x = 0; x < this.xlim; x++) {
			this.grid[x] = {};

			for (var y = 0; y < this.ylim; y++) {
				this.grid[x][y] = lines[y][x] as Cell;
			}
		}
	}

	print() {
		var cells: string[] = [];

		for (var y = 0; y < this.ylim; y++) {
			for (var x = 0; x < this.xlim; x++) {
				cells.push(this.grid[x][y]);
			}
			cells.push('\n');
		}
		console.log(cells.join(''));
	}

	isEmptySeat(x: number, y: number): boolean {return (this.grid[x][y] == Grid.empty);}
	isOccupied(x: number, y: number): boolean  {return (this.grid[x][y] == Grid.occupied);}

	//Edge handling is the most annoying part of cellular automata
	countAdjacentOccupied(x: number, y: number): number {
		const xnz = (x > 0);
		const xnm = (x < this.xlim - 1);
		const ynz = (y > 0);
		const ynm = (y < this.ylim - 1);

		var count = 0;
		if (ynz && xnz && this.isOccupied(x-1, y-1)) count++;
		if (ynz &&        this.isOccupied(x  , y-1)) count++;
		if (ynz && xnm && this.isOccupied(x+1, y-1)) count++;

		if (xnz &&        this.isOccupied(x-1, y  )) count++;
		if (xnm &&        this.isOccupied(x+1, y  )) count++;

		if (ynm && xnz && this.isOccupied(x-1, y+1)) count++;
		if (ynm &&        this.isOccupied(x  , y+1)) count++;
		if (ynm && xnm && this.isOccupied(x+1, y+1)) count++;

		return count;
	}
	
	equals(otherGrid: GridObject): boolean {
		for (var x = 0; x < this.xlim; x++) {
			for (var y = 0; y < this.ylim; y++) {
				if (this.grid[x][y] != otherGrid[x][y])
					return false;
			}
		}
		return true;
	}
	
	//And at this point I started to think that an array of arrays would have been a better data
	//structure so that I could use map() instead of writing this same nested for loop over and over.
	countAllOccupied(): number {
		var count = 0;
		for (var x = 0; x < this.xlim; x++) {
			for (var y = 0; y < this.ylim; y++) {
				if (this.isOccupied(x, y))
					count++;
			}
		}
		return count;
	}

	//These rules are applied to every seat *simultaneously* -- that is, we can't just iterate over
	//the grid and update as we go.
	//  1. If a seat is empty and no adjacent seats are occupied, the seat becomes occupied.
	//  2. If a seat is occupied and four or more adjacent seats are occupied, the seat becomes empty.
	evolve1(): boolean {
		var newGrid: GridObject = {};

		for (var x = 0; x < this.xlim; x++) {
			newGrid[x] = {};

			for (var y = 0; y < this.ylim; y++) {
				if (this.isEmptySeat(x, y) && this.countAdjacentOccupied(x, y) == 0)
					newGrid[x][y] = Grid.occupied;
				else if (this.isOccupied(x, y) && this.countAdjacentOccupied(x, y) >= 4)
					newGrid[x][y] = Grid.empty;
				else
					newGrid[x][y] = this.grid[x][y];
			}
		}
		
		const changed = !this.equals(newGrid);
		this.grid = newGrid;
		return changed;
	}
	
	//Count the number of *seen* occupied seats from the perspective of the given coordinates. This
	//checks the eight cardinal directions around a seat looking for the first visible (non-floor)
	//object. If it's an occupied seat, that contributes to the count. If it's an empty seat, or if
	//there are no seats in that direction, the count remains unchanged.
	countSeenOccupied(x: number, y: number) {
		//We have to use an arrow function here in order to keep 'this' from the calling function
		const seek = (dx: number, dy: number): number => {
			for (var tx = x+dx, ty = y+dy;
			     tx >= 0 && tx <= this.xlim-1 && ty >= 0 && ty <= this.ylim-1;
			     tx += dx, ty += dy) {
				if (this.isOccupied(tx, ty))
					return 1;
				else if (this.isEmptySeat(tx, ty))
					break;
			}
			return 0;
		}
		
		const count = seek(-1, -1) + seek(0, -1) + seek(1, -1) +
		              seek(-1, 0)  +               seek(1, 0) +
		              seek(-1, 1)  + seek(0, 1)  + seek(1, 1);

		return count;
	}

	//New rules -- we're now using "seen" instead of "adjacent" (see above), and the threshold for
	//abandoning a seat is 5 instead of 4.
	evolve2(): boolean {
		var newGrid: GridObject = {};

		for (var x = 0; x < this.xlim; x++) {
			newGrid[x] = {};

			for (var y = 0; y < this.ylim; y++) {
				if (this.isEmptySeat(x, y) && this.countSeenOccupied(x, y) == 0)
					newGrid[x][y] = Grid.occupied;
				else if (this.isOccupied(x, y) && this.countSeenOccupied(x, y) >= 5)
					newGrid[x][y] = Grid.empty;
				else
					newGrid[x][y] = this.grid[x][y];
			}
		}
		
		const changed = !this.equals(newGrid);
		this.grid = newGrid;
		return changed;
	}
	
}


//Part 1: Count the number of occupied seats after the grid stops changing.
var grid1 = new Grid(lines);
while (grid1.evolve1()) {;}
console.log('Part 1: The number of occupied seats is', grid1.countAllOccupied());


//Part 2: Count the number of occupied seats after the grid stops changing with the new rules.
var grid2 = new Grid(lines);
while (grid2.evolve2()) {;}
console.log('Part 2: The number of occupied seats is', grid2.countAllOccupied());
