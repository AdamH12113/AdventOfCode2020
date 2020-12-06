import {readFileSync} from 'fs';


//Read and parse the input file. Nifty Windows-compatible newline split courtesy of:
//https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
//If the input ends with a newline, split() will provide an extra empty string. Nasty!
//const input = readFileSync('src/Example04b.txt', 'utf8').trim();
const input = readFileSync('src/Input04.txt', 'utf8');

//Passports are key:value pairs separated by two newlines. Single newlines are treated like spaces.
const passportText = input.trim().split(/\r?\n\r?\n/);
const passports = passportText.map((pt: string) => {
	const fieldObjects = pt.split(/( |\r?\n)/).map((fieldText: string) => {
		const keyVal = fieldText.split(':');
		return {key: keyVal[0], value: keyVal[1]};
	});
	var passport: {[key: string]: string} = {};
	for (var field of fieldObjects) {
		passport[field.key] = field.value;
	}
	return passport;
});


//Part 1: Count the number of valid passports. Valid passports are required to have all possible
//fields except for cid, which is optional. I supposed the easy approach would be to use Lodash
//to get an array-summing function, but Stack Overflow seems to recommend reduce().
const validCount1 = passports.map(p => (p.byr && p.iyr && p.eyr && p.hgt && p.hcl && p.ecl && p.pid) ? 1 : 0)
                            .reduce((a: number, b: number) => a + b, 0);
console.log('Part 1: There were', validCount1, 'valid passports.');


//Part 2: Now valid passports are required to have all possible fields *and* valid content in those
//fields. The rules for validity are:
//  byr: four-digit number between 1920 and 2002 (inclusive)
//  iyr: same, 2010-2020
//  eyr: same, 2020-2030
//  hgt: number plus unit, 150-193cm or 59-76in
//  hcl: # followed by a six-digit hex value
//  ecl: one of amb, blu, brn, gry, grn, hazl, oth
//  pid: nine-digit number with leading zeros if necessary
//  cid: still ignored
const validCount2 = passports.map(p => {
	function validateHgt(hgt: string) {
		const hgtMatch = hgt.match(/^([0-9]{2,3})(cm|in)$/);
		if (hgtMatch) {
			const num = parseInt(hgtMatch[1]);
			const units = hgtMatch[2];
			if (units == 'in')
				return (num >= 59 && num <= 76);
			else if (units == 'cm')
				return (num >= 150 && num <= 193);
			else
				return false;
		} else {
			return false;
		}
	}
	
	const validByr = (p.byr && p.byr.length == 4 && parseInt(p.byr) >= 1920 && parseInt(p.byr) <= 2002);
	const validIyr = (p.iyr && p.iyr.length == 4 && parseInt(p.iyr) >= 2010 && parseInt(p.iyr) <= 2020);
	const validEyr = (p.eyr && p.eyr.length == 4 && parseInt(p.eyr) >= 2020 && parseInt(p.eyr) <= 2030);
	const validHgt = (p.hgt && validateHgt(p.hgt));
	const validHcl = (p.hcl && p.hcl.match(/^#[0-9a-f]{6}$/));
	const validEcl = (p.ecl && p.ecl.match(/^(amb|blu|brn|gry|grn|hzl|oth)$/));
	const validPid = (p.pid && p.pid.match(/^[0-9]{9}$/));
	
	return (validByr && validIyr && validEyr && validHgt && validHcl && validEcl && validPid) ? 1 : 0;
}).reduce((a: number, b: number) => a + b, 0);

console.log('Part 2: There were', validCount2, 'valid passports.');
