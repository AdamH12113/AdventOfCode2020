import {readFileSync} from 'fs';

//Read the input file.
//const input = readFileSync('src/Example21.txt', 'utf8').trim();
const input = readFileSync('src/Input21.txt', 'utf8').trim();
const lines = input.split(/\r?\n/);

type Food = {ingredients: string[], allergens: string[]};

function parseFood(desc: string): Food {
	const ingredients = desc.slice(0, desc.indexOf('(') - 1).split(' ');
	const allergenMatch = desc.match(/\(contains (([a-z]+,? ?)+)\)/);
	if (!allergenMatch)
		throw new Error('Bad allergen list: ' + desc);
	const allergens = allergenMatch[1].split(', ');
	return {ingredients: ingredients, allergens: allergens} as Food;
}

const foods: Food[] = lines.map(parseFood);

//We'll start by constructing a list of ingredient candidates for each allergen. Since each
//allergen appears in only one ingredient, the ingredient candidates should be the intersection
//of the ingredient sets for all foods that contain the allergen.
function intersection(arrays: any[][]) {
	var set = arrays[0];
	for (var a = 1; a < arrays.length; a++) {
		set = set.filter(e => arrays[a].includes(e));
	}
	return set;
}

var preCandidateList: {[allergen: string]: string[][]} = {};
for (var food of foods) {
	for (var allergen of food.allergens) {
		if (!preCandidateList[allergen])
			preCandidateList[allergen] = [];
		preCandidateList[allergen].push(food.ingredients);
	}
}
const allergens = Object.keys(preCandidateList);

type CandidateList = {[allergen: string]: string[] | string}
var candidateList: CandidateList = {};
for (var allergen of allergens) {
	candidateList[allergen] = intersection(preCandidateList[allergen]);
}

//Now we can use process of elimination to figure out which ingredients contain the allergens
var eliminated: string[] = [];
var done: boolean;
do {
	done = true;
	for (var allergen of allergens) {
		if (typeof candidateList[allergen] !== 'string') {
			if (candidateList[allergen].length == 1) {
				const ingredient: string = candidateList[allergen][0];
				candidateList[allergen] = ingredient;
				eliminated.push(ingredient);
			} else {
				for (var ei of eliminated) {
					const index = candidateList[allergen].indexOf(ei);
					if (index > -1) {
						(candidateList[allergen] as string[]).splice(index, 1);
					}
				}
				done = false;
			}
		}
	}
} while (!done);

const allergenIngredients = Object.values(candidateList);


//Part 1: How many ingredients *cannot* contain allergens?
var numAppearances = 0;
for (var food of foods) {
	for (var ingredient of food.ingredients) {
		if (!allergenIngredients.includes(ingredient))
			numAppearances++;
	}
}
console.log('Part 1: Safe ingredients appear', numAppearances, 'times');


//Part 2: Produce a canonical list of dangerous ingredients. This is a comma-separated list of
//ingredients sorted by allergen name.
var iList: string[] = [];
allergens.sort();
for (var allergen of allergens) {
	iList.push(candidateList[allergen] as string);
}
console.log('Part 2: The canonical dangerous ingredient list is', iList.join(','));


