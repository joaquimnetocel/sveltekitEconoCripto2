import type { typeVela } from '$lib/apex/typeVela';

export async function funcaoKucoinParaApex(par: string[][]) {
	return par.map((current) => {
		const retorno: typeVela = {
			x: new Date(Number(current[0]) * 1000),
			y: [Number(current[1]), Number(current[3]), Number(current[4]), Number(current[2])],
		};
		return retorno;
	});
}

// Start time of the candle cycle,
// opening price,
// closing price,
// highest price,
// Lowest price,
// Transaction volume (in base asset),
// Transaction amount (in quote asset)
