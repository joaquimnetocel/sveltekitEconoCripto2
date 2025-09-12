import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';
import { funcaoHighest } from '$lib/indicadores/funcaoHighest';

export function funcaoCriarHighest({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}): typePonto[] {
	if (velas === undefined) return [];
	const highs = velas.map((current) => current.y[1]);
	const highest = funcaoHighest({
		periodo,
		valores: highs,
	});

	return velas.map((current, i) => {
		if (i < periodo) {
			return {
				x: current.x,
				y: null,
			};
		}
		return {
			x: current.x,
			y: highest[i - periodo],
		};
	});
}
