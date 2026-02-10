import { chooseFromArray } from './misc.ts';

export class NameGenerator {
	public static continent() : string {
		const prefixes = ['North Ame', 'South Ame', 'Afr', 'As', 'Ant', 'Eur', 'Oc'];
		const suffixes = ['rica', 'ica', 'ope', 'ia', 'arctica', 'ceana'];

		return chooseFromArray(prefixes) + chooseFromArray(suffixes);
	}
}