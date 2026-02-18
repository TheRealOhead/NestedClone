import { chooseFromArray } from './misc';

function applyIndefiniteArticle(str : string) : string {
	if ('aeiou'.includes(str.charAt(0))) {
		return 'an ' + str;
	}
	return 'a ' + str;
}

let cardinalDirections : string[] = ['North', 'South', 'East', 'West'];
let foods = {
	countable: [
		'apple',
		'orange',
		'sandwich',
		'hamburger',
		'salad',
		'hotdog',
		'banana'
	],
	uncountable: [
		'chips',
		'caviar',
		'cereal',
		'spaghetti',
		'meatloaf',
		'soup',
		'ice cream',
		'yogurt',
		'pizza'
	]
};

export let nameGenerator : Record<string, Function> = {
	
	continent: () => {
		const prefixes = ['North Ame', 'South Ame', 'Afr', 'As', 'Ant', 'Eur', 'Oc'];
		const suffixes = ['rica', 'ica', 'ope', 'ia', 'arctica', 'ceana'];

		return chooseFromArray(prefixes) + chooseFromArray(suffixes);
	},

	country: () => {
		const preprefixes = ['United States of ', 'Republic of ', '', '', '', '', '', ''];
		const prefixes = ['Pak', 'Nic', 'Mex', 'Canad', 'Irel', 'Chin', 'Plob', 'Ins', 'Flub', 'Glorb', 'Schmub', 'Plumb'];
		const suffixes = ['aria', 'orus', 'istan', 'eria', 'ico', 'ula', 'ebria'];

		let name : string = chooseFromArray(preprefixes) + chooseFromArray(prefixes) + chooseFromArray(suffixes);

		if (Math.random() < .1) {
			return chooseFromArray(cardinalDirections) + ' ' + name;
		}

		return name;
	},

	thought: () => {
		return chooseFromArray([
			'I need to pick up more milk today',
			'I miss my childhood dog',
			'I wonder if they\'d notice if I left',
			'I\'m having a great day today',
			'How come T-Rexes had such short arms?',
			'What was that one band called?',
			'My back itches',
			'I think I forgot how to do long division',
			'They don\'t make \'em like they used to',
			'I don\'t have a care in the world',
			'Why\'d they stop making that cereal?',
			'I could go for ' + applyIndefiniteArticle(chooseFromArray(foods.countable)),
			'I could go for some ' + chooseFromArray(foods.uncountable),
			'What if my entire life is just a simulation? Perhaps this very thought was typed up by some college student who\'s supposed to be doing his homework and is working on a personal project instead? If that\'s so, is someone reading my thoughts? Are my thoughts randomly generated? Nah, that\'s too far-fetched',
			'I think I need a new computer',
			'My phone is low on battery',
			'JavaScript sucks',
			'Man, I love TypeScript',
			'That was a rude thing to say',
			'That was a funny video',
			'My mom makes the best meatloaf'
		]);
	},

	person: () => {
		const firstNames = [
			'Alice',
			'Alex',
			'Andrew',
			'Betty',
			'Bart',
			'Cindy',
			'Charlie',
			'Calvin',
			'Dottie',
			'David',
			'Ellen',
			'Evan',
			'Evin',
			'Francene',
			'Frank',
			'Gertrude',
			'Gil',
			'Gaylord',
			'Helen',
			'Harold',
			'Ivan',
			'Jay',
			'Jennifer',
			'Jack',
			'Joshua',
			'Kisari',
			'Katelin',
			'Lillian',
			'Leo',
			'Lars',
			'May',
			'Michael',
			'Nikolai',
			'Nick',
			'Nadine',
			'Owen',
			'Olivia',
			'Parker',
			'Patrick',
			'Quinn',
			'Red',
			'Ryan',
			'Steven',
			'Sarah',
			'Tyler',
			'Tina',
			'Valorie',
			'William',
			'Xavier',
			'Yancy',
			'Zack'
		];
		const lastNames = [
			'Andrews',
			'Adams',
			'Addams',
			'Clemonts',
			'Davidson',
			'Evans',
			'Fitzgerald',
			'Gilraine',
			'Howards',
			'Johnson',
			'Jackson',
			'Larson',
			'Michaels',
			'Myers',
			'Owens',
			'Parker',
			'Reagan',
			'Stevens',
			'Saturn',
			'Smith',
			'Smith',
			'Smith',
			'Williams',
			'White',
			'Black',
			'Brown'
		];

		const prefixes = ['Prof. ', 'Dr. ', 'Rev. ', '', '', '', '', '', '', ''];
		const suffixes = [' Jr.', ' Sr.', ' III', '', '', '', '', '', '', '', '', '', '', '', '']

		// 4chan made Orteil do it
		if (Math.random() < 1 / 2000) {
			return chooseFromArray(['Gabe Newell', 'Elvis Presley']);
		}

		return chooseFromArray(prefixes) + chooseFromArray(firstNames) + ' ' + chooseFromArray(lastNames) + chooseFromArray(suffixes);
	}
}