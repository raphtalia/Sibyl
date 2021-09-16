// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
export function uniq_fast(inputArray: any[]): any[] {
	const seen = {};
	const outputArray = [];

	for (let i = 0; i < inputArray.length; i++) {
		let item = inputArray[i];

		// @ts-ignore
		if (seen[item] !== 1) {
			// @ts-ignore
			seen[item] = 1;
			outputArray.push(item);
		}
	}

	return outputArray;
}
