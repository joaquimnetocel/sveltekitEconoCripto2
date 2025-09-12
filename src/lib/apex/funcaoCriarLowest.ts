import type { typePonto } from '$lib/apex/typePonto';
import type { typeVela } from '$lib/apex/typeVela';
import { funcaoLowest } from '$lib/indicadores/funcaoLowest';

export function funcaoCriarLowest({
	velas,
	periodo,
}: {
	velas: typeVela[];
	periodo: number;
}): typePonto[] {
	if (velas === undefined) return [];
	const lows = velas.map((current) => current.y[2]);
	const lowest = funcaoLowest({
		periodo,
		valores: lows,
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
			y: lowest[i - periodo],
		};
	});
}
