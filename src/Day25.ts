//The input is just two numbers. No need to bother with an input file.

//const keys = [5764801, 17807724];  //Example
const keys = [10441485, 1004920];  //Puzzle

const transform = (sn: number, i: number) => (sn * i) % 20201227;


//Part 1 (the only part): Find the secret encryption key. First we have to find the loop sizes of
//the door and the card, then add them together and loop to compute the secret key.
console.log('Part 1');
var i = 1;
var loopSizes = [0, 0];
var n = 1;
while (loopSizes[0] == 0 || loopSizes[1] == 0) {
	//The subject number is (arbitrarily?) 7 for the loop size computation
	i = transform(7, i);
	if (i == keys[0]) {
		loopSizes[0] = n;
		console.log('The card loop size is', n);
	}
	if (i == keys[1]) {
		loopSizes[1] = n;
		console.log('The door loop size is', n);
	}
	n++;
}

i = 1;
for (var n = 1; n <= loopSizes[0]; n++) {
	i = transform(keys[1], i);
}
console.log('The encryption key is', i);
